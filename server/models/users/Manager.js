const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ManagerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "Name required",
	},
	email: {
		type: String,
		required: "Email required",
		unique: true,
		trim: true,
		lowercase: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Invalid email address",
		],
	},
	password: {
		type: String,
		required: "Password required",
		minlength: 8,
		select: false,
	},
	photo: { type: String },
	mobile: { type: String },
	emailOTP: {
		type: String,
		default: null,
	},
	emailOTPExpire: {
		type: Date,
		default: null,
	},
	mobileOTP: {
		type: String,
		default: null,
	},
	mobileOTPExpire: {
		type: Date,
		default: null,
	},
	resetToken: { type: String, select: false },
	refreshToken: { type: String, select: false },
});

ManagerSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(Number(process.env.SALT_FACTOR));
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (err) {
		return next(err);
	}
});

ManagerSchema.methods.generateEmailOTP = function () {
	const random = Math.floor(100000 + Math.random() * (999999 - 100000));
	this.emailOTP = random;
	this.emailOTPExpire = Date.now() + 10 * (60 * 1000);
	return random;
};
ManagerSchema.methods.generateMobileOTP = function () {
	const random = Math.floor(100000 + Math.random() * (999999 - 100000));
	this.mobileOTP = random;
	this.mobileOTPExpire = Date.now() + 10 * (60 * 1000);
	return random;
};

ManagerSchema.methods.generateResetLink = function () {
	const token = crypto.randomBytes(30).toString("hex");

	this.resetToken = crypto.createHash("sha256").update(token).digest("hex");

	return token;
};

ManagerSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

ManagerSchema.methods.getSignedRefreshToken = function () {
	const refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_SECRET, {
		expiresIn: process.env.REFRESH_EXPIRE,
	});
	this.refreshToken = refreshToken;
	return refreshToken;
};

ManagerSchema.methods.verifyPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const Manager = mongoose.model("Manager", ManagerSchema);

module.exports = Manager;
