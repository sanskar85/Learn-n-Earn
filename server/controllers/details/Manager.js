const Manager = require('../../models/users/Manager');
const Target = require('../../models/reports/Target');
const CompanyDetail = require('../../models/reports/CompanyDetail');
const CandidateDetails = require('../../models/users/CandidateDetails');
const Candidate = require('../../models/users/Candidate');
const Team = require('../../models/users/Team');
const Examination = require('../../models/exam/Examination');
const Interview = require('../../models/exam/Interview');
const Question = require('../../models/exam/Question');
const OfferLetter = require('../../models/exam/OfferLetter');
var mongoose = require('mongoose');
const multer = require('multer');
var path = require('path');

const {
	CandidateStatus,
	InterviewStatus,
	ExaminationStatus,
	OfferLetterStatus,
} = require('../../utils/Enums');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'static/Private');
	},
	filename: (req, file, cb) => {
		cb(null, req.filename + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).single('file');

exports.MyDashboard = async (req, res) => {
	const date = new Date();
	const start = new Date(date.getFullYear(), date.getMonth(), 1);
	start.setHours(0, 0, 0, 0);
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	end.setHours(23, 59, 59, 999);

	try {
		const header = {
			registration: 0,
			exam: 0,
			interview: 0,
			offer_letter_issued: 0,
			joined: 0,
		};
		const startOfToday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		header.registration = await CandidateDetails.countDocuments({
			createdAt: { $gte: startOfToday },
		});
		header.exam = await Examination.countDocuments({
			createdAt: { $gte: startOfToday },
		});
		header.interview = await Interview.countDocuments({
			updatedAt: { $gte: startOfToday },
		});
		header.offer_letter_issued = await OfferLetter.countDocuments({
			issue_date: { $eq: startOfToday.toDateString() },
		});
		header.joined = await OfferLetter.countDocuments({
			issue_date: { $eq: startOfToday.toDateString() },
			status: { $eq: OfferLetterStatus.JOINED },
		});

		const registration = {
			convinced: 0,
			registered: 0,
		};
		registration.convinced = await Target.countDocuments({
			response: 'Convinced',
		});
		registration.registered = await CandidateDetails.countDocuments();

		const call_target = {
			total: 0,
			achived: 0,
		};
		call_target.total = await Target.countDocuments();
		call_target.achived = await Target.countDocuments({
			response: { $exists: true, $ne: null },
		});

		const exam_report = {
			total: 0,
			attended: 0,
			pending: 0,
			pass: 0,
			fail: 0,
		};
		exam_report.total = registration.registered;
		exam_report.attended = await Examination.countDocuments();
		exam_report.pending = await CandidateDetails.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: 'candidate',
					foreignField: '_id',
					as: 'details',
				},
			},
			{ $match: { 'details.status': { $eq: CandidateStatus.ELIGIBLE } } },
		]);
		exam_report.pending = exam_report.pending.length;
		exam_report.pass = await Examination.countDocuments({
			status: { $eq: ExaminationStatus.PASS },
		});
		exam_report.fail = await Examination.countDocuments({
			status: { $eq: ExaminationStatus.FAIL },
		});
		const interview_report = {
			total: 0,
			attended: 0,
			pending: 0,
			pass: 0,
			fail: 0,
		};

		interview_report.total = await Interview.countDocuments();
		interview_report.attended = await Interview.countDocuments({
			status: { $in: [InterviewStatus.PASS, InterviewStatus.FAIL] },
		});
		interview_report.pending = interview_report.total - interview_report.attended;
		interview_report.pass = await Interview.countDocuments({
			status: InterviewStatus.PASS,
		});
		interview_report.fail = await Interview.countDocuments({
			status: InterviewStatus.FAIL,
		});

		const offer_letter = {
			total: 0,
			issued: 0,
			pending: 0,
		};
		offer_letter.total = await OfferLetter.countDocuments();
		offer_letter.issued = await OfferLetter.countDocuments({
			status: OfferLetterStatus.ISSUED,
		});
		offer_letter.pending = await OfferLetter.countDocuments({
			status: OfferLetterStatus.NOT_ISSUED,
		});

		const joining_report = {
			total: 0,
			joined: 0,
			pending: 0,
		};
		joining_report.total = offer_letter.issued;
		joining_report.joined = await OfferLetter.countDocuments({
			status: OfferLetterStatus.JOINED,
		});
		joining_report.pending = joining_report.total - joining_report.joined;

		res.status(200).json({
			success: true,
			header,
			registration,
			call_target,
			exam_report,
			interview_report,
			offer_letter,
			joining_report,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.Teams = async (req, res) => {
	const project = {
		_id: 1,
		name: 1,
		mobile: 1,
		email: 1,
		admission_allowded: 1,
		student_count: { $size: '$students' },
		appointed_at: 1,
	};
	try {
		const teams = await Team.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: '_id',
					foreignField: 'referred_by',
					as: 'students',
				},
			},
			{ $project: project },
		]);
		res.status(200).json({
			success: true,
			teams,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.Students = async (req, res) => {
	const project = {
		_id: 1,
		aadhaar: 1,
		aadhaar_photo: 1,
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
		photo: 1,
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
		'team.name': 1,
		'team._id': 1,
	};
	try {
		const students = await CandidateDetails.aggregate([
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
			{ $addFields: { examination: { $arrayElemAt: ['$examination', 0] } } },
			{ $addFields: { examination: '$examination.status' } },
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
			{
				$lookup: {
					from: Team.collection.name,
					localField: 'referred_by',
					foreignField: '_id',
					as: 'team',
				},
			},
			{ $addFields: { team: { $arrayElemAt: ['$team', 0] } } },
			{ $sort: { createdAt: 1 } },
			{ $project: project },
		]);
		res.status(200).json({
			success: true,
			students,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.UpdateCandidatesTeam = async (req, res) => {
	const { team_id, candidates } = req.body;
	try {
		if (team_id && candidates.length > 0) {
			await CandidateDetails.updateMany({ _id: { $in: candidates } }, { referred_by: team_id });
			return res.status(201).json({
				success: true,
				message: 'Team Assignment successful',
			});
		}
		res.status(400).json({
			success: false,
			message: 'Team id is invalid',
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.UpdateTeam = async (req, res) => {
	const { id, info } = req.body;
	try {
		const team = await Team.findById(id);
		team.admission_allowded = info;
		await team.save();

		res.status(201).json({
			success: true,
			message: 'Team Updated',
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
	};
	res.status(200).json({
		success: true,
		profile,
	});
};

exports.UpdateProfile = async (req, res) => {
	const { name, mobile, current, password } = req.body;
	try {
		const team = await Manager.findById(req.user._id).select('password');
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
		const team = await Manager.findById(req.user._id);
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

exports.CreateQuestion = async (req, res) => {
	console.log(req.body);
	const { section, type, imagePath, question, options, answer } = req.body;

	const option = [options.a, options.b, options.c, options.d];
	try {
		let c;
		if (type === 'Text') {
			c = await Question.create({
				type: type,
				text: question,
				subject: section,
				options: option,
				answer: answer,
			});
		} else {
			c = await Question.create({
				type: type,
				image: imagePath,
				subject: section,
				options: option,
				answer: answer,
			});
		}
		console.log(c);

		res.status(201).json({
			success: true,
			message: 'Question Created',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.CreateTargetRecord = async (req, res) => {
	const { team_id, targets } = req.body;

	try {
		const team = Team.findById(team_id);
		if (!team) {
			return res.status(404).json({
				success: false,
				message: 'Team not found',
			});
		}

		const data = [];
		targets.forEach((e) => {
			const target = {
				team: team_id,
				name: e[0],
				fname: e[1],
				email: e[2],
				mobile1: e[3],
				mobile2: e[4],
			};
			data.push(target);
		});
		await Target.insertMany(data)
			.then(function () {
				res.status(201).json({
					success: true,
					message: 'Target Saved',
				}); // Success
			})
			.catch(function (error) {
				console.log(error);
				return res.status(400).json({
					success: false,
					message: 'Unable to save few targets',
				});
			});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

//---------------------------------------Report---------------------------------------------------------
exports.ExamWiseReport = async (req, res) => {
	const project = {
		_id: 0,
		name: 1,
		'examinations.status': 1,
		'candidates._id': 1,
		'candidates.status': 1,
	};
	try {
		const teams = await Team.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: '_id',
					foreignField: 'referred_by',
					as: 'candidates',
				},
			},
			{
				$lookup: {
					from: Examination.collection.name,
					localField: 'candidates._id',
					foreignField: 'candidate',
					as: 'examinations',
				},
			},
			{ $project: project },
		]);

		console.log(teams);
		for (const team of teams) {
			const candidates = team.candidates;
			const examinations = team.examinations;
			let eligible = 0;
			candidates.forEach((candidate) => {
				if (candidate.status === CandidateStatus.ELIGIBLE) {
					eligible++;
				}
			});
			let pass = 0;
			let fail = 0;
			examinations.forEach((examination) => {
				if (examination.status === ExaminationStatus.PASS) {
					pass++;
				}
				if (examination.status === ExaminationStatus.FAIL) {
					fail++;
				}
			});
			const attended = examinations.length;
			team.candidates = undefined;
			team.examinations = undefined;
			team.eligible = eligible;
			team.pass = pass;
			team.fail = fail;
			team.attended = attended;
		}

		res.status(200).json({
			success: true,
			teams,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.InterviewWiseReport = async (req, res) => {
	const project = {
		_id: 0,
		name: 1,
		'interviews.status': 1,
	};
	try {
		const teams = await Team.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: '_id',
					foreignField: 'referred_by',
					as: 'candidates',
				},
			},
			{
				$lookup: {
					from: Interview.collection.name,
					localField: 'candidates._id',
					foreignField: 'candidate',
					as: 'interviews',
				},
			},
			{ $project: project },
		]);

		for (const team of teams) {
			const interviews = team.interviews;
			let scheduled = 0;
			let not_scheduled = 0;
			let pass = 0;
			let fail = 0;
			interviews.forEach((interview) => {
				if (interview.status === InterviewStatus.PASS) {
					pass++;
				}
				if (interview.status === InterviewStatus.FAIL) {
					fail++;
				}
				if (interview.status === InterviewStatus.SCHEDULED) {
					scheduled++;
				}
				if (interview.status === InterviewStatus.NOT_SCHEDULED) {
					not_scheduled++;
				}
			});
			team.interviews = undefined;
			team.scheduled = scheduled;
			team.not_scheduled = not_scheduled;
			team.pass = pass;
			team.fail = fail;
		}

		res.status(200).json({
			success: true,
			teams,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.AdmissionWiseReport = async (req, res) => {
	const project = {
		_id: 0,
		name: 1,
		'offer_letters.status': 1,
	};
	try {
		const teams = await Team.aggregate([
			{
				$lookup: {
					from: CandidateDetails.collection.name,
					localField: '_id',
					foreignField: 'referred_by',
					as: 'candidates',
				},
			},
			{
				$lookup: {
					from: OfferLetter.collection.name,
					localField: 'candidates._id',
					foreignField: 'candidate',
					as: 'offer_letters',
				},
			},
			{ $project: project },
		]);

		for (const team of teams) {
			const offer_letters = team.offer_letters;
			let issued = 0;
			let not_issued = 0;
			let joined = 0;
			let after_covid = 0;
			let joining_soon = 0;
			let held_by_parents = 0;
			let ticket_confirm = 0;
			offer_letters.forEach((offer_letter) => {
				if (offer_letter.status === OfferLetterStatus.ISSUED) {
					issued++;
				}
				if (offer_letter.status === OfferLetterStatus.NOT_ISSUED) {
					not_issued++;
				}
				if (offer_letter.status === OfferLetterStatus.JOINED) {
					joined++;
				}
				if (offer_letter.status === OfferLetterStatus.AFTER_COVID) {
					after_covid++;
				}
				if (offer_letter.status === OfferLetterStatus.JOINING_SOON) {
					joining_soon++;
				}
				if (offer_letter.status === OfferLetterStatus.HELD_BY_PARENTS) {
					held_by_parents++;
				}
				if (offer_letter.status === OfferLetterStatus.TICKET_CONFIRM) {
					ticket_confirm++;
				}
			});
			team.offer_letters = undefined;
			team.issued = issued;
			team.not_issued = not_issued;
			team.joined = joined;
			team.after_covid = after_covid;
			team.joining_soon = joining_soon;
			team.held_by_parents = held_by_parents;
			team.ticket_confirm = ticket_confirm;
		}

		res.status(200).json({
			success: true,
			teams,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.StateWiseReport = async (req, res) => {
	const project = {
		_id: 0,
		date: 1,
		state: 1,
	};

	const states = {
		'Andhra Pradesh': [],
		'Andaman and Nicobar Islands': [],
		'Arunachal Pradesh': [],
		Assam: [],
		Bihar: [],
		Chandigarh: [],
		Chhattisgarh: [],
		'Dadra and Nagar Haveli': [],
		'Daman and Diu': [],
		Delhi: [],
		Goa: [],
		Gujarat: [],
		Haryana: [],
		'Himachal Pradesh': [],
		'Jammu and Kashmir': [],
		Jharkhand: [],
		Karnataka: [],
		Kerala: [],
		Lakshadweep: [],
		'Madhya Pradesh': [],
		Maharashtra: [],
		Manipur: [],
		Meghalaya: [],
		Mizoram: [],
		Nagaland: [],
		Odisha: [],
		Puducherry: [],
		Punjab: [],
		Rajasthan: [],
		Sikkim: [],
		'Tamil Nadu': [],
		Telangana: [],
		Tripura: [],
		'Uttar Pradesh': [],
		Uttarakhand: [],
		'West Bengal': [],
	};
	try {
		const state_wise_report = await CandidateDetails.aggregate([
			{
				$lookup: {
					from: OfferLetter.collection.name,
					localField: '_id',
					foreignField: 'candidate',
					as: 'offer_letters',
				},
			},
			{ $match: { 'offer_letters.status': { $eq: OfferLetterStatus.JOINED } } },
			{ $addFields: { date: '$offer_letters.updatedAt' } },
			{ $addFields: { date: { $arrayElemAt: ['$date', 0] } } },
			{ $project: project },
		]);
		for (const e of state_wise_report) {
			states[e.state].push(e.date);
		}

		res.status(200).json({
			success: true,
			states,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.IndustryWiseReport = async (req, res) => {
	const project = {
		_id: 0,
		date: 1,
		industry: 1,
	};

	const industry = {};

	const industries = await CompanyDetail.find({}, { _id: 0, company_name: 1 });
	for (const e of industries) {
		industry[e.company_name] = [];
	}
	console.log(industry);

	try {
		const industry_wise_report = await CandidateDetails.aggregate([
			{
				$lookup: {
					from: OfferLetter.collection.name,
					localField: '_id',
					foreignField: 'candidate',
					as: 'offer_letters',
				},
			},
			{ $match: { 'offer_letters.status': { $eq: OfferLetterStatus.JOINED } } },
			{ $addFields: { industry: '$offer_letters.industry' } },
			{ $addFields: { industry: { $arrayElemAt: ['$industry', 0] } } },
			{ $addFields: { date: '$offer_letters.updatedAt' } },
			{ $addFields: { date: { $arrayElemAt: ['$date', 0] } } },
			{ $project: project },
		]);

		for (const e of industry_wise_report) {
			industry[e.industry].push(e.date);
		}

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

exports.CallWiseReport = async (req, res) => {
	const project = {
		_id: 0,
		name: 1,
		response: 1,
		// 'call_response.call_type': 1,
		// 'call_response.interested': 1,
		// 'call_response.createdAt': 1,
	};

	try {
		const teams = {};

		const _teams = await Team.find({}, { _id: 0, name: 1 });
		for (const e of _teams) {
			teams[e.name] = {
				total: 0,
				achieved: 0,
				interested: 0,
				convinced: 0,
			};
		}
		const call_wise_report = await Target.aggregate([
			{
				$lookup: {
					from: Team.collection.name,
					localField: 'team',
					foreignField: '_id',
					as: 'team',
				},
			},
			{ $addFields: { team: { $arrayElemAt: ['$team', 0] } } },
			{ $addFields: { name: '$team.name' } },
			{ $project: project },
		]);

		for (const e of call_wise_report) {
			if (!teams[e.name]) {
				continue;
			}
			teams[e.name].total++;
			if (e.response) {
				teams[e.name].achieved++;
				if (e.response === 'Interested') {
					teams[e.name].interested++;
				}
				if (e.response === 'Convinced') {
					teams[e.name].convinced++;
				}
			}
		}
		const entries = Object.entries(teams);
		const call_report = entries.map((e) => {
			const temp = {
				name: '',
				total: '',
				achieved: 0,
				interested: 0,
				convinced: 0,
			};
			temp.name = e[0];
			temp.total = e[1].total;
			temp.achieved = e[1].achieved;
			temp.interested = e[1].interested;
			temp.convinced = e[1].convinced;
			return temp;
		});
		res.status(200).json({
			success: true,
			call_wise_report: call_report,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.SourceWiseReport = async (req, res) => {
	const project = {
		_id: 0,
		opportunity: 1,
	};
	const opportunity = {
		'News Paper': 0,
		Pamphlet: 0,
		'School / College': 0,
		'Employment Exchange Office': 0,
		'E-Mail': 0,
		'Friends / Relatives': 0,
		FaceBook: 0,
		SMS: 0,
		'Tele Caller': 0,
		'NTTF Trainee Reference': 0,
		'www.nttftrg.com': 0,
		YouTube: 0,
		'Any Other': 0,
	};
	try {
		let source_wise_report = await CandidateDetails.aggregate([{ $project: project }]);
		for (const e of source_wise_report) {
			opportunity[e.opportunity]++;
		}
		source_wise_report = await Target.find();
		for (const e of source_wise_report) {
			opportunity[e.source]++;
		}

		res.status(200).json({
			success: true,
			source_wise_report: opportunity,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

//---------------------------------------Company Detail---------------------------------------------------------
exports.CompanyDetails = async (req, res) => {
	try {
		const industries = await CompanyDetail.find();
		res.status(201).json({
			success: true,
			industries,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};

exports.CreateCompany = async (req, res) => {
	const { details } = req.body;
	try {
		let id = '';
		if (details._id) {
			const company = await CompanyDetail.findById(details._id);
			if (company) {
				id = details._id;
				company.company_name = details.company_name;
				company.state = details.state;
				company.term = details.term;
				company.rope_in_1 = details.rope_in_1;
				company.rope_in_2 = details.rope_in_2;
				company.rope_in_3 = details.rope_in_3;
				company.rope_in_4 = details.rope_in_4;
				company.rope_in_location = details.rope_in_location;
				company.rope_in_assistance = details.rope_in_assistance;
				company.practical_1 = details.practical_1;
				company.practical_2 = details.practical_2;
				company.practical_3 = details.practical_3;
				company.practical_4 = details.practical_4;
				await company.save();
			} else {
				return res.status(400).json({
					success: false,
					message: 'Invalid Company Id.',
				});
			}
		} else {
			const { _id } = await CompanyDetail.create({
				company_name: details.company_name,
				state: details.state,
				term: details.term,
				rope_in_1: details.rope_in_1,
				rope_in_2: details.rope_in_2,
				rope_in_3: details.rope_in_3,
				rope_in_4: details.rope_in_4,
				rope_in_location: details.rope_in_location,
				rope_in_assistance: details.rope_in_assistance,
				practical_1: details.practical_1,
				practical_2: details.practical_2,
				practical_3: details.practical_3,
				practical_4: details.practical_4,
			});
			id = _id;
		}
		return res.status(201).json({
			success: true,
			message: id,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};
