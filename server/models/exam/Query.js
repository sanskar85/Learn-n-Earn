const mongoose = require("mongoose");
const QuerySchema = new mongoose.Schema({
    message: { type: String },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
    },
},{timestamp:true});

const Query = mongoose.model("Query", QuerySchema);

module.exports = Query;