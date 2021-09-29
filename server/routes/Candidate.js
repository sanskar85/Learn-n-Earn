const express = require('express');
const router = express.Router();

const {
	MyDashboard,
	createprofile,
	startTest,
	submitTest,
	examResult,
	DownloadOfferLetter,
} = require('../controllers/details/Candidate');
const { verifyCandidate } = require('../middleware/verifyJWT');

router
	.route('/my-dashboard')
	.all(verifyCandidate, require('../middleware/CandidateVerification'))
	.get(MyDashboard);

router.route('/create-profile').all(verifyCandidate).post(createprofile);

router
	.route('/start-exam')
	.all(verifyCandidate, require('../middleware/CandidateVerification'))
	.get(startTest);

router
	.route('/submit-exam')
	.all(verifyCandidate, require('../middleware/CandidateVerification'))
	.post(submitTest);

router.route('/exam-details/:id').get(examResult);

router
	.route('/download-offer-letter')
	.all(verifyCandidate, require('../middleware/CandidateVerification'))
	.get(DownloadOfferLetter);

module.exports = router;
