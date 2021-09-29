const { verify } = require("jsonwebtoken");
const Candidate = require("../models/users/Candidate");
const Team = require("../models/users/Team");
const Manager = require("../models/users/Manager");
const CandidateDetails = require("../models/users/CandidateDetails");

exports.verifyCandidate = async (req, res, next) => {
	let token = req.cookies.jwt;
	try {
		const decoded = verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: "Invalid JWT Token.",
				details: "JWT token does not contain any payload",
			});
		}
		const user = await Candidate.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid Credentials.",
				details: "JWT token does not refer to any user.",
			});
		}
		const userDetails = await CandidateDetails.findOne({ candidate: user });

		req.user = user;
		req.userDetails = userDetails;

		next();
	} catch (err) {
		return res.status(401).json({
			success: false,
			message: "User not authorized.",
			details: "Invalid JWT token",
		});
	}
};

exports.verifyTeam = async (req, res, next) => {
	let token = req.cookies.jwt;
	try {
		const decoded = verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: "Invalid JWT Token.",
				details: "JWT token does not contain any payload",
			});
		}
		const user = await Team.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid Credentials.",
				details: "JWT token does not refer to any user.",
			});
		}

		req.user = user;

		next();
	} catch (err) {
		return res.status(401).json({
			success: false,
			message: "User not authorized.",
			details: "Invalid JWT token",
		});
	}
};

exports.verifyManager = async (req, res, next) => {
	let token = req.cookies.jwt;
	try {
		const decoded = verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: "Invalid JWT Token.",
				details: "JWT token does not contain any payload",
			});
		}
		const user = await Manager.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid Credentials.",
				details: "JWT token does not refer to any user.",
			});
		}

		req.user = user;

		next();
	} catch (err) {
		return res.status(401).json({
			success: false,
			message: "User not authorized.",
			details: "Invalid JWT token",
		});
	}
};
