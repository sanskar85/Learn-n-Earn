import './Students.css';
import FILTER_OUTLINED from '../../assets/filter-outlined.svg';
import FILTER_FILLED from '../../assets/filter-filled.svg';
import { CloseIcon } from '../../assets/Images';
import { useState, useEffect } from 'react';
import {
	Admission_Details,
	Save_Admission_Details,
	DownloadOfferLetter,
} from '../../controllers/API';
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

const Admission = ({ setLoading, showAlert }) => {
	var today = currDate();
	const [filterOpen, setFilterOpen] = useState(false);
	const [offer_data, setDetails] = useState([]);
	const [offer_details, setOfferData] = useState([]);
	const [filter, _setFilter] = useState({
		applicant: '',
		mobile: '',
		state: '🌐 All States',
		from_date: '2021-01-01',
		to_date: today,
		status: 'All',
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

	useEffect(() => {
		const filtered = offer_data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 0);
			if (filter.mobile && !candidate.mobile.startsWith(filter.mobile)) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
				return false;
			}
			if (filter.applicant && candidate.applicant !== filter.applicant) {
				return false;
			}
			if (new Date(candidate.reporting_date) < new Date(filter.from_date)) {
				return false;
			}
			if (new Date(candidate.reporting_date) > new Date(to_date)) {
				return false;
			}
			if (filter.status !== 'All' && candidate.status !== filter.status) {
				return false;
			}
			return true;
		});
		setOfferData(filtered);
	}, [offer_data, filter]);

	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const data = await Admission_Details();
			if (data) {
				setDetails(data.offer_details);
				setLoading(false);
			} else {
				setLoading(false);
				showAlert('Unable to fetch data');
			}
		}
		fetchData();
	}, [setLoading, showAlert]);

	const csv_header = [
		{ label: 'Name', key: 'name' },
		{ label: 'Email ID', key: 'email' },
		{ label: 'Mobile Number', key: 'mobile' },
		{ label: 'D O B', key: 'DOB' },
		{ label: 'Reporting Date', key: 'reporting_date' },
		{ label: 'Aadhaar Number', key: 'aadhaar' },
		{ label: 'Father Name', key: 'fname' },
		{ label: 'Gender', key: 'fname' },
		{ label: 'District', key: 'district' },
		{ label: 'State', key: 'state' },
		{ label: 'Pincode', key: 'pincode' },
		{ label: 'Qualification', key: 'qualification' },
		{ label: 'College', key: 'college' },
		{ label: 'Percentage or CGPA', key: 'cgpa' },
		{ label: 'Diploma', key: 'diploma' },
		{ label: 'Year of Passing', key: 'y_o_p' },
		{ label: 'Any Backlog ?', key: 'backlog' },
		{ label: 'Height', key: 'height' },
		{ label: 'Weight', key: 'weight' },
		{ label: 'Opportunity', key: 'opportunity' },
		{ label: 'Worked in which Plant ?', key: 'plant_worked' },
		{ label: 'PWD', key: 'pwd' },
		{ label: 'Work Experience', key: 'work_experience' },
		{ label: 'Industry', key: 'industry' },
		{ label: 'Admission Status', key: 'status' },
	];

	return (
		<>
			<div className='student-wrapper'>
				<div className='row justify-content-between'>
					<h4>Admission Panel</h4>
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
								placeholder='🔍 Applicant ID'
								name='applicant'
								value={filter.applicant}
								onChange={setFilter}
							/>
						</div>
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
								name='status'
								value={filter.status}
								onChange={setFilter}
								required={true}
							>
								<option>All</option>
								<option>Offer Letter Issued</option>
								<option>Joined</option>
								<option>Not Responding</option>
							</select>
						</div>
						<span className='col-3'></span>
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

				<div className='row header'>
					<span className='col-2'>Team</span>
					<span className='col-2'>Name</span>
					<span className='col-2'>Phone</span>
					<span className='col-2'>Industry</span>
					<span className='col-2'>Status</span>
					<span className='col-2'>Reporting Date</span>
				</div>
				<div className='details-wrapper'>
					{offer_details.map((candidate) => {
						return (
							<AdmissionCard
								key={candidate.mobile}
								candidate={candidate}
								showAlert={showAlert}
								setLoading={setLoading}
							/>
						);
					})}
				</div>
				<CSVLink data={offer_details} headers={csv_header} filename={'admission-candidates.csv'}>
					<ExportButton />
				</CSVLink>
			</div>
		</>
	);
};

const AdmissionCard = ({ candidate, showAlert, setLoading }) => {
	const [popup, showPopup] = useState(false);
	const [details, setDetails] = useState({
		status: candidate.status,
		remark: '',
	});
	const STYLE_SELECT = {
		backgroundColor: 'hsl(0, 0%, 95%)',
		border: ' 1.5px solid #000',
		outline: ' none',
		borderRadius: ' 5px',
		padding: ' 3px 10px',
		width: ' 80%',
		height: ' 35px',
		letterSpacing: ' -0.5px',
		display: 'block',
		margin: '0 0 0.5rem',
	};
	const STYLE_TEXTAREA = {
		backgroundColor: 'hsl(0, 0%, 95%)',
		border: ' 1.5px solid #000',
		outline: ' none',
		borderRadius: ' 5px',
		padding: ' 3px 10px',
		width: ' 100%',
		height: ' 110px',
		letterSpacing: ' -0.5px',
		display: 'block',
		resize: 'none',
	};
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
	const changeHandler = (e) => {
		setDetails((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};
	const submitHandler = async (e) => {
		e.preventDefault();
		setLoading(true);
		const data = await Save_Admission_Details(candidate.offer_id, details);
		if (!data) {
			showAlert('Unable to save details. Please try again later.');
		}
		setLoading(false);
		showPopup(false);
	};
	return (
		<>
			<div
				className='row details'
				onClick={(e) => {
					showPopup(true);
				}}
			>
				<span className='col-2'>{candidate.team_name}</span>
				<span className='col-2'>{candidate.name}</span>
				<span className='col-2'>{candidate.mobile}</span>
				<span className='col-2'>{candidate.industry}</span>
				<span className='col-2'>{details.status}</span>
				<span
					className='col-2'
					onClick={(e) => {
						showPopup(true);
					}}
				>
					{new Date(candidate.reporting_date).toLocaleDateString('en-GB', options)}
				</span>
			</div>
			{popup && (
				<>
					<div className='popup-wrapper'>
						<div className='extra-details'>
							<CloseIcon
								onClick={(e) => {
									showPopup(false);
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
										Percentage or CGPA : <span>{candidate.cgpa}</span>
									</div>
									<div>
										Diploma : <span>{candidate.diploma}</span>
									</div>
									<div>
										Work Experience : <span>{candidate.work_experience}</span>
									</div>
								</div>
								<div className='col-5 images'>
									<button
										className='btn btn-outline-primary mb-3'
										onClick={(e) => {
											DownloadOfferLetter(candidate.candidate_id);
										}}
									>
										Download Offer-Letter
									</button>
									<form onSubmit={submitHandler} style={{ width: '90%' }} className='popup-from'>
										<select
											style={STYLE_SELECT}
											name='status'
											value={details.status}
											onChange={changeHandler}
											required={true}
										>
											<option>Issued</option>
											<option>Joined</option>
											<option>Not Responding</option>
										</select>
										<textarea
											style={STYLE_TEXTAREA}
											name='remark'
											value={details.remark}
											onChange={changeHandler}
											placeholder='Any Remark'
										/>
										<button className='submit-btn'>Save Response</button>
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
	var dateParts = date.split('/');
	let dob = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
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
	else ageString = '';
	return ageString;
};

function currDate() {
	var today = new Date(); //January is 0!
	var yyyy = today.getFullYear() + 2;

	today = yyyy + '-' + 12 + '-' + 31;
	return today;
}

export default Admission;
