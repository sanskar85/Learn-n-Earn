const express = require('express');
const router = express.Router();

const {
	MyDashboard,
	Student,
	UpdateStudent,
	StudentNotRespondingExam,
	StudentNotRespondingInterview,
	StudentNotRespondingAdmission,
	FetchProfile,
	UpdateProfile,
	Targets,
	UpdateTarget,
	UpdateProfileImage,
	Examination_Details,
	NotifyCandidate,
	InterviewDetails,
	CreateMeeting,
	CreateInterviewResponse,
	OfferLetter,
	CreateOfferLetter,
	AdmissionAllowed,
	AdmissionDetails,
	SaveAdmissionDetails,
	Industries,
} = require('../controllers/details/Team');
const { verifyTeam } = require('../middleware/verifyJWT');

router.route('/my-dashboard').all(verifyTeam).get(MyDashboard);

router.route('/students').all(verifyTeam).get(Student);

router.route('/students').all(verifyTeam).put(UpdateStudent);

router.route('/students-exam-not-responding').all(verifyTeam).put(StudentNotRespondingExam);

router
	.route('/students-interview-not-responding')
	.all(verifyTeam)
	.put(StudentNotRespondingInterview);

router
	.route('/students-admission-not-responding')
	.all(verifyTeam)
	.put(StudentNotRespondingAdmission);

router.route('/targets').all(verifyTeam).get(Targets);

router.route('/update-target').all(verifyTeam).put(UpdateTarget);

router.route('/profile').all(verifyTeam).get(FetchProfile);

router.route('/profile').all(verifyTeam).put(UpdateProfile);

router.route('/examination-details').all(verifyTeam).get(Examination_Details);

router.route('/update-profile-image').all(verifyTeam).put(UpdateProfileImage);

router.route('/notify-candidate').all(verifyTeam).post(NotifyCandidate);

router.route('/interview-details').all(verifyTeam).get(InterviewDetails);

router.route('/create-meeting').all(verifyTeam).post(CreateMeeting);

router.route('/create-interview-response').all(verifyTeam).post(CreateInterviewResponse);

router.route('/offer-letter-details').all(verifyTeam).get(OfferLetter);

router.route('/issue-offer-letter').all(verifyTeam).post(CreateOfferLetter);

router.route('/admission-allowded').all(verifyTeam).get(AdmissionAllowed);

router.route('/admission-details').all(verifyTeam).get(AdmissionDetails);

router.route('/save-admission-details').all(verifyTeam).post(SaveAdmissionDetails);

router.route('/industries').all(verifyTeam).get(Industries);

module.exports = router;
