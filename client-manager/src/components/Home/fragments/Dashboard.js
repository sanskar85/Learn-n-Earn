import './Dashboard.css';
import { useState, useEffect } from 'react';
import { MyDashboard } from '../../controllers/API';
import PHONE from '../../assets/phone.svg';
import REGISTRATION from '../../assets/user_plus.svg';
import JOINING from '../../assets/joining.svg';
import EXAM from '../../assets/exam-report.svg';
import INTERVIEW from '../../assets/interview-report.svg';
import OFFERLETTER from '../../assets/offerletter.svg';
import { FlameIcon } from '../../assets/Images';
const Dashboard = ({ setLoading, showAlert }) => {
	const [header, setHeaderData] = useState({
		registration: 0,
		exam: 0,
		interview: 0,
		offer_letter_issued: 0,
		joined: 0,
	});
	const [registration, setRegistraion] = useState({
		convinced: 0,
		registered: 0,
	});
	const [call_target, setCallTarget] = useState({
		total: 0,
		achived: 0,
	});
	const [exam_report, setExamReport] = useState({
		total: 0,
		attended: 0,
		pending: 0,
		pass: 0,
		fail: 0,
	});
	const [interview_report, setInterviewReport] = useState({
		total: 0,
		attended: 0,
		pending: 0,
		pass: 0,
		fail: 0,
	});
	const [offer_letter_report, setOfferLetterReport] = useState({
		total: 0,
		issued: 0,
		pending: 0,
	});
	const [joining_report, setJoiningReport] = useState({
		total: 0,
		joined: 0,
		pending: 0,
	});

	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const data = await MyDashboard();
			if (data && data.success) {
				setHeaderData(data.header);
				setRegistraion(data.registration);
				setJoiningReport(data.joining_report);
				setExamReport(data.exam_report);
				setInterviewReport(data.interview_report);
				setOfferLetterReport(data.offer_letter);
				setCallTarget(data.call_target);
				setLoading(false);
			} else {
				setLoading(false);
				showAlert('Unable to fetch data');
			}
		}
		fetchData();
	}, [setLoading, showAlert]);
	return (
		<>
			<div className='dashboard-wrapper'>
				<h4>Dashboard</h4>
				<span>Today</span>
				<div className='content-wrapper'>
					<div>
						<span>Registration</span>
						<span>{header.registration}</span>
					</div>
					<div>
						<span>Exam</span>
						<span>{header.exam}</span>
					</div>
					<div>
						<span>Interview</span>
						<span>{header.interview}</span>
					</div>
					<div>
						<span>Offer-letter issued</span>
						<span>{header.offer_letter_issued}</span>
					</div>
					<div>
						<span>Joining</span>
						<span>{header.joined}</span>
					</div>
				</div>
			</div>
			<div className='row justify-content-around'>
				<div className='row flex-column col-4 '>
					<div>
						<div className='stats'>
							<div className='header justify-content-center'>
								<img src={REGISTRATION} alt='' />
								<span>Registration</span>
							</div>

							<div style={{ backgroundColor: '#97E0FF' }}>
								<div className='data-wrapper'>
									<span>Convinced</span>
									<span>{registration.convinced}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#A7FBCD' }}>
								<div className='data-wrapper'>
									<span>Registered</span>
									<span>{registration.registered}</span>
								</div>
							</div>
						</div>
					</div>
					<div style={{ marginTop: '2rem' }}>
						<div className='stats'>
							<div className='header justify-content-center'>
								<img src={EXAM} alt='' />
								<span>Exam Report</span>
							</div>

							<div style={{ backgroundColor: '#FFB5EC' }}>
								<div className='data-wrapper'>
									<span>Total Registered Student</span>
									<span>{exam_report.total}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#A7FBCD' }}>
								<div className='data-wrapper'>
									<span>Total Exam Attended</span>
									<span>{exam_report.attended}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#FF7575' }}>
								<div className='data-wrapper'>
									<span>Exam Pending as on Date</span>
									<span>{exam_report.pending}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#FF7575' }}>
								<div
									className='data-wrapper'
									style={{
										backgroundColor: '#A7FBCD',
										width: `${(exam_report.pass * 100) / (exam_report.pass + exam_report.fail)}%`,
									}}
								>
									<span>Pass: {exam_report.pass} </span>
									<span>Fail: {exam_report.fail}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='row flex-column col-4 '>
					<div>
						<div className='stats'>
							<div className='header justify-content-center'>
								<img src={OFFERLETTER} alt='' />
								<span>Offer Letter</span>
							</div>

							<div style={{ backgroundColor: '#FFBF7B' }}>
								<div className='data-wrapper'>
									<span>Eligible Numbers</span>
									<span>{offer_letter_report.total}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#A7FBCD' }}>
								<div className='data-wrapper'>
									<span>Offer Letter Issued</span>
									<span>{offer_letter_report.issued}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#FF7575' }}>
								<div className='data-wrapper'>
									<span>Offer Letter to Send</span>
									<span>{offer_letter_report.pending}</span>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className='stats'>
							<div className='header justify-content-center'>
								<img src={JOINING} alt='' />
								<span>Joining Report</span>
							</div>

							<div style={{ backgroundColor: '#97E0FF' }}>
								<div className='data-wrapper'>
									<span>Candidates to Join {offer_letter_report.total > 50 && <FlameIcon />}</span>
									<span>{joining_report.total}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#CDFFE4' }}>
								<div className='data-wrapper'>
									<span>Joined </span>
									<span>{joining_report.joined}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#FFC0C0' }}>
								<div className='data-wrapper'>
									<span>Pending </span>
									<span>{joining_report.pending}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='row flex-column col-4 '>
					<div>
						<div className='stats'>
							<div className='header justify-content-center'>
								<img src={INTERVIEW} alt='' />
								<span>Interview Report</span>
							</div>

							<div style={{ backgroundColor: '#FFBDA3' }}>
								<div className='data-wrapper'>
									<span>Eligible for Interview</span>
									<span>{interview_report.total}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#A7FBCD' }}>
								<div className='data-wrapper'>
									<span>Interview Attended</span>
									<span>{interview_report.attended}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#FF7575' }}>
								<div className='data-wrapper'>
									<span>Interview Pending</span>
									<span>{interview_report.pending}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#FF7575' }}>
								<div
									className='data-wrapper'
									style={{
										backgroundColor: '#A7FBCD',
										width: `${
											(interview_report.pass * 100) /
											(interview_report.pass + interview_report.fail)
										}%`,
									}}
								>
									<span>Pass: {interview_report.pass}</span>
									<span>Fail: {interview_report.fail}</span>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className='stats'>
							<div className='header justify-content-center'>
								<img src={PHONE} alt='' />
								<span>Call Report</span>
							</div>

							<div style={{ backgroundColor: '#97E0FF' }}>
								<div className='data-wrapper'>
									<span>Numbers to Call</span>
									<span>{call_target.total}</span>
								</div>
							</div>
							<div style={{ backgroundColor: '#A7FBCD' }}>
								<div className='data-wrapper'>
									<span>Total Called</span>
									<span>{call_target.achived}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
