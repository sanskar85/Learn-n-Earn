const mongoose = require('mongoose');
const crypto = require('crypto');
const { InterviewStatus, CandidateStatus, OfferLetterStatus } = require('../../utils/Enums');
const CandidateDetails = require('../users/CandidateDetails');
const OfferLetter = require('./OfferLetter');
const InterviewSchema = new mongoose.Schema(
	{
		candidate: {
			type: mongoose.Schema.ObjectId,
			ref: 'CandidateDetails',
			unique: true,
		},
		scheduled_time: { type: Date },
		meeting_link: { type: String },
		status: {
			type: String,
			enum: Object.values(InterviewStatus),
			default: InterviewStatus.NOT_SCHEDULED,
		},
		source: { type: String },
		interview_mode: { type: String },
		documents_verified: { type: String },
		candidate_need: { type: String },
		financial_background: { type: String },
		english: { type: String },
		maths: { type: String },
		gk: { type: String },
		ignou: { type: String },
		result: { type: String },
		industry: { type: String },
		remarks: { type: String },
	},
	{ timestamps: true }
);

InterviewSchema.pre('save', async function (next) {
	if (!this.industry) {
		next();
	}
	const candidate = await CandidateDetails.findById(this.candidate);

	if (this.result === 'Pass') {
		this.status = InterviewStatus.PASS;
		this.meeting_link = undefined;
		candidate.status = CandidateStatus.OFFER_LETTER;
	} else if (this.result === 'Fail') {
		this.status = InterviewStatus.FAIL;
		this.meeting_link = undefined;
		candidate.status = CandidateStatus.REJECTED;
	} else if (this.result === 'Re-schedule Interview') {
		this.status = InterviewStatus.NOT_SCHEDULED;
		this.meeting_link = undefined;
		this.scheduled_time = undefined;
		this.result === undefined;
		candidate.status = CandidateStatus.INTERVIEW;
	}

	candidate.save();
});

InterviewSchema.post('save', async function (doc) {
	if (!this.industry) {
		return;
	}
	let offer = await OfferLetter.findOne({ candidate: doc.candidate });
	if (!offer) {
		offer = await OfferLetter.create({
			candidate: doc.candidate,
			industry: doc.industry,
			status: OfferLetterStatus.NOT_ISSUED,
		});
	} else {
		offer.candidate = doc.candidate;
		offer.industry = doc.industry;
		offer.status = OfferLetterStatus.NOT_ISSUED;
	}
	await offer.save();
});

const Interview = mongoose.model('Interview', InterviewSchema);

module.exports = Interview;
