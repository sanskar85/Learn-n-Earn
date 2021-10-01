import './Students.css';
import FILTER_OUTLINED from '../../assets/filter-outlined.svg';
import FILTER_FILLED from '../../assets/filter-filled.svg';
import { CloseIcon } from '../../assets/Images';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import { Interview_Details, ScheduleMeeting, InterviewNotResponding } from '../../controllers/API';
import { CSVLink } from 'react-csv';
import ExportButton from './ExportButton';
const states = [
	'🌐 All States',
	'Andhra Pradesh',
	'Andaman and Nicobar Islands',
	'Arunachal Pradesh',
	'Assam',
	'Bihar',
	'Chandigarh',
	'Chhattisgarh',
	'Dadra and Nagar Haveli',
	'Daman and Diu',
	'Delhi',
	'Goa',
	'Gujarat',
	'Haryana',
	'Himachal Pradesh',
	'Jammu and Kashmir',
	'Jharkhand',
	'Karnataka',
	'Kerala',
	'Lakshadweep',
	'Madhya Pradesh',
	'Maharashtra',
	'Manipur',
	'Meghalaya',
	'Mizoram',
	'Nagaland',
	'Odisha',
	'Puducherry',
	'Punjab',
	'Rajasthan',
	'Sikkim',
	'Tamil Nadu',
	'Telangana',
	'Tripura',
	'Uttar Pradesh',
	'Uttarakhand',
	'West Bengal',
];

const interview_status = ['Status', 'Not Scheduled', 'Scheduled', 'Pass', 'Fail'];
const Interview = ({ showAlert, setLoading }) => {
	var today = getMaxDate();
	const [filterOpen, setFilterOpen] = useState(false);
	const [header, setHeader] = useState('eligible');
	const [interview_details, setInterviewData] = useState([]);
	const [not_responding, setNotResponding] = useState([]);
	const [filter, _setFilter] = useState({
		mobile: '',
		state: '🌐 All States',
		from_date: '2021-01-01',
		to_date: today,
		status: 'Status',
	});
	const setFilter = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		_setFilter((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};
	const column_selector = (e) => {
		$('.active').removeClass('active');
		$(e.target).addClass('active');
		setHeader(e.target.id);
	};
	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const data = await Interview_Details();
			if (data && data.success) {
				setInterviewData(data.interview_details);
				setNotResponding(data.not_responding);
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
			<div className='student-wrapper'>
				<div className='row justify-content-between'>
					<h4>Interview Report</h4>
					<img
						src={filterOpen ? FILTER_FILLED : FILTER_OUTLINED}
						onClick={(e) => {
							setFilterOpen((prev) => !prev);
						}}
						alt=''
					/>
				</div>
				{filterOpen && (
					<div className='row filters'>
						<div className='col-3'>
							<input
								type='text'
								placeholder='🔍 Search Mobile'
								name='mobile'
								value={filter.mobile}
								onChange={setFilter}
							/>
						</div>
						<div className='col-3'>
							<select
								className=''
								name='state'
								value={filter.state}
								onChange={setFilter}
								required={true}
							>
								{states.map((opt, index) => {
									return <option key={index}>{opt}</option>;
								})}
							</select>
						</div>
						<div className='col-3'>
							<span> From </span>
							<input type='date' value={filter.from_date} name='from_date' onChange={setFilter} />
						</div>
						<div className='col-3'>
							<span> To </span>
							<input type='date' value={filter.to_date} name='to_date' onChange={setFilter} />
						</div>
						<div className='col-3'>
							<select
								className=''
								name='status'
								value={filter.status}
								onChange={setFilter}
								required={true}
							>
								{interview_status.map((opt, index) => {
									return <option key={index}>{opt}</option>;
								})}
							</select>
						</div>
					</div>
				)}
				<div className='column-selector'>
					<span className='active ' onClick={column_selector} id='eligible'>
						Eligible Candidates
					</span>
					<span onClick={column_selector} id='not_responding'>
						Not Responding Candidates
					</span>
				</div>
				{header === 'eligible' && (
					<Eligible
						data={interview_details}
						filter={filter}
						showAlert={showAlert}
						setLoading={setLoading}
					/>
				)}
				{header === 'not_responding' && (
					<NotResponding
						data={not_responding}
						filter={filter}
						showAlert={showAlert}
						setLoading={setLoading}
					/>
				)}
			</div>
		</>
	);
};

const Eligible = ({ data, filter, showAlert, setLoading }) => {
	const [candidates, setCandidates] = useState([]);

	useEffect(() => {
		const filtered = data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 999);
			if (filter.mobile && !candidate.mobile.startsWith(filter.mobile)) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
				return false;
			}
			if (filter.status !== 'Status' && candidate.status !== filter.status) {
				return false;
			}
			if (new Date(candidate.scheduled_time) < new Date(filter.from_date)) {
				return false;
			}
			if (new Date(candidate.scheduled_time) > new Date(to_date)) {
				return false;
			}
			return true;
		});
		setCandidates(filtered);
	}, [data, filter]);

	const csv_header = [
		{ label: 'Name', key: 'name' },
		{ label: 'Email ID', key: 'email' },
		{ label: 'Mobile Number', key: 'mobile' },
		{ label: 'Aadhaar Number', key: 'aadhaar' },
		{ label: 'Registration Date', key: 'registration_date' },
		{ label: 'State', key: 'state' },
		{ label: 'Status', key: 'status' },
	];
	return (
		<>
			<div className='row header'>
				<span className='col-2'>Name</span>
				<span className='col-2'>Phone</span>
				<span className='col-1'>Status</span>
				<span className='col-2'>Interview Status</span>
				<span className='col-2'>Scheduled Date</span>
				<span className='col-2'>Action</span>
				<span className='col-1'>Not Responding</span>
			</div>
			<div className='details-wrapper'>
				{candidates.map((details) => {
					return (
						<EligibleCard
							key={details.mobile}
							details={details}
							showAlert={showAlert}
							setLoading={setLoading}
						/>
					);
				})}
			</div>
			<CSVLink data={candidates} headers={csv_header} filename={'eligible-candidates.csv'}>
				<ExportButton />
			</CSVLink>
		</>
	);
};

const EligibleCard = ({ details, showAlert, setLoading }) => {
	const [popup, showPopup] = useState(false);
	const [visible, setVisible] = useState(true);
	const [candidate, setCandidate] = useState(details);
	const [showInterviewForm, showInterviewFormPopup] = useState(false);
	const [meetingDetails, setMeetingDetails] = useState({
		date: currDate(),
		link: '',
	});
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};

	const statusStyle = (status) => {
		if (status === 'Not Scheduled' || status === 'Scheduled') {
			return {
				color: '#00B3FF',
			};
		} else if (status === 'Pass') {
			return {
				color: '#4AE290',
			};
		} else if (status === 'Fail') {
			return {
				color: '#FF3B60',
			};
		}
	};
	const rescheduleStyle = {
		backgroundColor: '#FF3B60',
		borderRadius: '5px',
		padding: '0.125rem 1rem',
		color: '#FFFFFF',
		fontWeight: '500',
		cursor: 'pointer',
		textAlign: 'center',
	};
	const style = (status) => {
		if (status === 'Not Scheduled' || status === 'Scheduled') {
			return {
				backgroundColor: '#5CA1F1',
				borderRadius: '5px',
				padding: '0.125rem 1rem',
				color: '#FFFFFF',
				fontWeight: '500',
				cursor: 'pointer',
				textAlign: 'center',
			};
		}
	};
	const getMeetingText = () => {
		const status = candidate.status;
		if (status === 'Not Scheduled') {
			return 'Click to Schedule';
		} else if (status === 'Scheduled') {
			return 'Start Meeting';
		} else {
			return 'Interview Completed';
		}
	};
	const getScheduledTime = () => {
		const status = candidate.status;
		if (status === 'Not Scheduled') {
			return '--/--/----';
		} else {
			return new Date(candidate.scheduled_time).toLocaleDateString('en-GB', options);
		}
	};
	const linkClickHandler = (e) => {
		if (candidate.status === 'Scheduled') {
			if (new Date().toDateString() === new Date(candidate.scheduled_time).toDateString()) {
				window.open(candidate.meeting_link, '_blank');
				showInterviewFormPopup(true);
			} else showAlert('Meeting is not scheduled for today');
		} else if (candidate.status === 'Not Scheduled') {
			showPopup(true);
		}
	};
	const openInterviewResponse = (e) => {
		window.open('/interview-response/' + candidate.meeting_id, '_blank');
		showInterviewFormPopup(false);
	};
	const changeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setMeetingDetails((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};
	const submitHandler = async (e) => {
		e.preventDefault();
		const data = await ScheduleMeeting(candidate.meeting_id, meetingDetails);
		if (data) {
			showPopup(false);
			setCandidate((prev) => {
				return {
					...prev,
					status: 'Scheduled',
					meeting_link: meetingDetails.link,
					scheduled_time: meetingDetails.date,
				};
			});
		} else {
			showAlert('Unable to save meeting details. Please try again later.');
		}
	};
	const getNotRespondingStyle = () => {
		if (candidate.status === 'Not Scheduled' || candidate.status === 'Scheduled') {
			return 'inline-block';
		} else if (candidate.status === 'Pass' || candidate.status === 'Fail') {
			return 'none';
		}
	};
	return (
		<>
			<div
				className='row details'
				style={{ cursor: 'default', display: visible ? 'flex' : 'none' }}
			>
				<span className='col-2'>{candidate.name}</span>
				<span className='col-2'>{candidate.mobile}</span>
				<span className='col-1' style={statusStyle(candidate.status)}>
					{candidate.status}
				</span>
				<span className='col-2' style={style(candidate.status)} onClick={linkClickHandler}>
					{getMeetingText()}
				</span>
				<span className='col-2'>{getScheduledTime()}</span>
				<span
					className='col-2'
					style={rescheduleStyle}
					onClick={(e) => {
						showPopup(true);
					}}
				>
					Re-Schedule
				</span>
				<span
					className='col-1'
					style={{ display: getNotRespondingStyle() }}
					onClick={async (e) => {
						setLoading(true);
						const data = await InterviewNotResponding(candidate._id);
						if (data) {
							setLoading(false);
							setVisible(false);
						} else {
							setLoading(false);
							showAlert('Unable to set not responding...');
						}
					}}
				>
					<CloseIcon />
				</span>
			</div>
			{popup && (
				<div className='popup-wrapper'>
					<div className='popup'>
						<CloseIcon
							onClick={(e) => {
								showPopup(false);
							}}
						/>
						<div>
							<span className='popup-details'>Schedule Meeting </span>
							<span className='popup-details'>Name : {candidate.name}</span>
						</div>
						<form className='popup-from' onSubmit={submitHandler}>
							<span> Meeting Date </span>
							<input
								type='date'
								name='date'
								value={meetingDetails.date}
								onChange={changeHandler}
								min={currDate()}
								max={getMaxDate()}
								style={{ margin: '1rem 1.5rem' }}
							/>
							<div>
								<span>Create Meeting Link</span>
								<a href='https://meet.google.com/' target='_blank' rel='noreferrer'>
									Google Meet
								</a>
							</div>
							<input
								type='text'
								name='link'
								value={meetingDetails.link}
								onChange={changeHandler}
								required={true}
								placeholder='Enter Created Meeting Link'
							/>
							<button className='submit-btn'>Save Meeting Data</button>
						</form>
					</div>
				</div>
			)}
			{showInterviewForm && (
				<div className='popup-wrapper'>
					<div className='popup'>
						<CloseIcon
							onClick={(e) => {
								showInterviewFormPopup(false);
							}}
						/>
						<button className='interview-response-btn' onClick={openInterviewResponse}>
							Open Interview Response Form
						</button>
					</div>
				</div>
			)}
		</>
	);
};

const NotResponding = ({ data, filter, showAlert, setLoading }) => {
	const [candidates, setCandidates] = useState([]);

	useEffect(() => {
		const filtered = data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 999);
			if (filter.mobile && !candidate.mobile.startsWith(filter.mobile)) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
				return false;
			}
			if (filter.status !== 'Status' && candidate.status !== filter.status) {
				return false;
			}
			if (new Date(candidate.registration_date) < new Date(filter.from_date)) {
				return false;
			}
			if (new Date(candidate.registration_date) > new Date(to_date)) {
				return false;
			}
			return true;
		});
		setCandidates(filtered);
	}, [data, filter]);

	const csv_header = [
		{ label: 'Name', key: 'name' },
		{ label: 'Email ID', key: 'email' },
		{ label: 'Mobile Number', key: 'mobile' },
		{ label: 'Aadhaar Number', key: 'aadhaar' },
		{ label: 'Registration Date', key: 'registration_date' },
		{ label: 'State', key: 'state' },
	];
	return (
		<>
			<div className='row header'>
				<span className='col-3'>Name</span>
				<span className='col-3'>Phone</span>
				<span className='col-3'>Email</span>
				<span className='col-3'>Registration Date</span>
			</div>
			<div className='details-wrapper'>
				{candidates.map((details) => {
					return (
						<NotRespondingCard
							key={details.mobile}
							details={details}
							showAlert={showAlert}
							setLoading={setLoading}
						/>
					);
				})}
			</div>
			<CSVLink data={candidates} headers={csv_header} filename={'not-responding-candidates.csv'}>
				<ExportButton />
			</CSVLink>
		</>
	);
};

const NotRespondingCard = ({ details, showAlert, setLoading }) => {
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};

	return (
		<div className='row details' style={{ cursor: 'default' }}>
			<span className='col-3'>{details.name}</span>
			<span className='col-3'>{details.mobile}</span>
			<span className='col-3'>{details.email}</span>
			<span className='col-3'>
				{new Date(details.registration_date).toLocaleDateString('en-GB', options)}
			</span>
		</div>
	);
};

function getMaxDate() {
	var dtToday = new Date();
	var year = dtToday.getFullYear();
	var date = year + '-' + 12 + '-' + 31;
	return date;
}
function currDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}

	today = yyyy + '-' + mm + '-' + dd;
	return today;
}

export default Interview;
