const express = require('express');
const router = express.Router();

const {
	login,
	register,
	request_verification,
	verify_user,
	forgotPassword,
	resetPassword,
	refreshToken,
	ProfileStatus,
	logout,
} = require('../../controllers/auth/CandidateAuth');
const { verifyCandidate } = require('../../middleware/verifyJWT');

router.route('/login').post(login);

router.route('/register').post(register);

router.route('/request-verification').all(verifyCandidate).get(request_verification);

router.route('/verify-user').all(verifyCandidate).post(verify_user);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password').put(resetPassword);

router.route('/refresh-token').get(refreshToken);

router.route('/profile-status').all(verifyCandidate).get(ProfileStatus);

router.route('/logout').post(logout);

module.exports = router;
