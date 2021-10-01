import '../comps/Verification.css';
import { useState, useEffect } from 'react';
import pic from '../assets/verification.svg';
import refresh from '../assets/refresh.png';
import { VerificationAPI, VerifyUserAPI } from '../Controller/API';

const Verification = ({ setTitle, history }) => {
	const [header, setHeader] = useState('email');
	const [email_otp, setEmailOTP] = useState('');
	const [mobile_otp, setMobileOTP] = useState('');
	const [loading, setLoading] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [mobileError, setMobileError] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		setTitle('Account Verification • Learn n Earn');
		async function fetchData() {
			const data = await VerificationAPI();
			if (!data || !data.success) return history.push('/login');
		}
		fetchData();
	}, [setTitle, history]);

	const resendOTP = async (e) => {
		setLoading(true);
		const data = await VerificationAPI();
		if (data && data.success) {
			if (data.message === 'OTP Sent') {
				setError('');
				setMessage('OTP Sent');
			} else if (data.message === 'User Already Verified') {
				history.push('/');
			}
		} else {
			return history.push('/login');
		}
		setLoading(false);
	};

	const switchHandler = (e) => {
		if (header === 'mobile') {
			return setHeader('email');
		}
		setError('');
		if (email_otp.length < 6) {
			setEmailError(true);
		} else {
			setEmailError(false);
			setHeader('mobile');
		}
	};
	const handleSubmit = async (e) => {
		setError('');
		setMessage('');
		if (mobile_otp.length < 6) {
			return setMobileError(true);
		}
		setLoading(true);
		const data = await VerifyUserAPI(email_otp, mobile_otp);
		if (!data || !data.success) {
			if (!data) {
				setError('Server error! Please try again later.');
			} else {
				setError(data.message);
			}
			setLoading(false);
		} else {
			setLoading(false);
			window.location.reload();
		}
	};

	return (
		<>
			<div className='verification-wrapper row justify-content-between'>
				<div className='col-md-7 col-10 '>
					<div className='content'>
						<span className='header'>
							Verify Your <span className='orange'>Email </span> And
							<span className='orange'> Phone </span>
						</span>
						<p>
							Enter your verifiation code (OTP) that you recieved on your
							<span className='orange'> {header}</span>.
						</p>
						{header === 'email' && (
							<>
								<OTP error={emailError} otpHandler={setEmailOTP} disabled={loading} />
							</>
						)}
						{header === 'mobile' && (
							<>
								<OTP error={mobileError} otpHandler={setMobileOTP} disabled={loading} />
							</>
						)}
						{error && <span className='error'>{error}</span>}
						{message && <span className='message'>{message}</span>}
						{header === 'email' && <button onClick={switchHandler}>Next →</button>}
						{header === 'mobile' && <button onClick={handleSubmit}>Verify →</button>}
						<span className='resend orange' onClick={resendOTP}>
							Resend code <img src={refresh} alt='' />
						</span>
						{header === 'mobile' && <span onClick={switchHandler}>← Back</span>}
					</div>
				</div>
				<div className='col-md-5  col-10'>
					<img src={pic} alt='' className='image' />
				</div>
			</div>
		</>
	);
};

const OTP = ({ error, otpHandler, disabled }) => {
	const [otp, setotp] = useState('      ');
	const changeHandler = (e) => {
		let chars = otp.split('');
		const index = Number(e.target.id.split('_')[1]);
		chars[index] = e.target.value;
		let newOtp = chars.join('');
		setotp(newOtp);
		if (e.target.value) {
			if (index < 5) {
				document.getElementById(`otp_${index + 1}`).focus();
			}
		} else {
			if (index > 0) {
				document.getElementById(`otp_${index - 1}`).focus();
			}
		}
		otpHandler(newOtp.trim());
	};
	return (
		<>
			<div className='otp-wrapper justify-content-around'>
				<input
					onChange={changeHandler}
					id='otp_0'
					disabled={disabled}
					className={`otp-input ${error ? 'otp-error' : ''}`}
					type='text'
					maxlength='1'
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^0-9]/g, '');
					}}
				/>
				<input
					onChange={changeHandler}
					id='otp_1'
					disabled={disabled}
					className={`otp-input ${error ? 'otp-error' : ''}`}
					type='text'
					maxlength='1'
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^0-9]/g, '');
					}}
				/>
				<input
					onChange={changeHandler}
					id='otp_2'
					disabled={disabled}
					className={`otp-input ${error ? 'otp-error' : ''}`}
					type='text'
					maxlength='1'
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^0-9]/g, '');
					}}
				/>
				<input
					onChange={changeHandler}
					id='otp_3'
					disabled={disabled}
					className={`otp-input ${error ? 'otp-error' : ''}`}
					type='text'
					maxlength='1'
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^0-9]/g, '');
					}}
				/>
				<input
					onChange={changeHandler}
					id='otp_4'
					disabled={disabled}
					className={`otp-input ${error ? 'otp-error' : ''}`}
					type='text'
					maxlength='1'
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^0-9]/g, '');
					}}
				/>
				<input
					onChange={changeHandler}
					id='otp_5'
					disabled={disabled}
					className={`otp-input ${error ? 'otp-error' : ''}`}
					type='text'
					maxlength='1'
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^0-9]/g, '');
					}}
				/>
			</div>
		</>
	);
};

export default Verification;
