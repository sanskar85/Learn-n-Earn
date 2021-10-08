const mongoose = require('mongoose');
const { QuestionType, Answer, QuestionSubject } = require('../../utils/Enums');
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
	},
});
QuestionSchema.statics.getQuestions = async function () {
	const subjects = await this.aggregate([{ $group: { _id: '$subject', count: { $sum: 1 } } }]);
	const questionCount = {
		'Science & Mathematics': 0,
		English: 0,
		'General Knowledge': 0,
		'Coding and Aptitude': 0,
		'Technical Reasoning': 0,
	};
	for (const subject of subjects) {
		questionCount[subject._id] = subject.count;
	}
	const questions = [];
	const ids = [];
	for (let i = 0; i < Number(process.env.MATHS_SCIENCE_QUESTION_COUNT); i++) {
		const rand = Math.floor(Math.random() * questionCount['Science & Mathematics']);
		if (ids.includes(rand) && process.env.MODE !== 'development') {
			i--;
		} else {
			const randomDoc = await this.findOne({ subject: QuestionSubject.SCIENCE_MATHS }).skip(rand);
			if (randomDoc) {
				questions.push(randomDoc);
				ids.push(rand);
			} else if (process.env.MODE !== 'development') i--;
		}
	}
	ids.splice(0, ids.length);
	for (let i = 0; i < Number(process.env.ENGLISH_QUESTION_COUNT); i++) {
		const rand = Math.floor(Math.random() * questionCount['English']);
		if (ids.includes(rand) && process.env.MODE !== 'development') {
			i--;
		} else {
			const randomDoc = await this.findOne({ subject: QuestionSubject.ENGLISH }).skip(rand);
			if (randomDoc) {
				questions.push(randomDoc);
				ids.push(rand);
			} else if (process.env.MODE !== 'development') i--;
		}
	}
	ids.splice(0, ids.length);
	for (let i = 0; i < Number(process.env.GK_QUESTION_COUNT); i++) {
		const rand = Math.floor(Math.random() * questionCount['General Knowledge']);
		if (ids.includes(rand) && process.env.MODE !== 'development') {
			i--;
		} else {
			const randomDoc = await this.findOne({ subject: QuestionSubject.GK }).skip(rand);
			if (randomDoc) {
				questions.push(randomDoc);
				ids.push(rand);
			} else if (process.env.MODE !== 'development') i--;
		}
	}
	ids.splice(0, ids.length);
	for (let i = 0; i < Number(process.env.TECHNICAL_REASONING_QUESTION_COUNT); i++) {
		const rand = Math.floor(Math.random() * questionCount['Technical Reasoning']);
		if (ids.includes(rand) && process.env.MODE !== 'development') {
			i--;
		} else {
			const randomDoc = await this.findOne({ subject: QuestionSubject.TECHNICAL_REASONING }).skip(
				rand
			);
			if (randomDoc) {
				questions.push(randomDoc);
				ids.push(rand);
			} else if (process.env.MODE !== 'development') i--;
		}
	}
	ids.splice(0, ids.length);
	for (let i = 0; i < Number(process.env.CODING_APTITUDE_QUESTION_COUNT); i++) {
		const rand = Math.floor(Math.random() * questionCount['Coding and Aptitude']);
		if (ids.includes(rand) && process.env.MODE !== 'development') {
			i--;
		} else {
			const randomDoc = await this.findOne({ subject: QuestionSubject.CODING_APTITUDE }).skip(rand);
			if (randomDoc) {
				questions.push(randomDoc);
				ids.push(rand);
			} else if (process.env.MODE !== 'development') i--;
		}
	}
	return questions;
};
QuestionSchema.methods.verifyAnswer = function (answer) {
	return this.answer === answer;
};
const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
