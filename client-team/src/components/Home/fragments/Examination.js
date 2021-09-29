import './Students.css';
import FILTER_OUTLINED from '../../assets/filter-outlined.svg';
import FILTER_FILLED from '../../assets/filter-filled.svg';
import { CloseIcon } from '../../assets/Images';
import POPUP_IMAGE from '../../assets/popup.svg';
import { Examination_Details, Notify_Candidate, ExamNotResponding } from '../../controllers/API';
import { useState, useEffect } from 'react';
import $ from 'jquery';
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

const Examination = ({ showAlert, setLoading }) => {
	var today = currDate();
	const [filterOpen, setFilterOpen] = useState(false);
	const [attended, setAttended] = useState([]);
	const [not_attended, setNotAttended] = useState([]);
	const [not_responding, setNotResponding] = useState([]);
	const [header, setHeader] = useState('attended');
	const [filter, _setFilter] = useState({
		mobile: '',
		state: '🌐 All States',
		from_date: '2021-01-01',
		to_date: today,
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
			const data = await Examination_Details();
			if (data && data.success) {
				setAttended(data.attended);
				setNotAttended(data.not_attended);
				setNotResponding(data.not_responding);
			} else {
				console.log(data);
			}
			setLoading(false);
		}
		fetchData();
	}, [setLoading]);
	return (
		<>
			<div className='student-wrapper'>
				<div className='row justify-content-between'>
					<h4>Examination Report</h4>
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
					</div>
				)}

				<div className='column-selector'>
					<span className='active ' onClick={column_selector} id='attended'>
						Attended
					</span>
					<span onClick={column_selector} id='eligible'>
						Eligible
					</span>
					<span onClick={column_selector} id='not_responding'>
						Not Responding
					</span>
				</div>
				{header === 'attended' && (
					<Attended data={attended} filter={filter} showAlert={showAlert} />
				)}
				{header === 'eligible' && (
					<Eligible
						data={not_attended}
						filter={filter}
						showAlert={showAlert}
						setLoading={setLoading}
					/>
				)}
				{header === 'not_responding' && <NotResponding data={not_responding} filter={filter} />}
			</div>
		</>
	);
};

const Attended = ({ data, filter }) => {
	const [attended, setAttended] = useState([]);
	useEffect(() => {
		const filtered = data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 0);

			if (filter.mobile && !candidate.mobile.startsWith(filter.mobile)) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
				return false;
			}
			if (new Date(candidate.examination_date) < new Date(filter.from_date)) {
				return false;
			}
			if (new Date(candidate.examination_date) > new Date(to_date)) {
				return false;
			}
			return true;
		});
		setAttended(filtered);
	}, [data, filter]);

	const csv_header = [
		{ label: 'Name', key: 'name' },
		{ label: 'Email ID', key: 'email' },
		{ label: 'Mobile Number', key: 'mobile' },
		{ label: 'Examination Date', key: 'examination_date' },
		{ label: 'Marks Obtained', key: 'marks_obtained' },
		{ label: 'Examination Status', key: 'status' },
		{ label: 'State', key: 'state' },
	];

	return (
		<>
			<div className='row header'>
				<span className='col-3'>Name</span>
				<span className='col-3'>Phone</span>
				<span className='col-2'>Marks Obtained</span>
				<span className='col-2'>Result</span>
				<span className='col-2'>Examination Date</span>
			</div>
			<div className='details-wrapper'>
				{attended.map((candidate) => {
					return <AttendedCard key={candidate} candidate={candidate} />;
				})}
			</div>
			<CSVLink data={attended} headers={csv_header} filename={'exam-attended-candidates.csv'}>
				<ExportButton />
			</CSVLink>
		</>
	);
};

const AttendedCard = ({ candidate }) => {
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
	const style = (status) => {
		return {
			color: status === 'Pass' ? '#4AE290' : status === 'Fail' ? '#E03347' : '#9C29E4',
		};
	};
	return (
		<>
			<div className='row details'>
				<span className='col-3'>{candidate.name}</span>
				<span className='col-3'>{candidate.mobile}</span>
				<span className='col-2' style={{ color: '#00B3FF' }}>
					{candidate.marks_obtained}
				</span>
				<span className='col-2' style={style(candidate.status)}>
					{candidate.status}
				</span>
				<span className='col-2'>
					{new Date(candidate.examination_date).toLocaleDateString('en-GB', options)}
				</span>
			</div>
		</>
	);
};

const Eligible = ({ data, filter, showAlert, setLoading }) => {
	const [eligible, setEligible] = useState([]);
	useEffect(() => {
		const filtered = data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 0);

			if (filter.mobile && !candidate.mobile.startsWith(filter.mobile)) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
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
		setEligible(filtered);
	}, [data, filter]);

	const csv_header = [
		{ label: 'Name', key: 'name' },
		{ label: 'Email ID', key: 'email' },
		{ label: 'Mobile Number', key: 'mobile' },
		{ label: 'Registration Date', key: 'registration_date' },
		{ label: 'State', key: 'state' },
	];

	return (
		<>
			<div className='row header'>
				<span className='col-3'>Name</span>
				<span className='col-3'>Phone</span>
				<span className='col-3'>Registration Date</span>
				<span className='col-2'>Send Notification</span>
				<span className='col-1'>Not Responding</span>
			</div>
			<div className='details-wrapper'>
				{eligible.map((candidate) => {
					return (
						<EligibleCard
							key={candidate}
							candidate={candidate}
							showAlert={showAlert}
							setLoading={setLoading}
						/>
					);
				})}
			</div>
			<CSVLink data={eligible} headers={csv_header} filename={'exam-eligible-candidates.csv'}>
				<ExportButton />
			</CSVLink>
		</>
	);
};

const EligibleCard = ({ candidate, showAlert, setLoading }) => {
	const [notifier, setnotifier] = useState([]);
	const [visible, setVisible] = useState(true);
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
	const style = {
		background: '#5CA1F1',
		textAlign: 'center',
		padding: '3px 5px',
		fontWeight: '500',
		color: '#FFFFFF',
		borderRadius: '5px',
		cursor: 'pointer',
	};
	const [popup, showPopup] = useState(false);

	const changeHandler = (e) => {
		if (e.target.checked) {
			setnotifier((prev) => {
				return [...prev, e.target.name];
			});
		} else {
			setnotifier((prev) => {
				return prev.filter((id) => id !== e.target.name);
			});
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();
		var selected = notifier.filter(onlyUnique);
		if (selected.length === 0) {
			return showAlert('No options selected');
		}
		Notify_Candidate(candidate.student_id, selected);
		showPopup(false);
		setnotifier([]);
	};
	return (
		<>
			<div
				className='row details'
				style={{ cursor: 'default', display: visible ? 'flex' : 'none' }}
			>
				<span className='col-3'>{candidate.name}</span>
				<span className='col-3'>{candidate.mobile}</span>
				<span className='col-3'>
					{new Date(candidate.registration_date).toLocaleDateString('en-GB', options)}
				</span>
				<span className='col-2' style={style} onClick={(e) => {}}>
					Send Message
				</span>
				<span
					className='col-1'
					onClick={async (e) => {
						setLoading(true);
						const data = await ExamNotResponding(candidate._id);
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
							<span className='popup-details'>Send Message</span>
							<span className='popup-details'>Name : {candidate.name}</span>
						</div>
						<div className='row' style={{ marginTop: '2rem' }}>
							<div className='col-9'>
								<style className='popup-details' style={{ fontWeight: '600' }}>
									Select Mode
								</style>
								<form className='popup-from' onSubmit={submitHandler}>
									<input
										type='checkbox'
										id='email'
										name='email'
										value='email'
										onChange={changeHandler}
									/>
									<label for='email'> Email</label>
									<input type='checkbox' id='sms' name='sms' value='sms' onChange={changeHandler} />
									<label for='sms'> SMS</label>
									<input
										type='checkbox'
										id='dashboard'
										name='dashboard'
										value='dashboard'
										onChange={changeHandler}
									/>
									<label for='dashboard'> Dashboard Notice</label>
									<button className='submit-btn'>Send Notification</button>
								</form>
							</div>
							<img src={POPUP_IMAGE} className='col-3' alt='' />
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const NotResponding = ({ data, filter, showAlert }) => {
	const [notResponding, setResponding] = useState([]);
	useEffect(() => {
		const filtered = data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 0);

			if (filter.mobile && !candidate.mobile.startsWith(filter.mobile)) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
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
		setResponding(filtered);
	}, [data, filter]);

	const csv_header = [
		{ label: 'Name', key: 'name' },
		{ label: 'Email ID', key: 'email' },
		{ label: 'Mobile Number', key: 'mobile' },
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
				{notResponding.map((candidate) => {
					return <NotRespondingCard key={candidate} candidate={candidate} showAlert={showAlert} />;
				})}
			</div>
			<CSVLink
				data={notResponding}
				headers={csv_header}
				filename={'exam-not-responding-candidates.csv'}
			>
				<ExportButton />
			</CSVLink>
		</>
	);
};

const NotRespondingCard = ({ candidate, showAlert }) => {
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
	return (
		<>
			<div className='row details' style={{ cursor: 'default' }}>
				<span className='col-3'>{candidate.name}</span>
				<span className='col-3'>{candidate.mobile}</span>
				<span className='col-3'>{candidate.email}</span>
				<span className='col-3'>
					{new Date(candidate.registration_date).toLocaleDateString('en-GB', options)}
				</span>
			</div>
		</>
	);
};

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

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}
export default Examination;
