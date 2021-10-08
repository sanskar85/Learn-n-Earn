const express = require('express');
const router = express.Router();

const {
	MyDashboard,
	Teams,
	UpdateTeam,
	Students,
	UpdateCandidatesDetail,
	UpdateCandidatesTeam,
	FetchProfile,
	UpdateProfile,
	UpdateProfileImage,
	ExamWiseReport,
	InterviewWiseReport,
	AdmissionWiseReport,
	StateWiseReport,
	IndustryWiseReport,
	CallWiseReport,
	AssignedTargets,
	SourceWiseReport,
	CreateQuestion,
	FetchQuestion,
	ExportQuestion,
	CreateTargetRecord,
	CompanyDetails,
	CreateCompany,
	MIS_Report,
} = require('../controllers/details/Manager');
const { verifyManager } = require('../middleware/verifyJWT');

router.route('/my-dashboard').all(verifyManager).get(MyDashboard);

router.route('/teams').all(verifyManager).get(Teams);

router.route('/teams').all(verifyManager).put(UpdateTeam);

router.route('/students').all(verifyManager).get(Students);

router.route('/update-student-details').all(verifyManager).put(UpdateCandidatesDetail);

router.route('/update-candidates-team').all(verifyManager).put(UpdateCandidatesTeam);

router.route('/company-details').all(verifyManager).get(CompanyDetails);

router.route('/company-details').all(verifyManager).post(CreateCompany);

router.route('/exam-wise-report').all(verifyManager).get(ExamWiseReport);

router.route('/interview-wise-report').all(verifyManager).get(InterviewWiseReport);

router.route('/admission-wise-report').all(verifyManager).get(AdmissionWiseReport);

router.route('/state-wise-report').all(verifyManager).get(StateWiseReport);

router.route('/industry-wise-report').all(verifyManager).get(IndustryWiseReport);

router.route('/call-wise-report').all(verifyManager).get(CallWiseReport);

router.route('/assigned-targets').all(verifyManager).get(AssignedTargets);

router.route('/source-wise-report').all(verifyManager).get(SourceWiseReport);

router.route('/create-question').all(verifyManager).post(CreateQuestion);

router.route('/fetch-question/:id').all(verifyManager).get(FetchQuestion);

router.route('/export-question').all(verifyManager).get(ExportQuestion);

router.route('/create-target-record').all(verifyManager).post(CreateTargetRecord);

router.route('/profile').all(verifyManager).get(FetchProfile);

router.route('/profile').all(verifyManager).put(UpdateProfile);

router.route('/update-profile-image').all(verifyManager).put(UpdateProfileImage);

router.route('/mis-report').all(verifyManager).get(MIS_Report);

module.exports = router;
