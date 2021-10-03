const mongoose = require('mongoose');

const TargetSchema = mongoose.Schema(
	{
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Team',
		},
		name: { type: String },
		fname: { type: String },
		email: { type: String },
		mobile1: { type: String }, //Responder mobile number
		mobile2: { type: String }, //Responder mobile number
		qualification: { type: String },
		call_type: { type: String },
		aadhaar: { type: String },
		district: { type: String },
		pincode: { type: String },
		state: { type: String },
		source: { type: String },
		response: { type: String },
		gender: { type: String },
		dob: { type: String },
		y_o_p: { type: String },
	},
	{ timestamps: true }
);

const Target = mongoose.model('Target', TargetSchema);

module.exports = Target;
