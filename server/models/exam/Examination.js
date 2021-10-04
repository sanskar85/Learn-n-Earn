const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { ExaminationStatus, CandidateStatus } = require('../../utils/Enums');
const CandidateDetails = require('../users/CandidateDetails');
const Interview = require('./Interview');

const ExaminationSchema = new mongoose.Schema(
	{
		candidate: {
			type: mongoose.Schema.ObjectId,
			ref: 'CandidateDetails',
			unique: true,
		},
		marks_obtained: { type: Number },
		status: {
			type: String,
			enum: Object.values(ExaminationStatus),
			default: ExaminationStatus.STARTED,
		},
		duration: { type: String },
	},
	{ timestamps: true }
);

ExaminationSchema.post('save', async function (doc) {
	const candidate = await CandidateDetails.findOne({ _id: doc.candidate._id });
	if (doc.status === ExaminationStatus.STARTED) {
		candidate.exam_attempt_remaining = candidate.exam_attempt_remaining - 1;
	} else {
		if (doc.status === ExaminationStatus.PASS) {
			candidate.status = CandidateStatus.INTERVIEW;
			candidate.exam_attempt_remaining = 0;
			const interview = await Interview.findOne({ candidate: doc.candidate._id });
			if (!interview)
				await Interview.create({
					candidate,
				});
		} else if (doc.status === ExaminationStatus.FAIL)
			candidate.status =
				candidate.exam_attempt_remaining === 0 ? CandidateStatus.FAILED : CandidateStatus.ELIGIBLE;
	}
	await candidate.save();
});

const Examination = mongoose.model('Examination', ExaminationSchema);

module.exports = Examination;
