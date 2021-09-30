import './Students.css';
import FILTER_OUTLINED from '../../assets/filter-outlined.svg';
import FILTER_FILLED from '../../assets/filter-filled.svg';
import { CloseIcon } from '../../assets/Images';
import { useState, useEffect } from 'react';
import {
	Students as MyStudents,
	Teams as MyTeams,
	FetchImage,
	UpdateCandidatesTeam,
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

const Students = ({ setLoading, showAlert }) => {
	var today = currDate();
	const [filterOpen, setFilterOpen] = useState(false);
	const [students, setStudents] = useState([]);
	const [selected, updateSelected] = useState([]);
	const [teams, setTeams] = useState([]);
	const [selectedTeam, setSelectedTeam] = useState('');
	const [isAssignmentDialogVisble, showAssignmentDialog] = useState(false);
	const [filter, _setFilter] = useState({
		mobile: '',
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
			window.location.reload();
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
				setStudents(studentsRes.students);
				setTeams(['', ...teamsRes.teams]);
				setLoading(false);
			} else {
				setLoading(false);
				showAlert('Unable to fetch Data');
			}
		}
		fetchData();
	}, [setLoading, showAlert]);
	return (
		<>
			<div className='student-wrapper'>
				{/* Reassign Team to candidates */}
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
					<h4>Student Management</h4>
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
					</div>
				)}

				<StudentsTable
					data={students}
					filter={filter}
					updateSelected={updateSelected}
					selected={selected}
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

const StudentsTable = ({ data, filter, selected, updateSelected }) => {
	const [registered, setRegistered] = useState([]);
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
		setRegistered(filtered);
	}, [data, filter]);

	return (
		<>
			<div className='row header'>
				<span className='col-3'>Name</span>
				<span className='col-3'>Phone</span>
				<span className='col-3'>Team</span>
				<span className='col-2'>Registration Date</span>
				<span
					className='col-1'
					style={{ cursor: 'pointer' }}
					onClick={(e) => {
						const ids = registered.map((e) => e._id);
						updateSelected(ids);
					}}
				>
					Select All
				</span>
			</div>
			<div className='details-wrapper'>
				{registered.map((candidate) => {
					return (
						<StudentCard
							key={candidate}
							candidate={candidate}
							selected={selected}
							updateSelected={updateSelected}
						/>
					);
				})}
			</div>
		</>
	);
};

const StudentCard = ({ candidate, selected, updateSelected }) => {
	const [expanded, setExpanded] = useState(false);
	var options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
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
				<span className='col-3' onClick={setExpanded}>
					{candidate.name}
				</span>
				<span className='col-3' onClick={setExpanded}>
					{candidate.mobile}
				</span>
				<span className='col-3' onClick={setExpanded}>
					{candidate.team ? candidate.team.name : ''}
				</span>
				<span className='col-2' onClick={setExpanded}>
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
										DOB :{' '}
										<span>{new Date(candidate.DOB).toLocaleDateString('en-GB', options)}</span>
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
