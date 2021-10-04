const crypto = require('crypto');
const Target = require('../../models/reports/Target');
const CompanyDetail = require('../../models/reports/CompanyDetail');
const CandidateDetails = require('../../models/users/CandidateDetails');
const Candidate = require('../../models/users/Candidate');
const Team = require('../../models/users/Team');
const Examination = require('../../models/exam/Examination');
const Interview = require('../../models/exam/Interview');
const Notice = require('../../models/exam/Notice');
const OfferLetter = require('../../models/exam/OfferLetter');
const {
	OfferTemplate,
	ExamNotification,
	InterviewNotification,
} = require('../../utils/EmailTemplates');
const { SendEmail, SendSMS } = require('../../utils/Messaging');
const { InterviewCompleted } = require('../../utils/EmailTemplates');
const {
	CandidateStatus,
	InterviewStatus,
	ExaminationStatus,
	OfferLetterStatus,
} = require('../../utils/Enums');

const PDFDocument = require('pdfkit');
const fs = require('fs');

const filterMonth = () => {
	const date = new Date();
	const start = new Date(date.getFullYear(), date.getMonth(), 1);
	start.setHours(0, 0, 0, 0);
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	end.setHours(23, 59, 59, 999);
	return {
		createdAt: {
			$gte: start,
			$lt: end,
		},
	};
};

const filterMonthByData = (name, user, extra) => {
	const date = new Date();
	const start = new Date(date.getFullYear(), date.getMonth(), 1);
	start.setHours(0, 0, 0, 0);
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	end.setHours(23, 59, 59, 999);
	if (!extra) {
		return {
			$and: [
				{ [name]: user },
				{
					createdAt: {
						$gte: start,
						$lt: end,
					},
				},
			],
		};
	} else {
		return {
			$and: [
				{ ...extra },
				{ [name]: user },
				{
					createdAt: {
						$gte: start,
						$lt: end,
					},
				},
			],
		};
	}
};

exports.MyDashboard = async (req, res) => {
	const date = new Date();
	const start = new Date(date.getFullYear(), date.getMonth(), 1);
	start.setHours(0, 0, 0, 0);
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	end.setHours(23, 59, 59, 999);

	let unique = [];
	try {
		const pending = await Target.countDocuments({
			$and: [{ team: req.user }, { response: { $exists: false } }],
		});
		const achieved = await Target.countDocuments({
			$and: [{ team: req.user }, { response: { $exists: true } }],
		});

		const students = await CandidateDetails.find({
			referred_by: req.user,
		});
		const interested = await Target.countDocuments({
			$and: [{ team: req.user }, { response: 'Interested' }],
		});

		let examsAttended = await Examination.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $match: { 'details.referred_by': { $eq: req.user._id } } },
		]);
		for (const exam of examsAttended) {
			if (unique.includes(exam.details._id)) {
				continue;
			}
			unique.push(exam.details._id);
		}
		examsAttended = unique.length;

		let interviewPending = 0;

		for (const student of students) {
			if (student.status === CandidateStatus.INTERVIEW) {
				interviewPending++;
			}
		}

		let totalInterviewable = await Interview.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $match: { 'details.referred_by': { $eq: req.user._id } } },
		]);
		const offer = await OfferLetter.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $match: { 'details.referred_by': { $eq: req.user._id } } },
		]);
		let not_issued = 0;
		for (const x of offer) {
			if (x.status === OfferLetterStatus.NOT_ISSUED) not_issued++;
		}
		const target = {
			achieved,
			pending,
		};
		const student_corner = {
			registered: students.length,
			interested: interested,
			percantage1: (students.length * 100) / (students.length + interested) || 0,
			percantage2: (interested * 100) / (students.length + interested) || 0,
		};

		const exam_report = {
			total: students.length,
			attended: examsAttended,
			not_attended: students.length - examsAttended,
			percantage1: (examsAttended * 100) / students.length || 0,
			percantage2: ((students.length - examsAttended) * 100) / students.length || 0,
		};

		const interview_report = {
			total: totalInterviewable.length,
			pending: interviewPending,
			completed: totalInterviewable.length - interviewPending,
			percantage1:
				((totalInterviewable.length - interviewPending) * 100) / totalInterviewable.length || 0,
			percantage2: (interviewPending * 100) / totalInterviewable.length || 0,
		};

		const offer_letter_report = {
			total: offer.length,
			issued: offer.length - not_issued,
			not_issued: not_issued,
			percantage1: ((offer.length - not_issued) * 100) / offer.length || 0,
			percantage2: (not_issued * 100) / offer.length || 0,
		};

		res.status(200).json({
			success: true,
			call_target: target,
			student_corner,
			exam_report,
			interview_report,
			offer_letter_report,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.Student = async (req, res) => {
	const project = {
		_id: 1,
		aadhaar: 1,
		backlog: 1,
		cgpa: 1,
		college: 1,
		diploma: 1,
		district: 1,
		fname: 1,
		gender: 1,
		height: 1,
		name: 1,
		opportunity: 1,
		pincode: 1,
		plant_worked: 1,
		pwd: 1,
		qualification: 1,
		state: 1,
		weight: 1,
		work_experience: 1,
		y_o_p: 1,
		mobile: 1,
		email: 1,
		DOB: 1,
		registration_date: 1,
		examination: 1,
		offer_letter: 1,
		interview: 1,
	};
	try {
		const candidates = await CandidateDetails.aggregate([
			{ $match: { referred_by: { $eq: req.user._id } } },
			{
				$match: { status: { $nin: [CandidateStatus.NOT_VERIFIED, CandidateStatus.NOT_ELIGIBLE] } },
			},
			{ $match: { name: { $exists: true, $ne: null } } },
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $addFields: { details: { $arrayElemAt: ['$details', 0] } } },
			{ $addFields: { mobile: '$details.mobile' } },
			{ $addFields: { email: '$details.email' } },
			{ $addFields: { registration_date: '$details.createdAt' } },
			{
				$lookup: {
					from: Examination.collection.name,
					localField: '_id',
					foreignField: 'candidate',
					as: 'examination',
				},
			},
			{ $addFields: { examination: '$examination.status' } },
			{ $addFields: { examination: { $arrayElemAt: ['$examination', 0] } } },
			{
				$lookup: {
					from: Interview.collection.name,
					localField: '_id',
					foreignField: 'candidate',
					as: 'interview',
				},
			},
			{ $addFields: { interview: { $arrayElemAt: ['$interview', 0] } } },
			{ $addFields: { interview: '$interview.status' } },
			{
				$lookup: {
					from: OfferLetter.collection.name,
					localField: '_id',
					foreignField: 'candidate',
					as: 'offerletter',
				},
			},
			{ $addFields: { offerletter: { $arrayElemAt: ['$offerletter', 0] } } },
			{ $addFields: { offer_letter: '$offerletter.status' } },
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		const interested = await Target.find({
			team: req.user,
			response: 'Interested',
		}).sort({ createdAt: 1 });

		const profile_not_completed = await CandidateDetails.aggregate([
			{ $match: { referred_by: { $eq: req.user._id } } },
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $addFields: { details: { $arrayElemAt: ['$details', 0] } } },
			{ $addFields: { mobile: '$details.mobile' } },
			{ $addFields: { email: '$details.email' } },
			{ $match: { name: { $eq: null } } },
			{ $addFields: { registration_date: '$details.createdAt' } },
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		const not_verified = await CandidateDetails.aggregate([
			{ $match: { referred_by: { $eq: req.user._id } } },
			{ $match: { status: { $eq: CandidateStatus.NOT_VERIFIED } } },
			{ $match: { name: { $exists: true, $ne: null } } },
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $addFields: { details: { $arrayElemAt: ['$details', 0] } } },
			{ $addFields: { mobile: '$details.mobile' } },
			{ $addFields: { email: '$details.email' } },
			{ $addFields: { registration_date: '$details.createdAt' } },
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		res.status(200).json({
			success: true,
			candidates,
			interested,
			profile_not_completed,
			not_verified,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.UpdateStudentStatus = async (req, res) => {
	const { id, status } = req.body;
	if (!id || !status)
		return res.status(400).json({ success: false, message: 'Missing Credentials' });
	try {
		const candidate = await CandidateDetails.findById(id);
		if (!candidate) {
			return res.status(404).json({ success: false, message: 'Student Not Found' });
		}
		if (status === 'Eligible') {
			candidate.status = CandidateStatus.ELIGIBLE;
		} else {
			candidate.status = CandidateStatus.NOT_ELIGIBLE;
			candidate.remarks = status;
		}
		await candidate.save();
		res.status(201).json({
			success: true,
			message: 'Status Updated',
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.UpdateCandidatesDetail = async (req, res) => {
	const { details } = req.body;
	try {
		if (!details) {
			res.status(400).json({
				success: false,
				message: 'Invalid Candidate Id',
			});
		}
		const candidate = await CandidateDetails.findById(details._id);
		if (!candidate) {
			res.status(400).json({
				success: false,
				message: 'Invalid Candidate Id',
			});
		}
		candidate.name = details.name;
		candidate.fname = details.fname;
		candidate.gender = details.gender;
		candidate.aadhaar = details.aadhaar;
		candidate.qualification = details.qualification;
		candidate.diploma = details.diploma;
		candidate.y_o_p = details.y_o_p;
		candidate.cgpa = details.cgpa;
		candidate.backlog = details.backlog;
		candidate.college = details.college;
		candidate.height = details.height;
		candidate.weight = details.weight;
		candidate.plant_worked = details.plant_worked;
		candidate.pwd = details.pwd;
		candidate.work_experience = details.work_experience;
		await candidate.save();
		return res.status(201).json({
			success: true,
			message: 'Candidate details updated',
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.StudentNotRespondingExam = async (req, res) => {
	const { id } = req.body;
	if (!id) return res.status(400).json({ success: false, message: 'Missing Credentials' });
	try {
		const candidate = await CandidateDetails.findById(id);
		if (!candidate) {
			return res.status(404).json({ success: false, message: 'Student Not Found' });
		}
		if (candidate.status === CandidateStatus.ELIGIBLE) {
			candidate.status = CandidateStatus.NOT_RESPONDING_EXAM;
			await candidate.save();
			res.status(201).json({
				success: true,
				message: 'Candidate Status Updated',
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Candidates should be eligible for exam to set Not responding for exam',
			});
		}
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.StudentNotRespondingInterview = async (req, res) => {
	const { id } = req.body;
	if (!id) return res.status(400).json({ success: false, message: 'Missing Credentials' });
	try {
		const candidate = await CandidateDetails.findById(id);
		if (!candidate) {
			return res.status(404).json({ success: false, message: 'Student Not Found' });
		}
		if (candidate.status === CandidateStatus.INTERVIEW) {
			candidate.status = CandidateStatus.NOT_RESPONDING_INTERVIEW;
			const interview = await Interview.findOne({ candidate });
			if (interview) {
				interview.scheduled_time = undefined;
				interview.meeting_link = undefined;
				interview.status = undefined;
				interview.source = undefined;
				interview.interview_mode = undefined;
				interview.documents_verified = undefined;
				interview.candidate_need = undefined;
				interview.financial_background = undefined;
				interview.english = undefined;
				interview.maths = undefined;
				interview.gk = undefined;
				interview.ignou = undefined;
				interview.result = undefined;
				interview.industry = undefined;
				interview.remarks = undefined;
				await interview.save();
			}
			await candidate.save();
			res.status(201).json({
				success: true,
				message: 'Candidate Status Updated',
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Candidates should be eligible for interview to set Not responding for interview',
			});
		}
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.StudentNotRespondingAdmission = async (req, res) => {
	const { id } = req.body;
	if (!id) return res.status(400).json({ success: false, message: 'Missing Credentials' });
	try {
		const candidate = await CandidateDetails.findById(id);
		if (!candidate) {
			return res.status(404).json({ success: false, message: 'Student Not Found' });
		}
		if (candidate.status === CandidateStatus.OFFER_LETTER) {
			candidate.status = CandidateStatus.NOT_RESPONDING_ADMISSION;
			await candidate.save();
			res.status(201).json({
				success: true,
				message: 'Candidate Status Updated',
			});
		} else {
			res.status(400).json({
				success: false,
				message:
					'Candidates should be eligible for offer letter to set Not responding for offer letter',
			});
		}
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.Examination_Details = async (req, res) => {
	const project = {
		_id: 1,
		student_id: 1,
		marks_obtained: 1,
		status: 1,
		mobile: 1,
		email: 1,
		state: 1,
		name: 1,
		examination_date: 1,
		registration_date: 1,
		interview: 1,
	};
	try {
		const attended = await Examination.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $addFields: { details: { $arrayElemAt: ['$details', 0] } } },
			{ $addFields: { name: '$details.name' } },
			{ $addFields: { state: '$details.state' } },
			{ $addFields: { student_id: '$details._id' } },
			{ $addFields: { user: '$details.candidate' } },
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
			{ $addFields: { mobile: '$user.mobile' } },
			{ $addFields: { email: '$user.email' } },
			{ $addFields: { examination_date: '$createdAt' } },
			{ $match: { 'details.referred_by': { $eq: req.user._id } } },
			{
				$match: {
					status: { $in: [ExaminationStatus.PASS, ExaminationStatus.FAIL] },
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		const not_attended = await CandidateDetails.aggregate([
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
			{ $addFields: { mobile: '$user.mobile' } },
			{ $addFields: { email: '$user.email' } },
			{ $addFields: { registration_date: '$createdAt' } },
			{ $addFields: { student_id: '$_id' } },
			{ $match: { referred_by: { $eq: req.user._id } } },
			{ $match: { status: { $eq: CandidateStatus.ELIGIBLE } } },
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		const not_responding = await CandidateDetails.aggregate([
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
			{ $addFields: { mobile: '$user.mobile' } },
			{ $addFields: { email: '$user.email' } },
			{ $addFields: { registration_date: '$createdAt' } },
			{ $addFields: { student_id: '$_id' } },
			{ $match: { referred_by: { $eq: req.user._id } } },
			{ $match: { status: { $eq: CandidateStatus.NOT_RESPONDING_EXAM } } },
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		res.status(201).json({
			success: true,
			attended,
			not_attended,
			not_responding,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.FetchProfile = async (req, res) => {
	const team = req.user;
	const profile = {
		name: team.name,
		photo: team.photo,
		mobile: team.mobile,
		email: team.email,
		online: team.online,
	};
	res.status(200).json({
		success: true,
		profile,
	});
};

exports.UpdateProfile = async (req, res) => {
	const { name, mobile, current, password } = req.body;
	try {
		const team = await Team.findById(req.user._id).select('password');
		team.name = name;
		team.mobile = mobile;
		if (current) {
			const matched = await team.verifyPassword(current);
			if (matched) {
				team.password = password;
			} else {
				return res.status(403).json({
					status: false,
					message: 'Invalid Password',
				});
			}
		}
		await team.save();

		res.status(201).json({
			success: true,
			message: 'Profile Updated',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.UpdateProfileImage = async (req, res) => {
	const { photo } = req.body;
	try {
		const team = await Team.findById(req.user._id);
		team.photo = photo;
		await team.save();

		res.status(201).json({
			success: true,
			message: 'Profile Photo Updated',
			photo,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.NotifyCandidate = async (req, res) => {
	const { id, methods } = req.body;
	try {
		const candidate = await CandidateDetails.findOne({ _id: id }).populate('candidate');

		if (methods.includes('sms')) {
			await SendSMS(
				`Dear candidate kindly attend online examination within 3 days. Regards Factory Jobs Team.`,
				candidate.mobile
			);
		}
		if (methods.includes('email')) {
			await SendEmail(
				candidate.candidate.email,
				'Examination Remainder - Factory Jobs',
				ExamNotification()
			);
		}
		if (methods.includes('dashboard')) {
			await Notice.create({
				candidate: candidate,
				message: `Dear candidate kindly attend online examination within 3 days.`,
			});
		}
		res.status(201).json({
			success: true,
			message: 'Notification Sent',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.InterviewDetails = async (req, res) => {
	const project = {
		_id: 1,
		meeting_id: 1,
		marks_obtained: 1,
		status: 1,
		mobile: 1,
		email: 1,
		state: 1,
		name: 1,
		aadhaar: 1,
		scheduled_time: 1,
		meeting_link: 1,
		registration_date: 1,
	};
	try {
		const interview_details = await Interview.aggregate([
			{ $addFields: { meeting_id: '$_id' } },
			{ $addFields: { _id: '$candidate' } },
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $addFields: { details: { $arrayElemAt: ['$details', 0] } } },
			{ $addFields: { name: '$details.name' } },
			{ $addFields: { state: '$details.state' } },
			{ $addFields: { aadhaar: '$details.aadhaar' } },
			{ $addFields: { user: '$details.candidate' } },
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
			{ $addFields: { mobile: '$user.mobile' } },
			{ $addFields: { email: '$user.email' } },
			{ $addFields: { candidate_status: '$details.status' } },
			{ $match: { candidate_status: { $ne: CandidateStatus.NOT_RESPONDING_INTERVIEW } } },
			{ $match: { 'details.referred_by': { $eq: req.user._id } } },
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		const not_responding = await CandidateDetails.aggregate([
			{ $match: { status: { $eq: CandidateStatus.NOT_RESPONDING_INTERVIEW } } },
			{ $match: { referred_by: { $eq: req.user._id } } },
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'candidate',
				},
			},
			{ $addFields: { candidate: { $arrayElemAt: ['$candidate', 0] } } },
			{ $addFields: { mobile: '$candidate.mobile' } },
			{ $addFields: { email: '$candidate.email' } },
			{ $addFields: { registration_date: '$createdAt' } },
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		res.status(200).json({
			success: true,
			interview_details,
			not_responding,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.CreateMeeting = async (req, res) => {
	const { id, details } = req.body;
	try {
		const interview = await Interview.findById(id);
		if (!interview) {
			return res.status(400).json({
				success: false,
				message: 'Interview Id  Not Found',
			});
		}
		interview.scheduled_time = new Date(details.date);
		interview.meeting_link = details.link;
		interview.status = InterviewStatus.SCHEDULED;
		interview.source = undefined;
		interview.interview_mode = undefined;
		interview.documents_verified = undefined;
		interview.candidate_need = undefined;
		interview.financial_background = undefined;
		interview.english = undefined;
		interview.maths = undefined;
		interview.gk = undefined;
		interview.ignou = undefined;
		interview.result = undefined;
		interview.industry = undefined;
		interview.remarks = undefined;

		const candidate = await CandidateDetails.findById(interview.candidate).populate('candidate');
		candidate.status = CandidateStatus.INTERVIEW;
		await candidate.save();
		await interview.save();
		await SendSMS(
			`Dear candidate kindly attend interview on schedule date. Regards Factory Jobs Team.`,
			candidate.candidate.mobile
		);
		await SendEmail(
			candidate.candidate.email,
			'Interview Remainder - Factory Jobs',
			InterviewNotification()
		);
		await Notice.create({
			candidate: candidate,
			message: `Dear candidate kindly attend interview on schedule date.`,
		});
		res.status(200).json({
			success: true,
			message: 'Interview Scheduled',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.CreateInterviewResponse = async (req, res) => {
	const { id, details } = req.body;
	try {
		const interview = await Interview.findById(id);
		if (!interview) {
			return res.status(400).json({
				success: false,
				message: 'Interview Id  Not Found',
			});
		}
		interview.interview_mode = details.interview_mode;
		interview.documents_verified = details.documents_verified;
		interview.candidate_need = details.candidate_need;
		interview.financial_background = details.financial_background;
		interview.english = details.english;
		interview.maths = details.maths;
		interview.gk = details.gk;
		interview.ignou = details.ignou;
		interview.result = details.result;
		interview.industry = details.industry;
		interview.remarks = details.remarks;
		await interview.save();

		const candidateDetails = await CandidateDetails.findById(interview.candidate).populate(
			'candidate'
		);
		candidateDetails.income = details.income;
		await candidateDetails.save();
		if (details.result === 'Pass') {
			await SendSMS(
				`Dear candidate, you have successfully passed the interview. Please wait for the further process of Admission, our team will contact you. Regards Factory Jobs Team`,
				candidateDetails.candidate.mobile
			);

			await SendEmail(candidateDetails.candidate.email, 'Factory Jobs', InterviewCompleted());

			await Notice.create({
				candidate: candidateDetails,
				message: `Please report your Initial Rope In location on reporting time.`,
			});
		}

		res.status(200).json({
			success: true,
			message: 'Interview Response Saved',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.OfferLetter = async (req, res) => {
	const project = {
		_id: 0,
		offer_id: 1,
		industry: 1,
		status: 1,
		mobile: 1,
		email: 1,
		state: 1,
		name: 1,
		aadhaar: 1,
	};
	try {
		const offer_details = await OfferLetter.aggregate([
			{ $addFields: { offer_id: '$_id' } },
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $addFields: { details: { $arrayElemAt: ['$details', 0] } } },
			{ $addFields: { name: '$details.name' } },
			{ $addFields: { state: '$details.state' } },
			{ $addFields: { aadhaar: '$details.aadhaar' } },
			{ $addFields: { user: '$details.candidate' } },
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
			{ $addFields: { mobile: '$user.mobile' } },
			{ $addFields: { email: '$user.email' } },
			{ $match: { 'details.referred_by': { $eq: req.user._id } } },
			{ $match: { status: { $eq: OfferLetterStatus.NOT_ISSUED } } },
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);

		res.status(200).json({
			success: true,
			offer_details,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.CreateOfferLetter = async (req, res) => {
	const { offer_id, details } = req.body;
	try {
		const offer = await OfferLetter.findById(offer_id).populate('candidate');
		if (!offer) {
			return res.status(400).json({
				success: false,
				message: 'Offer Id  Not Found',
			});
		}
		offer.issue_date = new Date().toDateString();
		offer.reporting_date = new Date(details.issue_date).toDateString();
		offer.status = OfferLetterStatus.ISSUED;
		offer.stipend = details.stipend;
		if (!offer.application_id)
			offer.application_id = crypto.randomBytes(5).toString('hex').toUpperCase();
		await offer.save();

		const detail = await CandidateDetails.findById(offer.candidate);
		await detail.save();

		const candidate = await Candidate.findById(offer.candidate.candidate);

		const company = await CompanyDetail.findOne({
			company_name: offer.industry,
		});

		const company_name = company.company_name;
		const years = company.term;
		const stipend = offer.stipend;
		const timing = offer.reporting_date;

		const doc = new PDFDocument({ autoFirstPage: false });
		doc.pipe(fs.createWriteStream(__basedir + `/static/offer-letters/${offer.application_id}.pdf`));
		doc.addPage({
			margins: {
				top: 50,
				bottom: 50,
				left: 30,
				right: 0,
			},
		});

		doc.image(__basedir + '/static/assets/d934ed8b-dd96-440e-9491-7523302dab8f.png', 30, 25);
		doc.image(__basedir + '/static/assets/0ecd73f8-dad7-40c3-aea7-086063fa6dec.png', 435, 25, {
			width: 130,
		});
		doc.text(`Dear, ${detail.name}`, 30, 100);
		doc.text(`Date: ${new Date(details.issue_date).toDateString()}`, 450, 100);
		doc.text(`F/N Mr. ${detail.fname}`, 30, 115);
		doc.text(`Applicant ID : ${offer.application_id}`, 450, 115);
		doc.text(`Highest Qualification ${detail.qualification}`, 30, 130);
		doc.text(`Aadhaar Number : ${detail.aadhaar}`, 30, 145);
		doc.text(`Mobile Number  : ${candidate.mobile}`, 30, 160);
		doc.text(`District ${detail.district}:, State : ${detail.state}`, 30, 175);
		doc.text(`Pincode : ${detail.pincode}`, 30, 190);

		doc.text(`Subject: Provisional Offer for NEEM Training Program`, 30, 220, { underline: true });

		doc.text(
			`Nettur Technical Training Foundation (NTTF), one of the premier technical training institutions in the country, partnering with ${company_name} has announced the admissions to the “National Employability Enhancement Mission” – ‘NEEM’ Program under the aegis of AICTE. The objective of this training is “Skill building through on-the-job training at the designated industry” conducted as per NTTF’s LEARN AND EARN training model.`,
			30,
			250,
			{
				width: 535,
			}
		);
		doc.text(
			`With reference to your application and the screening/ counselling session you attended, we are pleased to provisionally select you for consideration of ${years} Years Learn and Earn programme leading to “Diploma in Manufacturing Technology” certification conducted by Nettur Technical Training Foundation, Bangalore. Please note that this training to you is free of cost. Upon admission to this programme you are entitled to get monthly stipend amount Rs. ${stipend}/- approx. in your bank account. This program does not guarantee any sort of employment either in the Partner industry or in NTTF and this is only a skill-oriented Technical Training program conducted at our partner industry to enable you to acquire the industry employable skills.`,
			30,
			350,
			{
				width: 535,
			}
		);
		doc
			.text(
				'NTTF’s ‘Learn and Earn’ programme will be conducted through on-the-job training at ',
				30,
				490,
				{
					continued: true,
				}
			)
			.font('Times-Bold')
			.text(company_name, {
				continued: true,
			})
			.font('Times-Roman')
			.text(' along with regular theory sessions, by NTTF.');
		// doc.rect(10, 90, 590, 0.1).stroke();
		doc
			.font('Times-Bold')
			.text(`The Programme will commence from ${timing}. Please report on time .`, 30, 530);

		doc.rect(30, 550, 535, 20).stroke();
		doc.fontSize(10);
		doc.text(`Initial Rope-In / Induction Classes / Theory will be conducted at`, 40, 555);
		doc.text(`OJT / Practical classes will be conducted at`, 350, 555);
		doc.rect(30, 550, 300, 200).stroke();
		doc.rect(330, 550, 235, 200).stroke();

		doc
			.fontSize(11)
			.font('Times-Bold')
			.text(company.rope_in_1, 30, 580, {
				width: 300,
				align: 'center',
			})
			.font('Times-Roman')
			.text(company.rope_in_2, 30, 595, {
				width: 300,
				align: 'center',
			})
			.text(company.rope_in_3, 30, 610, {
				width: 300,
				align: 'center',
			})
			.text(company.rope_in_4, 30, 625, {
				width: 300,
				align: 'center',
			})
			.font('Times-Italic')
			.fillColor('blue')
			.fontSize(10)
			.text(`Google Location - ${company.rope_in_location}`, 30, 640, {
				width: 300,
				align: 'center',
			})
			.fontSize(11)
			.font('Times-Roman')
			.fillColor('black')
			.text('for any assistance', 30, 665, {
				width: 300,
				align: 'center',
			})
			.text(company.rope_in_assistance, 30, 675, {
				width: 300,
				align: 'center',
			})
			.text('or email ', 30, 685, {
				width: 300,
				align: 'center',
			});

		doc
			.fontSize(11)
			.font('Times-Bold')
			.text(company.practical_1, 330, 580, {
				width: 235,
				align: 'center',
			})
			.font('Times-Roman')
			.text(company.practical_2, 330, 595, {
				width: 235,
				align: 'center',
			})
			.text(company.practical_3, 330, 610, {
				width: 235,
				align: 'center',
			})
			.text(company.practical_4, 330, 625, {
				width: 235,
				align: 'center',
			});
		doc
			.font('Times-BoldItalic')
			.text('(Smart Phone Not Allowed inside the classroom or plant)', 30, 700, {
				width: 300,
				align: 'center',
			});
		doc
			.font('Times-BoldItalic')
			.text('(Smart Phone Not Allowed inside the classroom or plant)', 330, 700, {
				width: 235,
				align: 'center',
			});

		doc.addPage({
			margins: {
				top: 50,
				bottom: 50,
				left: 30,
				right: 0,
			},
		});
		doc.font('Times-Roman').fontSize(12);
		doc.text(
			`Please note at the time of admission, you must give a declaration that you will complete admission in any Bachelor course at IGNOU/or at any distance education University, at your cost, failing which you will not be considered for continuing the program.`,
			30,
			10,
			{ width: 535 }
		);
		doc.text(
			`Please bring all original certificates, ID proof, address proof (Aadhar card preferred) and six passport size photographs. These original documents will be returned after taking copies with an affidavit.  Please provide your bank account details- Preferable banks are ICICI/ SBI/ SVCB. Your selection is subject to fulfilling the admission formalities of NTTF, mainly your physical fitness and credentials in all respects duly certified by competent authorities. During the programme you are entitled to receive a consolidated monthly stipend, which is subject to your 100% attendance for the theory and practical classes and your performance in terms of your attitude towards industrial working conditions. In addition, you will be covered under personal accident insurance, Mediclaim insurance and you will be provided uniform, safety shoes & subsidised working lunch during the programme.`,
			30,
			60,
			{ width: 535 }
		);
		doc
			.text(
				`During on-the-job training, you may be required to work in shifts, as needed. It is mandatory to attain 100% attendance for the theory classes at NTTF and the practical sessions. It is expected that you devote the necessary time, ability, and attention to the programme for its successful completion `,
				30,
				190,
				{ width: 535, continued: true }
			)
			.font('Times-Bold')
			.text(company_name, {
				continued: true,
			})
			.font('Times-Roman')
			.text(
				'. management has the right to withdraw your admission without any kind of compensation at any future date, in case any of the information provided by you is found incorrect or if you fail to demonstrate acceptable performance levels or found to violate the rules and regulations of the programme or the company allocated to you during the programme duration.'
			);
		doc
			.font('Times-Bold')
			.text(
				`Please note that you need to stay in the PG for one month from the date of your arrival. Accommodation & food may be provided to you only for the first month for which you will be charged @ Rs.5,000/- `,
				30,
				295,
				{ width: 535, continued: true }
			)
			.font('Times-Roman')
			.text(
				'which need to be payable by you to the PG owner and accordingly you may come with adequate money for the same. Alternately, you can also make your own accommodation arrangements for stay.'
			);
		doc.text(
			`We congratulate you on your provisional selection and welcome you to NTTF and look forward to your active participation in this programme. Please confirm your acceptance with return mail.`,
			30,
			365,
			{ width: 535 }
		);

		doc.text(`Thanking you,`, 30, 420);
		doc.text(`Regards,`, 30, 450);

		doc.fillColor('#000080').text(`Alok Kumar`, 30, 480);
		doc.fillColor('black').text(`Deputy Manager – Business Development`, 30, 500);

		doc.image(__basedir + '/static/assets/0ecd73f8-dad7-40c3-aea7-086063fa6dec.png', 30, 530, {
			width: 100,
		});

		doc.fillColor('#000080').text(`NETTUR TECHNICAL TRAINING FOUNDATION`, 30, 570);
		doc
			.fontSize(10)
			.font('Times-Bold')
			.fillColor('black')
			.text(`An IMS Certified Training Institute`, 30, 585);
		doc.text(`[ISO 21001, ISO 9001, ISO 14001, ISO 45001]`, 30, 600);
		doc.font('Times-Roman').fillColor('Gray').text(`# 23/24, II Phase,`, 30, 615);
		doc.fillColor('Gray').text(`Peenya Industrial Area,`, 30, 630);
		doc.text(`Bangalore - 560 058`, 30, 645);
		doc.fillColor('red').text(`Mob: 9901126888	`, 30, 660);
		doc
			.fillColor('black')
			.text(`Website: `, 30, 675, { continued: true })
			.fillColor('blue')
			.text(' www.nttftrg.com ', { link: 'www.nttftrg.com' });

		doc.end();

		await SendEmail(
			candidate.email,
			'Offer Letter - Factory Jobs',
			OfferTemplate(offer.candidate.name, company.company_name)
		);
		await SendSMS(
			`${offer.candidate.name} your offer letter for ${company.company_name} has been sent to your dashboard. Kindly download your offer letter`,
			candidate.mobile
		);
		res.status(200).json({
			success: true,
			message: 'Offer Letter Sent',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.DownloadOfferLetter = async (req, res) => {
	const id = req.params.id;
	console.log(id);
	try {
		const offer = await OfferLetter.findOne({ candidate: id });
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

exports.AdmissionAllowed = async (req, res) => {
	return res.status(200).json({
		success: true,
		message: req.user.admission_allowded,
	});
};

exports.AdmissionDetails = async (req, res) => {
	const project = {
		_id: 0,
		candidate_id: 1,
		offer_id: 1,
		aadhaar: 1,
		backlog: 1,
		cgpa: 1,
		college: 1,
		diploma: 1,
		district: 1,
		fname: 1,
		gender: 1,
		height: 1,
		name: 1,
		team_name: 1,
		opportunity: 1,
		pincode: 1,
		plant_worked: 1,
		pwd: 1,
		qualification: 1,
		state: 1,
		weight: 1,
		work_experience: 1,
		y_o_p: 1,
		mobile: 1,
		email: 1,
		DOB: 1,
		registration_date: 1,
		reporting_date: 1,
		examination: 1,
		application_id: 1,
		offer_letter: 1,
		interview: 1,
		industry: 1,
		status: 1,
	};
	try {
		const offer_details = await OfferLetter.aggregate([
			{ $addFields: { offer_id: '$_id' } },
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $addFields: { details: { $arrayElemAt: ['$details', 0] } } },
			{ $addFields: { name: '$details.name' } },
			{ $addFields: { candidate_id: '$details._id' } },
			{ $addFields: { gender: '$details.gender' } },
			{ $addFields: { DOB: '$details.DOB' } },
			{ $addFields: { aadhaar: '$details.aadhaar' } },
			{ $addFields: { fname: '$details.fname' } },
			{ $addFields: { district: '$details.district' } },
			{ $addFields: { state: '$details.state' } },
			{ $addFields: { pincode: '$details.pincode' } },
			{ $addFields: { height: '$details.height' } },
			{ $addFields: { weight: '$details.weight' } },
			{ $addFields: { qualification: '$details.qualification' } },
			{ $addFields: { college: '$details.college' } },
			{ $addFields: { y_o_p: '$details.y_o_p' } },
			{ $addFields: { cgpa: '$details.cgpa' } },
			{ $addFields: { diploma: '$details.diploma' } },
			{ $addFields: { work_experience: '$details.work_experience' } },
			{ $addFields: { user: '$details.candidate' } },
			{
				$lookup: {
					from: Candidate.collection.name,
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
			{ $addFields: { mobile: '$user.mobile' } },
			{ $addFields: { email: '$user.email' } },
			{ $addFields: { team: '$details.referred_by' } },
			{
				$lookup: {
					from: Team.collection.name,
					localField: 'team',
					foreignField: '_id',
					as: 'team',
				},
			},
			{ $addFields: { team: { $arrayElemAt: ['$team', 0] } } },
			{ $addFields: { team_name: '$team.name' } },
			{ $match: { status: { $ne: OfferLetterStatus.NOT_ISSUED } } },
			{
				$match: {
					'details.status': {
						$in: [CandidateStatus.OFFER_LETTER, CandidateStatus.NOT_RESPONDING_ADMISSION],
					},
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $project: project },
		]);
		res.status(200).json({
			success: true,
			offer_details,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.SaveAdmissionDetails = async (req, res) => {
	const { offer_id, details } = req.body;
	try {
		const offer = await OfferLetter.findOne({ _id: offer_id });
		if (!offer) {
			return res.status(400).json({
				success: false,
				message: 'Application Not Found',
			});
		}
		offer.status = details.status;
		offer.remarks = details.remarks;
		await offer.save();
		const candidate = await CandidateDetails.findById(offer.candidate);
		if (details.status === 'Not Responding') {
			candidate.status = CandidateStatus.NOT_RESPONDING_ADMISSION;
			await candidate.save();
		}
		res.status(200).json({
			success: true,
			message: 'Response Saved',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.Targets = async (req, res) => {
	try {
		const target = await Target.find({
			$and: [{ team: req.user }, { response: { $exists: false } }],
		});

		res.status(200).json({
			success: true,
			target,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.UpdateTarget = async (req, res) => {
	const { target_id, details } = req.body;
	try {
		if (target_id) {
			const target = await Target.findById(target_id);
			target.name = details.name;
			target.fname = details.fname;
			target.email = details.email;
			target.mobile1 = details.mobile1;
			target.mobile2 = details.mobile2;
			target.qualification = details.qualification;
			target.call_type = details.call_type;
			target.state = details.state;
			target.source = details.source;
			target.response = details.response;
			await target.save();
		} else {
			await Target.create({
				team: req.user,
				name: details.name,
				fname: details.fname,
				email: details.email,
				mobile1: details.mobile1,
				mobile2: details.mobile2,
				qualification: details.qualification,
				call_type: details.call_type,
				state: details.state,
				source: details.source,
				response: details.response,
			});
		}

		res.status(200).json({
			success: true,
			message: 'Response Added',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.Industries = async (req, res) => {
	try {
		const industry = await CompanyDetail.find({}, { _id: 0, company_name: 1 }).sort({
			company_name: -1,
		});

		res.status(200).json({
			success: true,
			industry,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};
