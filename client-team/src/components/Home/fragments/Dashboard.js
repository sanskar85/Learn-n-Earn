import './Dashboard.css';
import { useState, useEffect } from 'react';
import { MyDashboard } from '../../controllers/API';
import PHONE from '../../assets/phone.svg';
import RING from '../../assets/ring.svg';
import STUDENT from '../../assets/student.svg';
import EXAM from '../../assets/exam-report.svg';
import INTERVIEW from '../../assets/interview-report.svg';
import OFFERLETTER from '../../assets/offerletter.svg';
import { ArrowUp, FlameIcon } from '../../assets/Images';
const Dashboard = ({ setLoading, showAlert }) => {
	const [call_target, setCallTarget] = useState({
		achieved: 0,
		pending: 0,
	});
	const [student_corner, setStudentCorner] = useState({
		interested: 0,
		registered: 0,
		percantage1: 0,
		percantage2: 0,
	});
	const [exam_report, setExamReport] = useState({
		total: 0,
		attended: 0,
		not_attended: 0,
		percantage1: 0,
		percantage2: 0,
	});
	const [interview_report, setInterviewReport] = useState({
		total: 0,
		completed: 0,
		pending: 0,
		percantage1: 0,
		percantage2: 0,
	});
	const [offer_letter_report, setOfferLetterReport] = useState({
		total: 0,
		issued: 0,
		not_issued: 0,
		percantage1: 0,
		percantage2: 0,
	});

	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const data = await MyDashboard();
			if (data && data.success) {
				setCallTarget(data.call_target);
				setStudentCorner(data.student_corner);
				setExamReport(data.exam_report);
				setInterviewReport(data.interview_report);
				setOfferLetterReport(data.offer_letter_report);
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
			<div className='row justify-content-center'>
				<div className='col-4'>
					<div className='stats'>
						<div className='header justify-content-center'>
							<img src={EXAM} alt='' />
							<span>Exam Report</span>
						</div>

						<div style={{ backgroundColor: '#CDE38E' }}>
							<div className='data-wrapper'>
								<span>Total Registered Candidates</span>
								<span>{exam_report.total}</span>
							</div>
						</div>
						<div style={{ backgroundColor: '#CDFFE4' }}>
							<div
								className='data-wrapper'
								style={{
									backgroundColor: '#8BFABE',
									width: `${exam_report.percantage1}%`,
								}}
							>
								<span>Total Exam Attended {exam_report.percantage1 > 80 && <ArrowUp />}</span>
								<span>{exam_report.attended}</span>
							</div>
						</div>
						<div style={{ backgroundColor: '#FFC0C0' }}>
							<div
								className='data-wrapper'
								style={{
									backgroundColor: '#FF8787',
									width: `${exam_report.percantage2}%`,
								}}
							>
								<span>Exam Pending as on Date </span>
								<span>{exam_report.not_attended}</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-4'>
					<div className='stats'>
						<div className='header justify-content-center'>
							<img src={INTERVIEW} alt='' />
							<span>Interview Report</span>
						</div>

						<div style={{ backgroundColor: '#FFB2F6' }}>
							<div className='data-wrapper'>
								<span>Eligible for Interview</span>
								<span>{interview_report.total}</span>
							</div>
						</div>
						<div style={{ backgroundColor: '#CDFFE4' }}>
							<div
								className='data-wrapper'
								style={{
									backgroundColor: '#8BFABE',
									width: `${interview_report.percantage1}%`,
								}}
							>
								<span>Interview Attended {interview_report.percantage1 > 80 && <ArrowUp />}</span>
								<span>{interview_report.completed}</span>
							</div>
						</div>
						<div style={{ backgroundColor: '#FFC0C0' }}>
							<div
								className='data-wrapper'
								style={{
									backgroundColor: '#FF8787',
									width: `${interview_report.percantage2}%`,
								}}
							>
								<span>Interview Pending </span>
								<span>{interview_report.pending}</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-4'>
					<div className='stats'>
						<div className='header justify-content-center'>
							<img src={OFFERLETTER} alt='' />
							<span>Offer Letter</span>
						</div>

						<div style={{ backgroundColor: '#CDFFE4' }}>
							<div className='data-wrapper'>
								<span>Eligible Numbers {offer_letter_report.total > 50 && <FlameIcon />}</span>
								<span>{offer_letter_report.total}</span>
							</div>
						</div>
						<div style={{ backgroundColor: '#CDFFE4' }}>
							<div
								className='data-wrapper'
								style={{
									backgroundColor: '#8BFABE',
									width: `${offer_letter_report.percantage1}%`,
								}}
							>
								<span>
									Offer Letter Issued {offer_letter_report.percantage1 > 80 && <ArrowUp />}
								</span>
								<span>{offer_letter_report.issued}</span>
							</div>
						</div>
						<div style={{ backgroundColor: '#FFC0C0' }}>
							<div
								className='data-wrapper'
								style={{
									backgroundColor: '#FF8787',
									width: `${offer_letter_report.percantage2}%`,
								}}
							>
								<span>Offer Letter to Send </span>
								<span>{offer_letter_report.not_issued}</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-4'>
					<div className='stats'>
						<div className='header justify-content-center'>
							<img src={PHONE} alt='' />
							<span>Call Target</span>
							<img src={RING} alt='' />
						</div>

						<div style={{ backgroundColor: '#CDFFE4' }}>
							<div className='data-wrapper'>
								<span>Call Attended</span>
								<span>{call_target.achieved}</span>
							</div>
						</div>
						<div style={{ backgroundColor: '#B6D8FF' }}>
							<div className='data-wrapper'>
								<span>Pending Calls</span>
								<span>{call_target.pending}</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-4'>
					<div className='stats'>
						<div className='header justify-content-center'>
							<img src={STUDENT} alt='' />
							<span>Candidates Corner</span>
						</div>

						<div style={{ backgroundColor: '#B6D8FF' }}>
							<div
								className='data-wrapper'
								style={{
									backgroundColor: '#6DAAF1',
									width: `${student_corner.percantage1}%`,
								}}
							>
								<span>Registered </span>
								<span>{student_corner.registered}</span>
							</div>
						</div>
						<div style={{ backgroundColor: '#CDFFE4' }}>
							<div
								className='data-wrapper'
								style={{
									backgroundColor: '#8BFABE',
									width: `${student_corner.percantage2}%`,
								}}
							>
								<span>Interested {student_corner.percantage2 > 80 && <ArrowUp />} </span>
								<span>{student_corner.interested}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
