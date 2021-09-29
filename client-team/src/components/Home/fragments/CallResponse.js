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

const states = [
	'',
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

const Qualification = [
	'',
	'ITI - General Mechanic',
	'ITI - Marine Fitter',
	'Pursuing ITI-Fitter/Turner/Machinist',
	'Pursuing Graduation',
	'ITI - Mechanic Machine Tools maintenance',
	'10th Pass',
	'ITI - Mechanic (Refrigeration & Air Conditioning)',
	'ITI - Technician Medical electronics',
	'12th Pass ( Arts )',
	'Pursuing Diploma in Mechanical Completed',
	'Diploma in Mechatronics',
	'Graduation Completed',
	'Any Other ITI ( Which is not in above)',
	'Diploma in Tool & Die Making',
	'Pursuing ITI - Electronic Mechanic',
	'ITI - Automotive Manufacturing',
	'ITI - Mechanic Motor Vehicle',
	'ITI-Fitter/Turner/Machinist Completed',
	'ITI - Instrument Mechanic',
	'ITI - Information & Communication Technology System Maintenance',
	'ITI - Mechanic Radio & Television',
	'ITI - Wiremen',
	'12th Pass ( Science )',
	'B.E./B.Tech',
	'ITI - Draftsmen (Mechanical)',
	'ITI - Tool & Die Maker (Press Tools, Jigs & Fixtures)',
	'ITI - Painter General',
	'12th Pass ( Commerce )',
	'Diploma in Electronics',
	'Pursuing ITI - Any Other Trade',
	'ITI - Any Other Trade Completed',
	'ITI - Maintenance Mechanic (Chemical Plant)',
	'Any Other Diploma ( Which is not in above)',
	'Pursuing 12th',
	'ITI - Electronic Mechanic Completed',
	'Diploma in Electrical',
	'ITI - Certificate Course in Machinist Tools Room',
	'ITI - Electrician Completed',
	'Pursuing ITI - Electrician',
	'Diploma in Mechanical Completed',
	'ITI - Technician Mechatronics',
	'ITI - Diesel Mechanic',
];

const source = [
	'',
	'E-mail/ SMS / Missed Call',
	'Facebook',
	'Friend & Relative',
	'Job Fair Data',
	'National Career Services',
	'Newspaper Ad',
	'NTTF Staff',
	'NTTF Website',
	'Partner Industry',
	'YouTube',
	'Walk In',
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
							<Card key={details} details={details} showAlert={showAlert} setLoading={setLoading} />
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
								<div className='col-8 '>
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
											<select
												name='qualification'
												style={STYLES}
												value={credentials.qualification}
												onChange={updateCred}
											>
												{Qualification.map((opt, index) => {
													return <option key={index}>{opt}</option>;
												})}
											</select>
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
											<select
												name='state'
												style={STYLES}
												value={credentials.state}
												onChange={updateCred}
											>
												{states.map((opt, index) => {
													return <option key={index}>{opt}</option>;
												})}
											</select>
										</div>
										<div>
											<label for='source' style={STYLES_LABEL}>
												Source
											</label>
											<select
												name='source'
												style={STYLES}
												value={credentials.source}
												onChange={updateCred}
											>
												{source.map((opt, index) => {
													return <option key={index}>{opt}</option>;
												})}
											</select>
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
