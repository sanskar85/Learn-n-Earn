const mongoose = require("mongoose");
const { InterviewStatus, OfferLetterStatus } = require("../../utils/Enums");
const CandidateDetails = require("../users/CandidateDetails");
const OfferLetterSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.ObjectId,
        ref: 'CandidateDetails',
        unique: true,
    },
    industry: { type: String },
    status: {
        type: String,
        enum: Object.values(OfferLetterStatus),
        default: OfferLetterStatus.NOT_ISSUED,
    },
    remarks: { type: String },
    issue_date: { type: String },
    reporting_date: { type: String },
    application_id: { type: String },
}, { timestamps: true });

const OfferLetter = mongoose.model("OfferLetter", OfferLetterSchema);

module.exports = OfferLetter;