import './Students.css';
import FILTER_OUTLINED from '../../assets/filter-outlined.svg';
import FILTER_FILLED from '../../assets/filter-filled.svg';
import { CloseIcon } from '../../assets/Images';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import { Students as MyStudents, FetchImage, UpdateStudentStatus } from '../../controllers/API';
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

const Students = ({ setLoading, showAlert }) => {
	var today = currDate();
	const [filterOpen, setFilterOpen] = useState(false);
	const [candidates, setCandidates] = useState([]);
	const [interested, setInterested] = useState([]);
	const [not_verified, setNotVerified] = useState([]);
	const [profile_not_completed, setProfileNotComplete] = useState([]);
	const [header, setHeader] = useState('candidates');
	const [filter, _setFilter] = useState({
		mobile: '',
		state: '🌐 All States',
		from_date: '2021-01-01',
		to_date: today,
		exam_status: 'Exam Status',
		interview_status: 'Interview Status',
		offer_letter_status: 'Offer Letter',
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
			const data = await MyStudents();
			if (data && data.success) {
				setInterested(data.interested);
				setCandidates(data.candidates);
				setNotVerified(data.not_verified);
				setProfileNotComplete(data.profile_not_completed);
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
					<h4>Student Management</h4>
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
						<div
							className='col-3'
							style={{
								display: `${header === 'candidates' ? 'inline-block' : 'none'}`,
							}}
						>
							<select name='exam_status' value={filter.exam_status} onChange={setFilter}>
								<option>Exam Status</option>
								<option>Pass</option>
								<option>Fail</option>
								<option>Started</option>
							</select>
						</div>
						<div
							className='col-3'
							style={{
								display: `${header === 'candidates' ? 'inline-block' : 'none'}`,
							}}
						>
							<select name='interview_status' value={filter.interview_status} onChange={setFilter}>
								<option>Interview Status</option>
								<option>Not Scheduled</option>
								<option>Scheduled</option>
								<option>Pass</option>
								<option>Fail</option>
							</select>
						</div>
						<div
							className='col-3'
							style={{
								display: `${header === 'candidates' ? 'inline-block' : 'none'}`,
							}}
						>
							<span style={{ marginLeft: '2rem' }}></span>
							<select
								name='offer_letter_status'
								value={filter.offer_letter_status}
								onChange={setFilter}
							>
								<option>Offer Letter</option>
								<option>Issued</option>
								<option>Joined</option>
							</select>
						</div>
					</div>
				)}

				<div className='column-selector'>
					<span className='active ' onClick={column_selector} id='candidates'>
						All Candidates
					</span>
					<span onClick={column_selector} id='profile_not_completed'>
						Profile Not Completed Candidates
					</span>
					<span onClick={column_selector} id='not_verified'>
						Not Verified Candidates
					</span>
					<span onClick={column_selector} id='interested'>
						Interested Candidates
					</span>
				</div>
				{header === 'candidates' && <Candidates data={candidates} filter={filter} />}
				{header === 'interested' && <Interested data={interested} filter={filter} />}
				{header === 'profile_not_completed' && (
					<ProfileNotCompleted
						data={profile_not_completed}
						filter={filter}
						setLoading={setLoading}
						showAlert={showAlert}
					/>
				)}
				{header === 'not_verified' && (
					<NotVerified
						data={not_verified}
						filter={filter}
						setLoading={setLoading}
						showAlert={showAlert}
					/>
				)}
			</div>
		</>
	);
};

const Candidates = ({ data, filter }) => {
	const [candidates, setCandidates] = useState([]);
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
			if (new Date(candidate.createdAt) < new Date(filter.from_date)) {
				return false;
			}
			if (new Date(candidate.createdAt) > new Date(to_date)) {
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
		{ label: 'D O B', key: 'DOB' },
		{ label: 'Registration Date', key: 'registration_date' },
		{ label: 'Aadhaar Number', key: 'aadhaar' },
		{ label: 'Father Name', key: 'fname' },
		{ label: 'Gender', key: 'fname' },
		{ label: 'District', key: 'district' },
		{ label: 'State', key: 'state' },
		{ label: 'Pincode', key: 'pincode' },
		{ label: 'Qualification', key: 'qualification' },
		{ label: 'College', key: 'college' },
		{ label: 'CGPA', key: 'cgpa' },
		{ label: 'Diploma', key: 'diploma' },
		{ label: 'Year of Passing', key: 'y_o_p' },
		{ label: 'Any Backlog ?', key: 'backlog' },
		{ label: 'Height', key: 'height' },
		{ label: 'Weight', key: 'weight' },
		{ label: 'Opportunity', key: 'opportunity' },
		{ label: 'Worked in which Plant ?', key: 'plant_worked' },
		{ label: 'PWD', key: 'pwd' },
		{ label: 'Work Experience', key: 'work_experience' },
		{ label: 'Examination', key: 'examination' },
		{ label: 'Interview', key: 'interview' },
		{ label: 'Offer Letter', key: 'offer_letter' },
	];

	return (
		<>
			<div className='row header'>
				<span className='col-2'>Name</span>
				<span className='col-2'>Phone</span>
				<span className='col-2'>Exam</span>
				<span className='col-2'>Interview</span>
				<span className='col-2'>Offer-Letter</span>
				<span className='col-2'>Registration Date</span>
			</div>
			<div className='details-wrapper'>
				{candidates.map((candidate) => {
					return <CandidateCard key={candidate} candidate={candidate} />;
				})}
			</div>

			<CSVLink data={candidates} headers={csv_header} filename={'eligible-candidates.csv'}>
				<ExportButton />
			</CSVLink>
		</>
	);
};

const CandidateCard = ({ candidate }) => {
	const [expanded, setExpanded] = useState(false);
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
	const processExam = (details) => {
		if (candidate.examination === 'Pass') return 'Pass';
		if (candidate.examination === 'Fail') return 'Fail';
		else return 'Pending';
	};

	const processInterview = () => {
		const exam = processExam();
		if (exam === 'Pass') {
			return candidate.interview;
		} else if (exam === 'Fail') {
			return 'Fail';
		} else {
			return 'Pending';
		}
	};

	const processOfferLetter = () => {
		const interview = processInterview();
		if (interview === 'Pass') {
			if (candidate.offer_letter) return candidate.offer_letter;
			else return 'Pending';
		} else if (interview === 'Fail') {
			return 'Fail';
		} else {
			return 'Pending';
		}
	};
	return (
		<>
			<div
				className='row details'
				onClick={(e) => {
					setExpanded(true);
				}}
			>
				<span className='col-2'>{candidate.name}</span>
				<span className='col-2'>{candidate.mobile}</span>
				<span className='col-2' style={style(processExam())}>
					{processExam(candidate)}
				</span>
				<span className='col-2' style={style(processInterview())}>
					{processInterview(candidate)}
				</span>
				<span className='col-2' style={style(processOfferLetter())}>
					{processOfferLetter(candidate)}
				</span>
				<span className='col-2'>
					{new Date(candidate.registration_date).toLocaleDateString('en-GB', options)}
				</span>
			</div>

			{expanded && (
				<>
					<div className='popup-wrapper'>
						<div className='extra-details'>
							<CloseIcon
								onClick={(e) => {
									setExpanded(false);
								}}
							/>
							<div className='row justify-content-between ' style={{ marginTop: '2.5rem' }}>
								<div className='col-7 candidate-details'>
									<div>
										Name : <span>{candidate.name}</span>
									</div>
									<div>
										Mobile No. : <span>{candidate.mobile}</span>
									</div>
									<div>
										Email : <span>{candidate.email}</span>
									</div>
									<div>
										Gender : <span>{candidate.gender}</span>
									</div>
									<div>
										DOB :<span>{new Date(candidate.DOB).toLocaleDateString('en-GB', options)}</span>
									</div>
									<div>
										Age (as on date) :<span>{calculateAge(candidate.DOB)}</span>
									</div>
									<div>
										Aadhaar no. : <span>{candidate.aadhaar}</span>
									</div>
									<div>
										Father's Name : <span>{candidate.fname}</span>
									</div>
									<div>
										District : <span>{candidate.district}</span>
									</div>
									<div>
										State : <span>{candidate.state}</span>
									</div>
									<div>
										Pincode : <span>{candidate.pincode}</span>
									</div>
									<div>
										Height : <span>{candidate.height}</span>
									</div>
									<div>
										Weight : <span>{candidate.weight}</span>
									</div>
									<div>
										Qualification : <span>{candidate.qualification}</span>
									</div>
									<div>
										College : <span>{candidate.college}</span>
									</div>
									<div>
										Year Of Passing : <span>{candidate.y_o_p}</span>
									</div>
									<div>
										CGPA : <span>{candidate.cgpa}</span>
									</div>
									<div>
										Diploma : <span>{candidate.diploma}</span>
									</div>
									<div>
										Backlog : <span>{candidate.backlog}</span>
									</div>
									<div>
										How you come to know about this opportunity? :{' '}
										<span>{candidate.opportunity}</span>
									</div>
									<div>
										Which Plant You Have Worked In Tata Motors-Pune :{' '}
										<span>{candidate.plant_worked}</span>
									</div>
									<div>
										Work Experience : <span>{candidate.work_experience}</span>
									</div>
								</div>
								<div className='col-5 images'>
									<img src={FetchImage(candidate.photo)} alt='' />
									<img src={FetchImage(candidate.aadhaar_photo)} alt='' />
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

const Interested = ({ data, filter }) => {
	const [intrested, setIntrested] = useState([]);
	useEffect(() => {
		const filtered = data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 0);
			if (
				filter.mobile &&
				!candidate.mobile1.startsWith(filter.mobile) &&
				!candidate.mobile2.startsWith(filter.mobile)
			) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
				return false;
			}
			if (new Date(candidate.createdAt) < new Date(filter.from_date)) {
				return false;
			}
			if (new Date(candidate.createdAt) > new Date(to_date)) {
				return false;
			}
			return true;
		});
		setIntrested(filtered);
	}, [data, filter]);
	const csv_header = [
		{ label: 'Name', key: 'name' },
		{ label: 'Email ID', key: 'email' },
		{ label: 'Mobile Number 1', key: 'mobile1' },
		{ label: 'Mobile Number 2', key: 'mobile2' },
		{ label: 'State', key: 'state' },
		{ label: 'Qualification', key: 'qualification' },
		{ label: 'Source', key: 'source' },
	];

	return (
		<>
			<div className='row header'>
				<span className='col-3'>Name</span>
				<span className='col-2'>Mobile 1</span>
				<span className='col-2'>Mobile 2</span>
				<span className='col-2'>State</span>
				<span className='col-3'>Date</span>
			</div>
			<div className='details-wrapper'>
				{intrested.map((candidate) => {
					return <InterestedCard key={candidate} candidate={candidate} />;
				})}
			</div>
			<CSVLink data={intrested} headers={csv_header} filename={'interested-candidates.csv'}>
				<ExportButton />
			</CSVLink>
		</>
	);
};

const InterestedCard = ({ candidate }) => {
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
	return (
		<>
			<div className='row details' style={{ cursor: 'default' }}>
				<span className='col-3'>{candidate.name}</span>
				<span className='col-2'>{candidate.mobile1}</span>
				<span className='col-2'>{candidate.mobile2}</span>
				<span className='col-2'>{candidate.state}</span>
				<span className='col-3'>
					{new Date(candidate.createdAt).toLocaleDateString('en-GB', options)}
				</span>
			</div>
		</>
	);
};

const ProfileNotCompleted = ({ data, filter }) => {
	const [candidates, setCandidates] = useState([]);
	useEffect(() => {
		const filtered = data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 0);

			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
				return false;
			}
			if (new Date(candidate.createdAt) < new Date(filter.from_date)) {
				return false;
			}
			if (new Date(candidate.createdAt) > new Date(to_date)) {
				return false;
			}
			return true;
		});
		setCandidates(filtered);
	}, [data, filter]);

	return (
		<>
			<div className='row header'>
				<span className='col-4'>Phone</span>
				<span className='col-4'>Email</span>
				<span className='col-4'>Registration Date</span>
			</div>
			<div className='details-wrapper'>
				{candidates.map((candidate) => {
					return <ProfileCard key={candidate} candidate={candidate} />;
				})}
			</div>
		</>
	);
};

const ProfileCard = ({ candidate }) => {
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};

	return (
		<>
			<div className='row details' style={{ cursor: 'default' }}>
				<span className='col-4'>{candidate.mobile}</span>
				<span className='col-4'>{candidate.email}</span>
				<span className='col-4'>
					{new Date(candidate.registration_date).toLocaleDateString('en-GB', options)}
				</span>
			</div>
		</>
	);
};

const NotVerified = ({ data, filter, setLoading, showAlert }) => {
	const [candidates, setCandidates] = useState([]);
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
			if (new Date(candidate.createdAt) < new Date(filter.from_date)) {
				return false;
			}
			if (new Date(candidate.createdAt) > new Date(to_date)) {
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
		{ label: 'D O B', key: 'DOB' },
		{ label: 'Registration Date', key: 'registration_date' },
		{ label: 'Aadhaar Number', key: 'aadhaar' },
		{ label: 'Father Name', key: 'fname' },
		{ label: 'Gender', key: 'fname' },
		{ label: 'District', key: 'district' },
		{ label: 'State', key: 'state' },
		{ label: 'Pincode', key: 'pincode' },
		{ label: 'Qualification', key: 'qualification' },
		{ label: 'College', key: 'college' },
		{ label: 'CGPA', key: 'cgpa' },
		{ label: 'Diploma', key: 'diploma' },
		{ label: 'Year of Passing', key: 'y_o_p' },
		{ label: 'Any Backlog ?', key: 'backlog' },
		{ label: 'Height', key: 'height' },
		{ label: 'Weight', key: 'weight' },
		{ label: 'Opportunity', key: 'opportunity' },
		{ label: 'Worked in which Plant ?', key: 'plant_worked' },
		{ label: 'PWD', key: 'pwd' },
		{ label: 'Work Experience', key: 'work_experience' },
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
				{candidates.map((candidate) => {
					return (
						<NotVerifiedCard
							key={candidate}
							candidate={candidate}
							setLoading={setLoading}
							showAlert={showAlert}
						/>
					);
				})}
			</div>
			<CSVLink data={candidates} headers={csv_header} filename={'not_verified-candidates.csv'}>
				<ExportButton />
			</CSVLink>
		</>
	);
};

const NotVerifiedCard = ({ candidate, setLoading, showAlert }) => {
	const [expanded, setExpanded] = useState(false);
	const [status, setStatus] = useState('Eligible');
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
	const STYLE = {
		backgroundColor: '#DBE3FF',
		borderRadius: '5px',
		padding: '0.25rem 1rem',
		color: '#000000',
		fontWeight: '500',
		width: '100%',
		cursor: 'pointer',
		textAlign: 'center',
		margin: '10px auto',
		border: 'none',
		outline: 'none',
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		setLoading(true);
		setExpanded(false);
		const data = await UpdateStudentStatus(candidate._id, status);
		if (data) {
			showAlert('Candidate Status Updated');
		} else {
			showAlert('Status Updation Failed');
		}
		setStatus('Updated');
		setLoading(false);
	};

	return (
		<>
			<div
				style={{ display: status === 'Updated' ? 'none' : 'flex' }}
				className='row details'
				onClick={(e) => {
					setExpanded(true);
				}}
			>
				<span className='col-3'>{candidate.name}</span>
				<span className='col-3'>{candidate.mobile}</span>
				<span className='col-3'>{candidate.email}</span>
				<span className='col-3'>
					{new Date(candidate.registration_date).toLocaleDateString('en-GB', options)}
				</span>
			</div>

			{expanded && (
				<>
					<div className='popup-wrapper'>
						<div className='extra-details'>
							<CloseIcon
								onClick={(e) => {
									setExpanded(false);
								}}
							/>
							<div className='row justify-content-between ' style={{ marginTop: '2.5rem' }}>
								<div className='col-7 candidate-details'>
									<div>
										Name : <span>{candidate.name}</span>
									</div>
									<div>
										Mobile No. : <span>{candidate.mobile}</span>
									</div>
									<div>
										Email : <span>{candidate.email}</span>
									</div>
									<div>
										Gender : <span>{candidate.gender}</span>
									</div>
									<div>
										DOB :<span>{new Date(candidate.DOB).toLocaleDateString('en-GB', options)}</span>
									</div>
									<div>
										Age (as on date) :<span>{calculateAge(candidate.DOB)}</span>
									</div>
									<div>
										Aadhaar no. : <span>{candidate.aadhaar}</span>
									</div>
									<div>
										Father's Name : <span>{candidate.fname}</span>
									</div>
									<div>
										District : <span>{candidate.district}</span>
									</div>
									<div>
										State : <span>{candidate.state}</span>
									</div>
									<div>
										Pincode : <span>{candidate.pincode}</span>
									</div>
									<div>
										Height : <span>{candidate.height}</span>
									</div>
									<div>
										Weight : <span>{candidate.weight}</span>
									</div>
									<div>
										Qualification : <span>{candidate.qualification}</span>
									</div>
									<div>
										College : <span>{candidate.college}</span>
									</div>
									<div>
										Year Of Passing : <span>{candidate.y_o_p}</span>
									</div>
									<div>
										CGPA : <span>{candidate.cgpa}</span>
									</div>
									<div>
										Diploma : <span>{candidate.diploma}</span>
									</div>
									<div>
										Backlog : <span>{candidate.backlog}</span>
									</div>
									<div>
										How you come to know about this opportunity? :{' '}
										<span>{candidate.opportunity}</span>
									</div>
									<div>
										Which Plant You Have Worked In Tata Motors-Pune :{' '}
										<span>{candidate.plant_worked}</span>
									</div>
									<div>
										Work Experience : <span>{candidate.work_experience}</span>
									</div>
								</div>
								<div className='col-5 images'>
									<img src={FetchImage(candidate.photo)} alt='' />
									<img src={FetchImage(candidate.aadhaar_photo)} alt='' />
									<form onSubmit={submitHandler}>
										<select
											style={STYLE}
											value={status}
											onChange={(e) => setStatus(e.target.value)}
											required={true}
										>
											<option>Eligible</option>
											<option>Over Qualified</option>
											<option>Under Qualified</option>
											<option>Over Age</option>
											<option>Under Age</option>
										</select>
										<button style={STYLE}>Save</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

const calculateAge = (date) => {
	let dob = new Date(date);
	let dobYear = dob.getYear();
	let dobMonth = dob.getMonth();
	let dobDate = dob.getDate();
	let now = new Date();
	let currentYear = now.getYear();
	let currentMonth = now.getMonth();
	let currentDate = now.getDate();
	let age = {
		years: 0,
		months: 0,
		days: 0,
	};
	let ageString = '';
	let monthAge = '';
	let dateAge = '';
	let yearAge = currentYear - dobYear;

	if (currentMonth >= dobMonth) monthAge = currentMonth - dobMonth;
	else {
		yearAge--;
		monthAge = 12 + currentMonth - dobMonth;
	}

	//get days
	if (currentDate >= dobDate)
		//get days when the current date is greater
		dateAge = currentDate - dobDate;
	else {
		monthAge--;
		dateAge = 31 + currentDate - dobDate;

		if (monthAge < 0) {
			monthAge = 11;
			yearAge--;
		}
	}
	//group the age in a single variable
	age = {
		years: yearAge,
		months: monthAge,
		days: dateAge,
	};
	if (age.years > 0 && age.months > 0 && age.days > 0)
		ageString = age.years + ' years, ' + age.months + ' months, and ' + age.days + ' days old.';
	else if (age.years === 0 && age.months === 0 && age.days > 0)
		ageString = 'Only ' + age.days + ' days old!';
	//when current month and date is same as birth date and month
	else if (age.years > 0 && age.months === 0 && age.days === 0)
		ageString = age.years + ' years old. Happy Birthday!!';
	else if (age.years > 0 && age.months > 0 && age.days === 0)
		ageString = age.years + ' years and ' + age.months + ' months old.';
	else if (age.years === 0 && age.months > 0 && age.days > 0)
		ageString = age.months + ' months and ' + age.days + ' days old.';
	else if (age.years > 0 && age.months === 0 && age.days > 0)
		ageString = age.years + ' years, and' + age.days + ' days old.';
	else if (age.years === 0 && age.months > 0 && age.days === 0)
		ageString = age.months + ' months old.';
	//when current date is same as dob(date of birth)
	else ageString = "Welcome to Earth! <br> It's first day on Earth!";
	return ageString;
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
export default Students;
