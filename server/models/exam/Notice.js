const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateDetails"
    },
    message: { type: String },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '7d' },
    },
}, { timestamps: true });


const Notice = mongoose.model("Notice", NoticeSchema);

module.exports = Notice;