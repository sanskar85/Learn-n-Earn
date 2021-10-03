import './Students.css';
import { CloseIcon } from '../../assets/Images';
import CALL_RESPONSE_POPUP from '../../assets/call-resonse-popup.svg';
import { useState, useEffect } from 'react';
import { UpdateTarget, FetchTarget } from '../../controllers/API';

const response = [
	'',
	'Not Interested',
	'Interested',
	'Convinced',
	'To Join',
	'Already Joined',
	'Good Financial Back ground',
	'Home Sickness',
	'Need Call Back',
	'Other Language Candidate',
	'Overage',
	'Over Qualified',
	'Over Weight',
	'Rude Attitude',
	'Ringing / Switch Off / Not Reachable',
	'Underage',
	'Under Qualified',
	'Under Weight',
	'Waiting for Result',
	'Working',
	'Wrong / Invalid Number',
];

const CallForm = ({ showAlert, setLoading }) => {
	const [callTarget, setCallTarget] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const data = await FetchTarget();
			if (data && data.success) {
				setCallTarget(data.target);
			} else {
				showAlert('Unable to fetch target data.');
			}
		}
		fetchData();
	}, [showAlert]);

	return (
		<>
			<div className='student-wrapper'>
				<h4>Due Call Response</h4>
				<div className='row header'>
					<span className='col-3'>Name</span>
					<span className='col-2'>Father Name</span>
					<span className='col-2'>Mobile No.1</span>
					<span className='col-2'>Mobile No.2</span>
					<span className='col-3'>Email</span>
				</div>
				<div className='details-wrapper'>
					{callTarget.map((details) => {
						return (
							<Card
								key={details._id}
								details={details}
								showAlert={showAlert}
								setLoading={setLoading}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
};

const Card = ({ details, showAlert, setLoading }) => {
	const [popup, showPopup] = useState(false);
	const [visible, setVisibility] = useState(true);
	const [credentials, setcredentials] = useState(details);
	const STYLES_LABEL = {
		width: '30%',
		marginTop: '0.5rem',
	};
	const STYLES = {
		width: '60%',
		background: '#DBE3FF',
		outline: 'none',
		border: 'none',
		padding: '0.25rem 1rem',
		borderRadius: '8px',
	};

	const updateCred = (e) => {
		if (
			e.target.value &&
			(e.target.name === 'mobile1' || e.target.name === 'mobile2') &&
			!/[^a-zA-Z]/.test(e.target.value)
		) {
			return;
		}
		setcredentials((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		setLoading(true);
		const data = await UpdateTarget(details._id, credentials);
		if (data) {
			setVisibility(false);
			showPopup(false);
			showAlert('Response Saved');
		} else {
			showAlert('Reponse Not Saved. Please try again later.');
		}
		setLoading(false);
	};
	return (
		<>
			<div
				className='row details'
				style={{ display: visible ? 'flex' : 'none' }}
				onClick={(e) => showPopup(true)}
			>
				<span className='col-3'>{details.name}</span>
				<span className='col-2'>{details.fname}</span>
				<span className='col-2'>{details.mobile1}</span>
				<span className='col-2'>{details.mobile2}</span>
				<span className='col-3'>{details.email}</span>
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
							<h5>Response Form</h5>
							<div className='row justify-content-between ' style={{ marginTop: '2.5rem' }}>
								<div
									className='col-8 candidate-details'
									style={{ border: 'none', paddingBottom: '1rem' }}
								>
									<form className='popup-from' onSubmit={submitHandler}>
										<div>
											<label for='name' style={STYLES_LABEL}>
												Name
											</label>
											<input
												type='text'
												style={STYLES}
												id='name'
												name='name'
												value={credentials.name}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='fname' style={STYLES_LABEL}>
												Father's Name
											</label>
											<input
												type='text'
												style={STYLES}
												id='fname'
												name='fname'
												value={credentials.fname}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='mobile1' style={STYLES_LABEL}>
												Mobile No.1
											</label>
											<input
												type='text'
												style={STYLES}
												id='mobile1'
												name='mobile1'
												value={credentials.mobile1}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='mobile2' style={STYLES_LABEL}>
												Mobile No.2
											</label>
											<input
												type='text'
												style={STYLES}
												id='mobile2'
												name='mobile2'
												value={credentials.mobile2}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='email' style={STYLES_LABEL}>
												Email
											</label>
											<input
												type='text'
												style={STYLES}
												id='email'
												name='email'
												value={credentials.email}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='qualification' style={STYLES_LABEL}>
												Qualification
											</label>
											<input
												type='text'
												style={STYLES}
												id='qualification'
												name='qualification'
												value={credentials.qualification}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='call_type' style={STYLES_LABEL}>
												Call Type
											</label>
											<select
												name='call_type'
												style={STYLES}
												value={credentials.call_type}
												onChange={updateCred}
											>
												<option>First Time</option>
												<option>Follow up</option>
												<option>Call Recieved</option>
												<option>Interview Follow up</option>
											</select>
										</div>
										<div>
											<label for='state' style={STYLES_LABEL}>
												State
											</label>
											<input
												type='text'
												style={STYLES}
												id='state'
												name='state'
												value={credentials.state}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='district' style={STYLES_LABEL}>
												District
											</label>
											<input
												type='text'
												style={STYLES}
												id='district'
												name='district'
												value={credentials.district}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='pincode' style={STYLES_LABEL}>
												Pincode
											</label>
											<input
												type='text'
												style={STYLES}
												id='pincode'
												name='pincode'
												value={credentials.pincode}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='source' style={STYLES_LABEL}>
												Source
											</label>
											<input
												type='text'
												style={STYLES}
												id='source'
												name='source'
												value={credentials.source}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='gender' style={STYLES_LABEL}>
												Gender
											</label>
											<input
												type='text'
												style={STYLES}
												id='gender'
												name='gender'
												value={credentials.gender}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='dob' style={STYLES_LABEL}>
												DOB
											</label>
											<input
												type='text'
												style={STYLES}
												id='dob'
												name='dob'
												value={credentials.dob}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='y_o_p' style={STYLES_LABEL}>
												Year of Passing
											</label>
											<input
												type='text'
												style={STYLES}
												id='y_o_p'
												name='y_o_p'
												value={credentials.y_o_p}
												onChange={updateCred}
											/>
										</div>
										<div>
											<label for='response' style={STYLES_LABEL}>
												Response
											</label>
											<select
												name='response'
												style={STYLES}
												value={credentials.response}
												onChange={updateCred}
											>
												{response.map((opt, index) => {
													return <option key={index}>{opt}</option>;
												})}
											</select>
										</div>

										<button className='submit-btn'>Save Response</button>
									</form>
								</div>
								<div className='col-4'>
									<img src={CALL_RESPONSE_POPUP} alt='' style={{ width: '100%' }} />
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default CallForm;
