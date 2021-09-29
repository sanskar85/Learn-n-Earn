const mongoose = require("mongoose");
const { QuestionType, Answer, QuestionSubject } = require("../../utils/Enums");
const QuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(QuestionType),
    },
    image: { type: String },
    text: { type: String },
    subject: {
        type: String,
        enum: Object.values(QuestionSubject),
    },
    options: [{ type: String }],
    answer: {
        type: String,
        enum: Object.values(Answer),
        select: false,
    }
});
QuestionSchema.statics.getQuestions = async function () {
    const count = await this.countDocuments();
    const questions = [];
    const arr = [];
    for (let i = 0; i < Number(process.env.MATHS_SCIENCE_QUESTION_COUNT) ; i++) {
        const rand = Math.floor(Math.random() * count);
        if (arr.includes(rand)) {
            continue;
            // i--;
        }
        const randomDoc = await this.findOne({ subject: QuestionSubject.SCIENCE_MATHS }).skip(rand);
        if (randomDoc)
            questions.push(randomDoc);
    }
    arr.splice(0, arr.length);
    for (let i = 0; i < Number(process.env.ENGLISH_QUESTION_COUNT) ; i++) {
        const rand = Math.floor(Math.random() * count);
        if (arr.includes(rand)) {
            continue;
            // i--;
        }
        const randomDoc = await this.findOne({ subject: QuestionSubject.ENGLISH }).skip(rand);
        if (randomDoc)
            questions.push(randomDoc);
    }
    arr.splice(0, arr.length);
    for (let i = 0; i < Number(process.env.GK_QUESTION_COUNT) ; i++) {
        const rand = Math.floor(Math.random() * count);
        if (arr.includes(rand)) {
            continue;
            // i--;
        }
        const randomDoc = await this.findOne({ subject: QuestionSubject.GK }).skip(rand);
        if (randomDoc)
            questions.push(randomDoc);
    }
    arr.splice(0, arr.length);
    for (let i = 0; i <  Number(process.env.TECHNICAL_REASONING_QUESTION_COUNT) ; i++) {
        const rand = Math.floor(Math.random() * count);
        if (arr.includes(rand)) {
            continue;
            // i--;
        }
        const randomDoc = await this.findOne({ subject: QuestionSubject.TECHNICAL_REASONING }).skip(rand);
        if (randomDoc)
            questions.push(randomDoc);
    }
    arr.splice(0, arr.length);
    for (let i = 0; i < Number(process.env.CODING_APTITUDE_QUESTION_COUNT) ; i++) {
        const rand = Math.floor(Math.random() * count);
        if (arr.includes(rand)) {
            continue;
            // i--;
        }
        const randomDoc = await this.findOne({ subject: QuestionSubject.CODING_APTITUDE }).skip(rand);
        if (randomDoc)
            questions.push(randomDoc);
    }
    return questions;
};
QuestionSchema.methods.verifyAnswer = function (answer) {

    return this.answer === answer;
};
const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;