import { useState, useEffect } from 'react';
import { MyDashboard, DownloadOfferLetter } from '../Controller/API';
import '../comps/NavigationBar.css';
import '../comps/Dashboard.css';
import NavigationBar from './NavigationBar';
import {
	PhoneIcon,
	GoogleIcon,
	TestResultIcon,
	AlarmIcon,
	CalenderIcon,
	ErrorIcon,
	BookIcon,
	DownloadIcon,
} from '../assets/Images';

const getInterviewTime = (time) => {
	if (time.includes('schedule')) {
		return time;
	} else {
		return new Date(time).toDateString();
	}
};
const CandidateStatus = {
	NOT_VERIFIED: 'Documents Not Verified',
	NOT_ELIGIBLE: 'Not Eligible for Exam',
	ELIGIBLE: 'Eligible for Exam',
	INTERVIEW: 'Eligible for Interview',
	OFFER_LETTER: 'Eligible for Offer Letter',
	ADMITTED: 'Admitted to an Company',
	FAILED: 'Failed in Exam',
	REJECTED: 'Rejected in Interview',
};
export default function Dashboard({ setTitle, history }) {
	const [notices, setNotices] = useState([]);
	const [user, setUser] = useState(null);
	const [examDetails, setExamDetails] = useState(false);
	const [interviewDetails, setInterViewDetails] = useState({
		time: '',
		link: '',
	});
	const [agentDetails, setAgentDetails] = useState({
		name: '',
		email: '',
		mobile: '',
	});

	useEffect(() => {
		let isMounted = true;
		setTitle('Home • Learn n Earn');
		async function fetchData() {
			if (isMounted) {
				const data = await MyDashboard();
				if (data && data.success) {
					setNotices(data.notices);
					setUser(data.details);
					setAgentDetails(data.agent);
					setExamDetails(data.exam);
					setInterViewDetails(data.interview);
				} else {
					alert('Cannot load your details. Please contact administrator');
				}
			}
		}
		fetchData();
		return () => {
			isMounted = false;
		};
	}, [history, setTitle]);

	const clickHandler = async (type) => {
		if (type === 'exam') {
			history.push('/start-exam/terms');
		}
		if (type === 'interview') {
			if (interviewDetails.link) window.open(interviewDetails.link, '_blank');
			else alert('Interview is not scheduled yet. Wait for our team to schedule your Interview.');
		}
		if (type === 'offer_letter') {
			const data = await DownloadOfferLetter();
			if (!data) {
				alert(
					'Your Offer letter is not generated yet. If you got letter confirmation on Email/Mobile, kindly ask in query'
				);
			}
		}
	};
	if (!user) return <>Loading...</>;
	return (
		<>
			<NavigationBar name={user.name} history={history} />

			<div className=' row student-dashboard-wrapper '>
				<div className='col-lg-3 col-md-7 col-sm-10'>
					<Card notices={notices} />
					<div className='card contact-us'>
						<span className='sup-text' style={{ marginBottom: '10px' }}>
							Contact Us
						</span>
						<p>
							<a href={`tel:${agentDetails.mobile}`}>
								<PhoneIcon /> <span>{agentDetails.mobile}</span>
							</a>
						</p>
						<p>
							<a href={`mailto::${agentDetails.email}`}>
								<GoogleIcon /> <span>{agentDetails.email}</span>
							</a>
						</p>
					</div>
				</div>
				<div className='col-lg-6  col-sm-10'>
					{user.canGiveExam ? (
						<Details
							heading='Take the test now !'
							type='exam'
							btnText='START'
							message='Please read all the instruction before starting the Exam !'
							component={
								<p>
									<AlarmIcon />
									Time 1 hour 15 minutes &emsp; <BookIcon /> Questions 60
								</p>
							}
							clickHandler={clickHandler}
						/>
					) : (
						<ResultDetails details={examDetails} />
					)}
					{user.status === CandidateStatus.INTERVIEW && (
						<Details
							heading='Interview !'
							type='interview'
							btnText='START'
							message='Please read all the instruction before starting the Interview !'
							component={
								<p>
									<AlarmIcon />
									Time 1 hour &emsp; <CalenderIcon /> {getInterviewTime(interviewDetails.time)}
								</p>
							}
							clickHandler={clickHandler}
						/>
					)}
					{(user.status === CandidateStatus.OFFER_LETTER ||
						user.status === CandidateStatus.ADMITTED) && (
						<>
							<Details
								heading='Download your Offer Letter'
								type='offer_letter'
								message='Please contact your incharge for any further Queries. If you are unable to download or have any issue with offer letter, contact Administrator!'
								btnText={<DownloadIcon />}
								clickHandler={clickHandler}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
}

export const Card = ({ notices }) => {
	return (
		<div>
			<div className='card notice'>
				<span className='sup-text'>Notice !</span>
				{notices.map((notice, index) => {
					return (
						<>
							<p key={index}>
								<lottie-player
									src='https://assets1.lottiefiles.com/packages/lf20_WdbegN.json'
									background='transparent'
									speed='1'
									style={{ width: '32px', height: '32px' }}
									loop
									autoplay
								></lottie-player>
								<span>{notice.message}</span>
							</p>
						</>
					);
				})}
			</div>
		</div>
	);
};

export const ResultDetails = ({ details }) => {
	return (
		<>
			<div
				className='row card status-wrapper justify-content-center'
				style={{
					background: `${details.report === 'PASS' ? '#EFFFEF' : '#FFEBEB'}`,
				}}
			>
				<div className='col-lg-10 col-sm-12'>
					<span className='sup-text'>Test result</span>
					<hr className='hr_horizontal' />
					<p
						style={{
							color: '#084165',
							fontSize: '1.05rem',
							fontWeight: '500',
						}}
					>
						<TestResultIcon />
						Marks Obtained : {details.marks}
					</p>
				</div>
				<div
					className='col-lg-2 col-sm-6'
					style={{ display: 'inline-flex', justifyContent: 'center' }}
				>
					<span
						style={{
							color: `${details.report === 'PASS' ? '#06C15C' : '#E03347'}`,
							fontSize: '1.7rem',
							fontWeight: '600',
						}}
					>
						{details.report}
					</span>
				</div>
			</div>
		</>
	);
};

export const Details = ({ heading, type, clickHandler, component, btnText, message }) => {
	return (
		<>
			<div className='row card status-wrapper justify-content-center'>
				<div className='col-lg-10 col-sm-12'>
					<span className='sup-text'>{heading}</span>
					<hr className='hr_horizontal' />
					{component}
					<p style={{ color: '#084165' }}>
						<ErrorIcon />
						{message}
					</p>
				</div>
				<div
					className='col-lg-2 col-sm-6'
					style={{
						display: 'inline-flex',
						justifyContent: 'center',
						paddingLeft: '0',
						paddingRight: '0',
					}}
				>
					<button
						className='submit-btn'
						onClick={(e) => {
							clickHandler(type);
						}}
					>
						{btnText}
					</button>
				</div>
			</div>
		</>
	);
};
