const mongoose = require('mongoose');
const { CandidateStatus } = require('../../utils/Enums');
const CandidateDetailsSchema = new mongoose.Schema(
	{
		candidate: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Candidate',
		},
		name: { type: String },
		gender: { type: String },
		DOB: { type: String },
		fname: { type: String },
		aadhaar: { type: String },
		state: { type: String },
		district: { type: String },
		pincode: { type: String },
		qualification: { type: String },
		diploma: { type: String },
		y_o_p: { type: String },
		cgpa: { type: String },
		backlog: { type: String },
		college: { type: String },
		opportunity: { type: String },
		height: { type: String },
		weight: { type: String },
		plant_worked: { type: String },
		pwd: { type: String },
		referred_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Team',
		},
		work_experience: { type: String },
		income: { type: String },
		status: {
			type: String,
			enum: Object.values(CandidateStatus),
			default: CandidateStatus.NOT_VERIFIED,
		},
		exam_attempt_remaining: { type: Number, default: 2 },
		remarks: { type: String },
	},
	{ timestamps: true }
);

CandidateDetailsSchema.pre('save', function (next) {
	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
	if (this.isModified('DOB')) {
		const date = new Date(this.DOB);
		if (date) {
			this.DOB = date.toLocaleDateString('en-GB', options);
		}
	}
	return next();
});

CandidateDetailsSchema.methods.isProfileComplete = function () {
	return (
		this.name &&
		this.gender &&
		this.DOB &&
		this.fname &&
		this.aadhaar &&
		this.state &&
		this.district &&
		this.pincode &&
		this.qualification &&
		this.diploma &&
		this.y_o_p &&
		this.cgpa &&
		this.backlog &&
		this.college &&
		this.opportunity &&
		this.height &&
		this.weight &&
		this.plant_worked &&
		this.pwd &&
		this.work_experience &&
		true
	);
};

const CandidateDetails = mongoose.model('CandidateDetails', CandidateDetailsSchema);

module.exports = CandidateDetails;
