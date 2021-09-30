import './Students.css';
import { useState, useEffect } from 'react';
import { Teams as MyTeams, UpdateTeamStatus, RegisterTeam } from '../../controllers/API';
import { CloseIcon } from '../../assets/Images';
import POPUP_IMAGE from '../../assets/ream_registration.svg';
const Teams = ({ setLoading, showAlert }) => {
	const [teams, setTeams] = useState([]);
	const [registrationFormVisible, showRegistration] = useState(false);
	const [details, setDetails] = useState({
		name: '',
		mobile: '',
		email: '',
		password: '',
	});

	const STYLES_LABEL = {
		width: '20%',
	};
	const STYLES = {
		width: '70%',
		background: '#DBE3FF',
		outline: 'none',
		border: 'none',
	};

	const registerChangeHandler = (e) => {
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
		const data = await RegisterTeam(details);
		if (data && data.success) {
			showAlert('Manager Registered');
		} else {
			showAlert('Manager Not Registered. Please try again later');
		}
		setLoading(false);
		setDetails({
			name: '',
			mobile: '',
			email: '',
			password: '',
		});
		showRegistration(false);
	};
	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const data = await MyTeams();
			if (data && data.success) {
				setTeams(data.teams);
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
					<h4>Teams Management</h4>
				</div>

				<div className='row header'>
					<span className='col-2'>Name</span>
					<span className='col-3'>Phone</span>
					<span className='col-3'>Email</span>
					<span className='col-2'>No of Students</span>
					<span className='col-2'>Admission Allowded</span>
				</div>
				<div className='details-wrapper'>
					{teams.map((candidate) => {
						return (
							<TeamsCard
								key={candidate._id}
								candidate={candidate}
								setLoading={setLoading}
								showAlert={showAlert}
							/>
						);
					})}
				</div>
				<div
					style={{ display: 'flex', alignItems: 'center' }}
					onClick={(e) => {
						showRegistration(true);
					}}
				>
					<button
						style={{
							background: '#88E78C',
							color: '#FFF',
							fontWeight: '500',
							padding: '0.5rem 1.5rem',
							borderRadius: '10px',
							border: 'none',
							outline: 'none',
							margin: '2rem auto 0',
						}}
					>
						Add a Team Member
					</button>
				</div>
				{registrationFormVisible && (
					<div className='popup-wrapper'>
						<div className='popup'>
							<CloseIcon
								onClick={(e) => {
									showRegistration(false);
								}}
							/>
							<div>
								<span className='popup-details'>Add Team Member</span>
							</div>
							<div className='row' style={{ marginTop: '2rem' }}>
								<div className='col-8'>
									<form className='popup-from' onSubmit={submitHandler}>
										<label for='name' style={STYLES_LABEL}>
											Name
										</label>
										<input
											type='text'
											style={STYLES}
											id='name'
											name='name'
											value={details.name}
											onChange={registerChangeHandler}
										/>
										<label for='mobile' style={STYLES_LABEL}>
											Mobile
										</label>
										<input
											type='text'
											style={STYLES}
											id='mobile'
											name='mobile'
											value={details.mobile}
											onChange={registerChangeHandler}
										/>
										<label for='email' style={STYLES_LABEL}>
											Email
										</label>
										<input
											type='text'
											style={STYLES}
											id='email'
											name='email'
											value={details.email}
											onChange={registerChangeHandler}
										/>
										<label for='password' style={STYLES_LABEL}>
											Password
										</label>
										<input
											type='password'
											style={STYLES}
											id='password'
											name='password'
											value={details.password}
											onChange={registerChangeHandler}
										/>
										<button className='submit-btn'>Register Team Member</button>
									</form>
								</div>
								<img src={POPUP_IMAGE} className='col-4' alt='' />
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

const TeamsCard = ({ candidate, setLoading, showAlert }) => {
	const [admission_allowded, setAppointed] = useState(candidate.admission_allowded ? 'Yes' : 'No');

	const STYLE = {
		backgroundColor: '#DBE3FF',
		borderRadius: '5px',
		padding: '0.125rem 1rem',
		color: '#000000',
		fontWeight: '500',
		width: '97%',
		cursor: 'pointer',
		textAlign: 'center',
		margin: '0 auto',
		border: 'none',
		outline: 'none',
	};

	const changeHandler = async (e) => {
		setAppointed(e.target.value);
		setLoading(true);
		await UpdateTeamStatus(candidate._id, e.target.value === 'Yes');
		setLoading(false);
	};

	return (
		<>
			<div className='row details'>
				<span className='col-2'>{candidate.name}</span>
				<span className='col-3'>{candidate.mobile}</span>
				<span className='col-3'>{candidate.email}</span>
				<span className='col-2'>{candidate.student_count}</span>
				<span className='col-2'>
					<select
						style={STYLE}
						name='admission_allowded'
						value={admission_allowded}
						onChange={changeHandler}
						required={true}
					>
						<option>Yes</option>
						<option>No</option>
					</select>
				</span>
			</div>
		</>
	);
};

export default Teams;
