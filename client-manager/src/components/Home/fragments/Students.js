import './Students.css';
import FILTER_OUTLINED from '../../assets/filter-outlined.svg';
import FILTER_FILLED from '../../assets/filter-filled.svg';
import { CloseIcon } from '../../assets/Images';
import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import ExportButton from './ExportButton';
import {
	Students as MyStudents,
	Teams as MyTeams,
	UpdateCandidatesTeam,
	SaveCandidateDetails,
} from '../../controllers/API';

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
const qualifications = [
	'',
	'10th Pass',
	'12th Pass(Arts)',
	'12th Pass(Science)',
	'12th Pass(Commerce)',
	'Pursuing 12th',
	'Graduation-Arts-Persuing',
	'Graduation-Arts-Completed',
	'Graduation-Commerce-Persuing',
	'Graduation-Commerce-Completed',
	'Graduation-Science-Pursuing',
	'Graduation-Science-Completed',
	'Any Other Graduation(Which od not in above)',
	'ITI-Fitter/Tuner/Machinist Completed',
	'Pursuing ITI-Fitter/Tuner/Machinist',
	'ITI -Electronic Mechanic Completed',
	'Pursuing ITI -Electronic Mechanic',
	'ITI-Electrician Completed',
	'Pursuing ITI-Electrician',
	'ITI-Automotive Manufacturing',
	'ITI-Certificate Cource in Machinist Teels Room',
	'ITI-Diesel Mechanic',
	'ITI-Draftsmen(Mechanic)',
	'ITI-General Mechanic',
	'ITI-Infirmation & Communication Techonology System Maintenance',
	'ITI-Instument Mechanic',
	'ITI-Maintenence Mechanic(Chamical Plant)',
	'ITI-Marine Fitter',
	'ITI-Mechanic Machine Tools maintenence',
	'ITI-Mechanic Motor Vehical',
	'ITI-Mechanic Radio & Television',
	'ITI-Mechanic (Refrigeration & Air Conditioning',
	'ITI-Painter General',
	'ITI-Techinician Mechatronics',
	'ITI-Medical Electronics',
	'ITI-Tool & Die Maker (Press Tools, Jigs & Fixtures)',
	'Any Other ITI(Which is not on above)',
	'Pursuing ITI - Any Other Trade',
	'Diploma in Mechatronics',
	'Diploma in Tools & Die Making',
	'Diploma in Mechanical completed',
	'Any Other Diploma Pursuing(Which is not in above)',
	'Any Other Diploma Completed (Which is not in above) ',
	'B.E./B.Tech - Pursuing',
	'B.E./B.Tech - Completed',
];
const plant_worked = [
	'Passenger Vehicle',
	'Commercial Vehicle',
	'Not Worked in Tata Motor',
	'Worked Some Other Tata Motors Plant',
];
const CandidateStatus = [
	'Documents Not Verified',
	'Eligible for Exam',
	'Not Eligible for Exam',
	'Failed in Exam',
	'Not Responding for Exam',
	'Eligible for Interview',
	'Not Responding for Interview',
	'Eligible for Offer Letter',
	'Rejected in Interview',
	'Admitted to an Company',
	'Not Responding for Admission',
];
const options = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
};

const Students = ({ setLoading, showAlert }) => {
	var today = currDate();
	const [RELOAD, setReload] = useState(0);
	const reload = () => {
		setReload(Date.now());
	};

	const [filterOpen, setFilterOpen] = useState(false);
	const [students, setStudents] = useState([]);
	const [selected, updateSelected] = useState([]);
	const [teams, setTeams] = useState([]);
	const [selectedTeam, setSelectedTeam] = useState('');
	const [isAssignmentDialogVisble, showAssignmentDialog] = useState(false);
	const [filter, _setFilter] = useState({
		mobile: '',
		team: '',
		state: '🌐 All States',
		from_date: '2021-01-01',
		to_date: today,
		exam_status: 'Exam Status',
		interview_status: 'Interview Status',
		offer_letter_status: 'Offer Letter',
	});

	const SUBMIT_STYLE = {
		marginTop: '2rem',
		color: '#FFF',
		float: 'right',
		padding: '0.5rem 2rem',
		borderRadius: '7px',
		border: 'none',
		outline: 'none',
		fontWeight: '500',
	};
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

	const assignHandler = async (e) => {
		e.preventDefault();
		showAssignmentDialog(false);
		setLoading(true);
		const data = await UpdateCandidatesTeam(selectedTeam, selected);
		if (data) {
			reload();
		} else {
			setLoading(false);
			showAlert('Unable to assign team.');
		}
	};
	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const studentsRes = await MyStudents();
			const teamsRes = await MyTeams();
			if (studentsRes && teamsRes && studentsRes.success && teamsRes.success) {
				setStudents([]);
				setStudents(studentsRes.students);
				setTeams(['', ...teamsRes.teams]);
				setLoading(false);
			} else {
				setLoading(false);
				showAlert('Unable to fetch Data');
			}
		}
		fetchData();
	}, [setLoading, showAlert, RELOAD]);
	return (
		<>
			<div className='student-wrapper'>
				{isAssignmentDialogVisble && (
					<div className='popup-wrapper'>
						<div className='popup-wrapper'>
							<div className='popup'>
								<CloseIcon
									onClick={(e) => {
										showAssignmentDialog(false);
									}}
								/>
								<div>
									<span className='popup-details'>Assign a Team Member</span>
								</div>
								<div className='row' style={{ marginTop: '2rem' }}>
									<form className='popup-from' onSubmit={assignHandler} style={{ width: '100%' }}>
										<select
											style={{
												width: '60%',
												background: '#DBE3FF',
												outline: 'none',
												border: 'none',
												padding: '0.25rem 1rem',
												margin: '0 0 1rem',
												borderRadius: '8px',
											}}
											name='type'
											onChange={(e) => {
												const selectedIndex = e.target.options.selectedIndex;
												const id = e.target.options[selectedIndex].getAttribute('data-key');
												setSelectedTeam(id);
											}}
										>
											{teams.map(({ _id, name }) => {
												return (
													<option key={_id} data-key={_id}>
														{name}
													</option>
												);
											})}
										</select>

										<button className='submit-btn'>Save</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				)}
				<div className='row justify-content-between'>
					<h4>Candidates Management</h4>
					<img
						src={filterOpen ? FILTER_FILLED : FILTER_OUTLINED}
						onClick={(e) => {
							setFilterOpen((prev) => !prev);
						}}
						alt=''
					/>
				</div>

				{/* Filter data Panel */}
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
							<select name='exam_status' value={filter.exam_status} onChange={setFilter}>
								<option>Exam Status</option>
								<option>Pass</option>
								<option>Fail</option>
								<option>Started</option>
							</select>
						</div>
						<div className='col-3'>
							<select name='interview_status' value={filter.interview_status} onChange={setFilter}>
								<option>Interview Status</option>
								<option>Not Scheduled</option>
								<option>Scheduled</option>
								<option>Pass</option>
								<option>Fail</option>
							</select>
						</div>
						<div className='col-3'>
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
						<div className='col-3'>
							<input
								type='text'
								placeholder='🔍 Search Team'
								name='team'
								value={filter.team}
								onChange={setFilter}
							/>
						</div>
					</div>
				)}

				<StudentsTable
					data={students}
					filter={filter}
					updateSelected={updateSelected}
					selected={selected}
					setLoading={setLoading}
					showAlert={showAlert}
				/>

				<button
					style={SUBMIT_STYLE}
					className='btn btn-primary '
					onClick={(e) => {
						e.preventDefault();
						if (selected.length > 0) showAssignmentDialog(true);
						else showAlert('No Candidate Selected ');
					}}
				>
					Assign To Other Team
				</button>
			</div>
		</>
	);
};

const StudentsTable = ({ data, filter, selected, updateSelected, setLoading, showAlert }) => {
	const [candidates, setCandidates] = useState([]);
	useEffect(() => {
		const filtered = data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 0);

			if (filter.mobile && !candidate.mobile.startsWith(filter.mobile)) {
				return false;
			}
			if (
				filter.team &&
				candidate.team &&
				!candidate.team.name.toLowerCase().startsWith(filter.team.toLowerCase())
			) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
				return false;
			}
			if (
				filter.exam_status !== 'Exam Status' &&
				!candidate.examination.includes(filter.exam_status)
			) {
				return false;
			}
			if (
				filter.interview_status !== 'Interview Status' &&
				candidate.interview !== filter.interview_status
			) {
				return false;
			}
			if (
				filter.offer_letter_status !== 'Offer Letter' &&
				candidate.offer_letter !== filter.offer_letter_status
			) {
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
		{ label: 'Team', key: 'team.name' },
		{ label: 'Name', key: 'name' },
		{ label: 'Email ID', key: 'email' },
		{ label: 'Mobile Number', key: 'mobile' },
		{ label: 'D O B', key: 'DOB' },
		{ label: 'Registration Date', key: 'registration_date' },
		{ label: 'Aadhaar Number', key: 'aadhaar' },
		{ label: 'Father Name', key: 'fname' },
		{ label: 'Gender', key: 'gender' },
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
		{ label: 'Examination', key: 'examination' },
		{ label: 'Interview', key: 'interview' },
		{ label: 'Offer Letter', key: 'offer_letter' },
	];

	return (
		<>
			<div className='row header'>
				<span className='col-3'>Name</span>
				<span className='col-2'>Phone</span>
				<span className='col-2'>State</span>
				<span className='col-2'>Team</span>
				<span className='col-2'>Registration Date</span>
				<span
					className='col-1'
					style={{ cursor: 'pointer' }}
					onClick={(e) => {
						const ids = candidates.map((e) => e._id);
						updateSelected(ids);
					}}
				>
					Select All
				</span>
			</div>
			<div className='details-wrapper'>
				{candidates.map((candidate) => {
					return (
						<StudentCard
							key={candidate._id}
							details={candidate}
							selected={selected}
							updateSelected={updateSelected}
							setLoading={setLoading}
							showAlert={showAlert}
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

const StudentCard = ({ details, selected, updateSelected, setLoading, showAlert }) => {
	const [candidate, setCandidate] = useState(details);
	const [expandedType, setExpandedType] = useState(false);
	const changeHandler = (e) => {
		const checked = e.target.checked;
		if (checked) {
			updateSelected((prev) => {
				if (prev.includes(candidate._id)) {
					return prev;
				}
				return [...prev, candidate._id];
			});
		} else {
			updateSelected((prev) => {
				return prev.filter((element) => element !== candidate._id);
			});
		}
	};
	return (
		<>
			<div className='row details'>
				<span className='col-3' onClick={(e) => setExpandedType('details')}>
					{candidate.name}
				</span>
				<span className='col-2' onClick={(e) => setExpandedType('details')}>
					{candidate.mobile}
				</span>
				<span className='col-2' onClick={(e) => setExpandedType('details')}>
					{candidate.state}
				</span>
				<span className='col-2' onClick={(e) => setExpandedType('details')}>
					{candidate.team ? candidate.team.name : ''}
				</span>
				<span className='col-2' onClick={(e) => setExpandedType('details')}>
					{new Date(candidate.registration_date).toLocaleDateString('en-GB', options)}
				</span>
				<span className='col-1'>
					<input
						type='checkbox'
						checked={selected.includes(candidate._id)}
						onChange={changeHandler}
					/>
				</span>
			</div>

			{expandedType === 'details' && (
				<Details candidate={candidate} setExpandedType={setExpandedType} />
			)}
			{expandedType === 'edit' && (
				<EditDetails
					candidate={candidate}
					setExpandedType={setExpandedType}
					setLoading={setLoading}
					showAlert={showAlert}
					setCandidate={setCandidate}
				/>
			)}
		</>
	);
};

const Details = ({ candidate, setExpandedType }) => {
	const processExam = () => {
		if (candidate.examination) {
			if (candidate.examination.includes('Pass')) return 'Pass';
			if (candidate.examination.includes('Fail')) return 'Fail';
			return 'Pending';
		}
		return 'NA';
	};

	const processInterview = () => {
		const exam = processExam(candidate);
		if (exam === 'Pass') {
			return candidate.interview;
		} else if (exam === 'Fail') {
			return 'Fail';
		} else {
			return 'NA';
		}
	};

	const processOfferLetter = () => {
		const interview = processInterview(candidate);
		if (interview === 'Pass') {
			if (candidate.offer_letter) return candidate.offer_letter;
			else return 'Pending';
		} else if (interview === 'Fail') {
			return 'NA';
		} else {
			return 'NA';
		}
	};
	return (
		<>
			<div className='popup-wrapper'>
				<div className='extra-details'>
					<CloseIcon
						onClick={(e) => {
							setExpandedType(null);
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
								Backlog : <span>{candidate.backlog}</span>
							</div>
							<div>
								How you come to know about this opportunity? : <span>{candidate.opportunity}</span>
							</div>
							<div>
								Which Plant You Have Worked In Tata Motors-Pune :{' '}
								<span>{candidate.plant_worked}</span>
							</div>
							<div>
								Work Experience : <span>{candidate.work_experience}</span>
							</div>
							<div>
								Exam : <span>{processExam()}</span>
							</div>
							<div>
								Interview : <span>{processInterview()}</span>
							</div>
							<div>
								Offer Letter : <span>{processOfferLetter()}</span>
							</div>
						</div>
						<div className='col-5 images'>
							<button
								className='btn btn-outline-primary'
								style={{ width: '100%' }}
								onClick={(e) => {
									setExpandedType('edit');
								}}
							>
								EDIT
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const EditDetails = ({ candidate, setCandidate, setExpandedType, setLoading, showAlert }) => {
	const [details, setDetails] = useState({
		name: '',
		fname: '',
		gender: '',
		aadhaar: '',
		qualification: '',
		diploma: '',
		y_o_p: '',
		cgpa: '',
		backlog: '',
		college: '',
		height: '',
		weight: '',
		plant_worked: '',
		pwd: '',
		work_experience: '',
		status: '',
		exam_attempt_remaining: '',
	});
	useEffect(() => {
		setDetails((prev) => {
			return {
				...prev,
				...candidate,
			};
		});
	}, [candidate]);

	const SCROLLINGDIV = {
		border: 'none',
		overflowY: 'scroll',
		overflowX: 'hidden',
		height: '75vh',
		margin: '0.125rem 0 0',
		padding: '0.5rem 0.5rem 0',
		borderRadius: '7px',
		borderBottom: 'none',
	};
	const ROW = {
		display: 'flex',
		alignItems: 'center',
		alignContent: 'space-between',
		marginTop: '0.5rem',
	};
	const LABEL = {
		width: '20%',
		fontWeight: '500',
	};
	const INPUT = {
		width: '75%',
		background: '#DBE3FF',
		borderRadius: '7px',
		border: 'none',
		outline: 'none',
		padding: '0.25rem 0.5rem',
	};
	const BUTTON_STYLE = {
		width: '30%',
		background: '#5CA1F1',
		color: '#FFFFFF',
		fontWeight: '500',
		borderRadius: '7px',
		border: 'none',
		outline: 'none',
		padding: '0.25rem 0.5rem',
	};

	const onChangeListener = (e) => {
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
		const data = await SaveCandidateDetails(details);
		if (data && data.success) {
			setCandidate((prev) => {
				return { ...prev, ...details };
			});
			setExpandedType(null);
		} else {
			showAlert('Unable to save candidate details.');
		}
		setLoading(false);
	};
	return (
		<div className='popup-wrapper'>
			<form className='extra-details' style={{ padding: '1rem 2rem' }} onSubmit={submitHandler}>
				<span style={{ fontWeight: '600', fontSize: '1.2rem', marginLeft: '40%' }}>
					Candidate Details
				</span>
				<CloseIcon onClick={(e) => setExpandedType(null)} />
				<div style={SCROLLINGDIV}>
					<div style={ROW}>
						<span style={LABEL}>Candidate Name</span>
						<input
							type='text'
							style={INPUT}
							name='name'
							value={details.name}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Father's Name</span>
						<input
							type='text'
							style={INPUT}
							name='fname'
							value={details.fname}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Gender</span>
						<select
							style={{ ...INPUT, width: '30%' }}
							name='gender'
							value={details.gender}
							onChange={onChangeListener}
						>
							<option>Male</option>
							<option>Female</option>
							<option>Others</option>
						</select>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Aadhaar Number</span>
						<input
							type='Number'
							style={INPUT}
							name='aadhaar'
							value={details.aadhaar}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Qualification</span>
						<select
							style={INPUT}
							name='qualification'
							value={details.qualification}
							onChange={onChangeListener}
						>
							{qualifications.map((q, index) => (
								<option key={index}>{q}</option>
							))}
						</select>
					</div>
					<div style={ROW}>
						<span style={LABEL}>College</span>
						<input
							type='text'
							style={INPUT}
							name='college'
							value={details.college}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Percentage or CGPA</span>
						<input
							type='number'
							style={{ ...INPUT, width: '30%' }}
							name='cgpa'
							value={details.cgpa}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Year of Passing</span>
						<input
							type='number'
							style={{ ...INPUT, width: '30%' }}
							name='y_o_p'
							value={details.y_o_p}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Diploma</span>
						<input
							type='text'
							style={{ ...INPUT, width: '30%' }}
							name='diploma'
							value={details.diploma}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Backlog</span>
						<input
							type='text'
							style={{ ...INPUT, width: '30%' }}
							name='backlog'
							value={details.backlog}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Plant Worked</span>
						<select
							type='text'
							style={INPUT}
							name='plant_worked'
							value={details.plant_worked}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						>
							{plant_worked.map((plant, index) => (
								<option key={index}>{plant}</option>
							))}
						</select>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Work Experience</span>
						<input
							type='text'
							style={INPUT}
							name='work_experience'
							value={details.work_experience}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>PWD</span>
						<input
							type='text'
							style={INPUT}
							name='pwd'
							value={details.pwd}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Remaining Exam Attempts</span>
						<input
							type='Number'
							style={{ ...INPUT, width: '10%' }}
							name='exam_attempt_remaining'
							value={details.exam_attempt_remaining}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Candidate Status</span>
						<select
							type='text'
							style={{ ...INPUT, width: '30%' }}
							name='status'
							value={details.status}
							onChange={onChangeListener}
						>
							{CandidateStatus.map((status, index) => (
								<option key={index}>{status}</option>
							))}
						</select>
					</div>

					<div style={{ ...ROW, justifyContent: 'center', margin: '2rem 0' }}>
						<button style={BUTTON_STYLE}>Save Candidate Details</button>
					</div>
				</div>
			</form>
		</div>
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
export default Students;
