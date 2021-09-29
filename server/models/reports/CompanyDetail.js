const mongoose = require('mongoose');

const CompanyDetailSchema = mongoose.Schema(
	{
		company_name: { type: String },
		state: { type: String },
		term: { type: String, default: '0' },
		rope_in_1: { type: String },
		rope_in_2: { type: String },
		rope_in_3: { type: String },
		rope_in_4: { type: String },
		rope_in_location: { type: String },
		rope_in_assistance: { type: String },
		practical_1: { type: String },
		practical_2: { type: String },
		practical_3: { type: String },
		practical_4: { type: String },
	},
	{ timestamps: true }
);

const CompanyDetail = mongoose.model('CompanyDetail', CompanyDetailSchema);

module.exports = CompanyDetail;
