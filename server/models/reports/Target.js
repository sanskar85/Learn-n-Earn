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
		state: { type: String },
		source: { type: String },
		response: { type: String },
	},
	{ timestamps: true }
);

const Target = mongoose.model('Target', TargetSchema);

module.exports = Target;
