const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const CandidateSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: 'Email required',
			unique: true,
			trim: true,
			lowercase: true,
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'],
		},
		mobile: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
			required: 'Password required',
			minlength: 8,
			select: false,
		},
		userVerified: {
			type: Boolean,
			default: false,
		},
		otp: {
			type: String,
			default: null,
		},
		otpExpire: {
			type: Date,
			default: null,
		},
		resetToken: { type: String, select: false },
		refreshToken: { type: String, select: false },
	},
	{ timestamps: true }
);

CandidateSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(Number(process.env.SALT_FACTOR));
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (err) {
		return next(err);
	}
});

CandidateSchema.methods.generateOTP = function () {
	const random = Math.floor(100000 + Math.random() * (999999 - 100000));
	this.otp = random;
	this.otpExpire = Date.now() + 10 * (60 * 1000);
	return random;
};

CandidateSchema.methods.generateResetLink = function () {
	const token = crypto.randomBytes(30).toString('hex');

	this.resetToken = crypto.createHash('sha256').update(token).digest('hex');

	return token;
};

CandidateSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

CandidateSchema.methods.getSignedRefreshToken = function () {
	const refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_SECRET, {
		expiresIn: process.env.REFRESH_EXPIRE,
	});
	this.refreshToken = refreshToken;
	return refreshToken;
};

CandidateSchema.methods.verifyPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;
