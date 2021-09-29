const { CandidateStatus } = require('../utils/Enums');
const CandidateVerification = async (req, res, next) => {
	const details = req.userDetails;
	if (
		!req.user.userVerified ||
		!details.isProfileComplete() ||
		!details.referred_by ||
		details.status === CandidateStatus.NOT_ELIGIBLE ||
		details.status === CandidateStatus.NOT_VERIFIED
	) {
		return res.status(403).json({
			success: false,
			message: 'Verification Pending',
		});
	}
	next();
};
module.exports = CandidateVerification;
