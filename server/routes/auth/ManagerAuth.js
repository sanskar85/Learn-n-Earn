const express = require("express");
const router = express.Router();

const {
	login,
	register,
	forgotPassword,
	resetPassword,
	refreshToken,
	logout,
} = require("../../controllers/auth/ManagerAuth");

router.route("/login").post(login);

router.route("/register").post(register);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password").put(resetPassword);

router.route("/refresh-token").get(refreshToken);

router.route("/logout").post(logout);

module.exports = router;
