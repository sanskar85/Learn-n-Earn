const jwt = require('jsonwebtoken');
const Notice = require('../../models/exam/Notice');
const Examination = require('../../models/exam/Examination');
const Interview = require('../../models/exam/Interview');
const CandidateDetails = require('../../models/users/CandidateDetails');
const Team = require('../../models/users/Team');
const OfferLetter = require('../../models/exam/OfferLetter');
const Question = require('../../models/exam/Question');
const { ExamCompleted } = require('../../utils/EmailTemplates');
const { SendSMS, SendEmail } = require('../../utils/Messaging');
const { CandidateStatus, ExaminationStatus, InterviewStatus } = require('../../utils/Enums');
const fs = require('fs');

addMinutes = function (minutes) {
	var date = new Date();
	date.setMinutes(date.getMinutes() + minutes);
	return date;
};

exports.MyDashboard = async (req, res) => {
	const details = req.userDetails;
	try {
		const notices = await Notice.find({ candidate: req.userDetails }).sort({ createdAt: -1 });

		const _examination = await Examination.findOne({
			candidate: req.userDetails._id,
		});
		const exam = {
			report: '',
			marks: '',
		};
		if (_examination) {
			exam.report =
				_examination.marks_obtained >= Number(process.env.PASSING_MARKS) ? 'PASS' : 'FAIL';
			exam.marks = `${_examination.marks_obtained || 0} / ${process.env.TOTAL_QUESTIONS}`;
		}

		const _interview = await Interview.findOne({
			candidate: req.userDetails._id,
		});
		const interview = {
			time: 'to be scheduled',
			link: '',
		};
		if (_interview && _interview.status === InterviewStatus.SCHEDULED) {
			interview.time = _interview.scheduled_time;
			interview.link = _interview.meeting_link;
		}

		const _agent = await Team.findById(details.referred_by);
		let agent = {
			name: _agent.name,
			mobile: _agent.mobile,
			email: _agent.email,
		};

		return res.status(200).json({
			success: true,
			message: 'Dashboard',
			details: {
				name: details.name,
				status: details.status,
				canGiveExam: details.exam_attempt_remaining !== 0,
			},
			notices: notices,
			interview: interview,
			exam: exam,
			agent: agent,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.createprofile = async (req, res) => {
	const {
		name,
		fname,
		DOB,
		gender,
		aadhaar,
		pincode,
		state,
		district,
		qualification,
		diploma,
		y_o_p,
		cgpa,
		backlog,
		college,
		opportunity,
		plant_worked,
		height,
		weight,
		pwd,
		referral_mob,
		work_experience,
		photo,
		aadhaar_photo,
	} = req.body;
	if (
		!name ||
		!fname ||
		!DOB ||
		!gender ||
		!aadhaar ||
		!pincode ||
		!state ||
		!district ||
		!qualification ||
		!diploma ||
		!y_o_p ||
		!cgpa ||
		!backlog ||
		!college ||
		!opportunity ||
		!plant_worked ||
		!height ||
		!weight ||
		!pwd ||
		!work_experience
	) {
		return res.status(400).json({
			success: false,
			message: 'Please fill all the fields an documents',
		});
	}

	try {
		const team = await Team.findOne({
			mobile: referral_mob,
		});
		if (referral_mob && !team) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Referral Mobile Number',
			});
		}
		const available = await CandidateDetails.findOne({ aadhaar });
		if (available) {
			return res.status(400).json({
				success: false,
				message: 'Aadhaar Already registered to another account',
			});
		}

		const details = await CandidateDetails.findOne({ candidate: req.user._id });
		details.name = name;
		details.fname = fname;
		details.DOB = DOB;
		details.gender = gender;
		details.aadhaar = aadhaar;
		details.pincode = pincode;
		details.state = state;
		details.district = district;
		details.qualification = qualification;
		details.diploma = diploma;
		details.y_o_p = y_o_p;
		details.cgpa = cgpa;
		details.backlog = backlog;
		details.college = college;
		details.opportunity = opportunity;
		details.plant_worked = plant_worked;
		details.height = height;
		details.weight = weight;
		details.pwd = pwd;
		details.work_experience = work_experience;
		if (team) {
			details.referred_by = team;
		}

		await details.save();
		return res.status(201).json({
			success: true,
			message: 'Profile Saved',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.startTest = async (req, res) => {
	try {
		const _user = req.userDetails;
		if (_user.exam_attempt_remaining === 0) {
			return res.status(403).json({
				success: true,
				message: 'You are not permitted to give any more exams.',
			});
		}

		const exam = await Examination.findOne({ candidate: _user._id });

		const questions = await Question.getQuestions();
		const question = JSON.stringify(questions);
		if (exam) {
			exam.questions = questions;
			exam.status = ExaminationStatus.STARTED;
			await exam.save();
		} else {
			await Examination.create({
				candidate: _user,
				questions,
				status: ExaminationStatus.STARTED,
			});
		}

		res.status(200).json({
			success: true,
			questions: question,
			user: {
				name: _user.name,
				dp: _user.photo,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};
exports.submitTest = async (req, res) => {
	let { answers } = req.body;
	try {
		const examination = await Examination.findOne({ candidate: req.userDetails._id }).populate(
			'questions'
		);

		if (!examination) {
			return res.status(400).json({
				success: false,
				message: 'Submission prohibited. Please contact administrator.',
			});
		}

		let marks = process.env.MODE !== 'development' ? 0 : 40;
		answers = JSON.parse(answers);
		for (const answer of answers) {
			const question = await Question.findById(answer.id).select('answer');
			if (
				question &&
				examination.questions.includes(question) &&
				question.answer === answer.answer
			) {
				marks++;
			}
		}

		examination.marks_obtained = marks;
		const report = marks >= Number(process.env.PASSING_MARKS);
		examination.status = report ? ExaminationStatus.PASS : ExaminationStatus.FAIL;
		await examination.save();

		if (report) {
			await SendSMS(
				`Dear candidate, you have successfully passed the examination. Please wait for the further process of Interview, our team will contact you. Regards Factory Jobs Team`,
				req.user.mobile
			);

			await SendEmail(req.user.email, 'Factory Jobs', ExamCompleted());

			await Notice.create({
				candidate: req.userDetails,
				message: `Please wait till our team initiates Interview process.`,
			});
		}

		res.status(200).json({
			success: true,
			message: examination._id,
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			success: false,
			message: 'Submission Error. Please contact our team ',
		});
	}
};

exports.examResult = async (req, res) => {
	let id = req.params.id;
	if (!id) {
		return res.status(400).json({
			success: false,
			message: 'Invalid Exam ID',
		});
	}
	try {
		const examination = await Examination.findById(id);

		if (!examination) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Exam ID',
			});
		}

		const marks = examination.marks_obtained;

		const user = await CandidateDetails.findById(examination.candidate);
		let _message;
		if (user.status === CandidateStatus.ELIGIBLE) {
			_message = `You have ${user.exam_attempt_remaining} more attempt left.`;
		} else if (user.status === CandidateStatus.INTERVIEW) {
			_message = 'Our team will contact you for futher process.';
		} else if (user.status === CandidateStatus.FAILED) {
			_message = 'You cannot give more exam. If you have any query please submit your query.';
		}

		res.status(200).json({
			success: true,
			name: user.name,
			message: _message,
			report: marks >= Number(process.env.PASSING_MARKS) ? ' PASS ' : ' FAIL ',
			marks: `${marks} / ${process.env.TOTAL_QUESTIONS}`,
		});
	} catch (err) {
		return res.status(400).json({
			success: false,
			message: 'Invalid Exam ID',
		});
	}
};

exports.DownloadOfferLetter = async (req, res) => {
	try {
		const offer = await OfferLetter.findOne({ candidate: req.userDetails });
		if (!offer || !offer.application_id) {
			return res.status(404).json({
				success: false,
				message: 'Offer letter not generated yet',
			});
		}
		try {
			const fileName = 'Offer-Letter.pdf';
			const fileURL = __basedir + '/static/offer-letters/' + offer.application_id + '.pdf';
			const stream = fs.createReadStream(fileURL);
			res.set({
				'Content-Disposition': `attachment; filename='${fileName}'`,
				'Content-Type': 'application/pdf',
			});
			stream.pipe(res);
		} catch (e) {
			console.error(e);
			res.status(500).end();
		}
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};
