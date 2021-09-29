const Team = require('../../models/users/Team');
const { SendEmail, SendSMS } = require('../../utils/Messaging');
const { PasswordResetTemplate } = require('../../utils/EmailTemplates');
const crypto = require('crypto');
addDays = function (days) {
	var date = new Date();
	date.setDate(date.getDate() + days);
	return date;
};
addMinutes = function (minutes) {
	var date = new Date();
	date.setMinutes(date.getMinutes() + minutes);
	return date;
};
exports.login = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({
			success: false,
			message: 'Missing Credentials',
			details: 'username and password required in request body.',
		});
	}

	try {
		const user = await Team.findOne({ $or: [{ email: username }, { mobile: username }] }).select(
			'password'
		);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Invalid Credentials',
				details: 'No user found with given credentials',
			});
		}

		const passwordMatched = await user.verifyPassword(password);

		if (!passwordMatched) {
			return res.status(404).json({
				success: false,
				message: 'Invalid Credentials',
				details: 'No user found with given credentials',
			});
		}

		const accessToken = user.getSignedToken();
		const refreshToken = user.getSignedRefreshToken();
		await user.save();
		res.cookie('jwt', accessToken, {
			sameSite: 'strict',
			expires: addMinutes(3),
			httpOnly: true,
			secure: process.env.MODE !== 'development',
		});
		res.cookie('jwt_refresh', refreshToken, {
			sameSite: 'strict',
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: process.env.MODE !== 'development',
		});
		res.status(200).json({
			success: true,
			message: 'Authentication Successful',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
			details: 'Internal Server Error!!!',
		});
	}
};

exports.register = async (req, res) => {
	const { name, email, mobile, password } = req.body;
	if (!name || !email || !password || !mobile) {
		return res.status(400).json({
			success: false,
			message: 'Missing Credentials',
			details: 'name, email, mobile and password required in request body.',
		});
	}
	try {
		const _userExists = await Team.findOne({ $or: [{ email: email }, { mobile: mobile }] });
		if (_userExists) {
			return res.status(400).json({
				success: false,
				message: 'User already exists.',
				details: 'An account related to this email or mobile already exists.',
			});
		}

		const user = await Team.create({
			name,
			email,
			mobile,
			password,
		});

		await user.save();
		res.status(201).json({
			success: true,
			message: 'User registered.',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
			details: 'Internal Server Error!!!',
		});
	}
};

exports.forgotPassword = async (req, res) => {
	const { username } = req.body;
	if (!username) {
		return res.status(400).json({
			success: false,
			message: 'Missing Credentials',
			details: 'username required in request body.',
		});
	}
	try {
		const user = await Team.findOne({ $or: [{ email: username }, { mobile: username }] });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Credentials',
				details: 'User not found.',
			});
		}

		user.emailOTP = undefined;
		user.mobileOTP = undefined;
		user.emailOTPExpire = undefined;
		user.mobileOTPExpire = undefined;

		if (username === user.email) {
			const emailOTP = user.generateEmailOTP();

			const attachments = [
				{
					filename: 'b389e13e-1fa0-48df-b419-ae88efddea04.png',
					path: __basedir + `/static/assets/b389e13e-1fa0-48df-b419-ae88efddea04.png`,
					cid: 'password-reset@learnnearn',
				},
			];
			await SendEmail(
				user.email,
				'Password Reset Code',
				PasswordResetTemplate(emailOTP, user.email),
				attachments
			);
		} else if (username === user.mobile) {
			const mobileOTP = user.generateMobileOTP();
			await SendSMS(`${mobileOTP} is your otp for Learn n Earn.`, user.mobile);
		}

		const link = user.generateResetLink();
		await user.save();
		res.cookie('reset_token', link, {
			sameSite: 'strict',
			expires: new Date(Date.now() + 10 * 60 * 1000),
			httpOnly: true,
			secure: process.env.MODE !== 'development',
		});
		res.status(200).json({
			success: true,
			message: `Reset link sent.`,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
			details: 'Internal Server Error!!!',
		});
	}
};

exports.resetPassword = async (req, res) => {
	const resetToken = crypto.createHash('sha256').update(req.cookies.reset_token).digest('hex');
	const { otp, password } = req.body;
	if (!resetToken) {
		return res.status(400).json({
			success: false,
			message: 'Password reset failed',
			details: 'Invalid password reset token',
		});
	}
	if (!password || !otp) {
		return res.status(400).json({
			success: false,
			message: 'Missing Credentials',
			details: 'otp and password required in request body.',
		});
	}
	try {
		const user = await Team.findOne({ resetToken });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Password reset failed',
				details: 'Invalid password reset token',
			});
		}

		if (user.emailOTP) {
			if (user.emailOTP === otp && user.emailOTPExpire > Date.now()) {
				user.emailOTP = undefined;
				user.emailOTPExpire = undefined;
			} else {
				return res.status(400).json({
					success: false,
					message: 'Invalid OTP',
					details: 'Password reset failed',
				});
			}
		} else if (user.mobileOTP) {
			if (user.mobileOTP === otp && user.mobileOTPExpire > new Date()) {
				user.mobileOTP = undefined;
				user.mobileOTPExpire = undefined;
			} else {
				return res.status(400).json({
					success: false,
					message: 'Invalid OTP',
					details: 'Password reset failed',
				});
			}
		}

		user.password = password;
		await user.save();
		res.clearCookie('reset_token');
		res.status(201).json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
			details: 'Internal Server Error!!!',
		});
	}
};

exports.refreshToken = async (req, res) => {
	const refreshToken = req.cookies.jwt_refresh;
	if (!refreshToken) {
		return res.status(400).json({
			success: false,
			message: 'Token Refresh Failed',
			details: 'Invalid refresh token',
		});
	}
	try {
		const user = await Team.findOne({ refreshToken });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Token Refresh Failed',
				details: 'Invalid refresh token',
			});
		}

		const accessToken = user.getSignedToken();
		res.cookie('jwt', accessToken, {
			sameSite: 'strict',
			expires: addMinutes(3),
			httpOnly: true,
			secure: process.env.MODE !== 'development',
		});

		res.status(201).json({
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
			details: 'Internal Server Error!!!',
		});
	}
};

exports.logout = async (req, res) => {
	const refreshToken = req.cookies.jwt_refresh;
	if (!refreshToken) {
		return res.status(400).json({
			success: false,
			message: 'Invalid refresh token',
			details: 'Invalid refresh token',
		});
	}
	try {
		const user = await Candidate.findOne({ refreshToken });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid refresh token',
				details: 'Invalid refresh token',
			});
		}
		res.clearCookie('jwt');
		res.clearCookie('jwt_refresh');
		user.refreshToken = undefined;
		await user.save();
		res.status(200).json({
			success: true,
			message: `Logged Out`,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Server Error',
			details: 'Internal Server Error!!!',
		});
	}
};
