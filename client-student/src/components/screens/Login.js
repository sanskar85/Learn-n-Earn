import React, { useState, useEffect } from 'react';
import '../comps/Login.css';
import IMAGE from '../assets/login_image.jpg';
import { LoginAPI, RegisterAPI, ForgotPassword, ResetPassword } from '../Controller/API';

export default function Login({ setTitle, history }) {
	const [type, setType] = useState('login');
	const [registerCred, setregisterCred] = useState({
		email: '',
		mobile: '',
		password: '',
		confirm_password: '',
	});
	const [loginCred, setloginCred] = useState({ username: '', password: '' });
	const [forgotCred, setforgotCred] = useState({ username: '', otp: '', password: '' });
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setTitle('Login • Learn n Earn');
	}, [setTitle]);

	const settype = (type) => {
		if (type === 'forgot-password') {
			setMessage('');
		}
		setType(type);
	};
	const loginSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (!loginCred.username || !loginCred.password) {
			setError('Fields cannot be empty');
			setTimeout(() => {
				setError('');
			}, 3000);
			setLoading(false);
			return;
		}

		const data = await LoginAPI(loginCred);
		if (!data || !data.success) {
			setError(data.message || 'Login Failed. Please try again later');
			setTimeout(() => {
				setError('');
			}, 3000);
			setLoading(false);
		} else {
			setLoading(false);
			history.push('/');
		}
	};

	const registerSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (registerCred.password !== registerCred.confirm_password) {
			setError('Passwords Mismatched');
			setregisterCred((prev) => {
				return {
					...prev,
					confirm_password: '',
				};
			});
			setTimeout(() => {
				setError('');
			}, 3000);
			setLoading(false);
			return;
		} else if (!registerCred.email || !registerCred.mobile || !registerCred.password) {
			setError('Fields cannot be empty');
			setTimeout(() => {
				setError('');
			}, 3000);
			setLoading(false);
			return;
		}
		const data = await RegisterAPI(registerCred);
		if (!data || !data.success) {
			setError(data.message || 'Registration Failed. Please try again later');
			setTimeout(() => {
				setError('');
			}, 3000);
			setLoading(false);
		} else {
			setLoading(false);
			history.push('/');
		}
	};

	const forgotSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (e.target.name === 'proceed') {
			if (!forgotCred.username) {
				setError('Fields cannot be empty');
				setTimeout(() => {
					setError('');
				}, 3000);
				setLoading(false);
				return;
			}
			const data = await ForgotPassword(forgotCred.username);
			if (!data || !data.success) {
				setError(data.message || 'Server Error. Please try again later');
				setTimeout(() => {
					setError('');
				}, 3000);
				setLoading(false);
			} else {
				setLoading(false);
				setMessage('OTP sent.');
			}
		} else if (e.target.name === 'reset') {
			if (!forgotCred.username) {
				setError('Fields cannot be empty');
				setTimeout(() => {
					setError('');
				}, 3000);
				setLoading(false);
				return;
			}
			const data = await ResetPassword(forgotCred);
			if (!data || !data.success) {
				setError(data.message || 'Server Error. Please try again later');
				setTimeout(() => {
					setError('');
				}, 3000);
			} else {
				setMessage('Password reset successful');
				setforgotCred({ username: '', otp: '', password: '' });
				setTimeout(() => {
					setMessage('');
					history.push('/login');
				}, 3000);
				setLoading(false);
			}
			setLoading(false);
		}
	};
	const registerCredChange = (e) => {
		setError('');
		const name = e.target.name;
		const value = e.target.value;
		if (value && name === 'mobile' && !/[^a-zA-Z]/.test(value)) {
			return;
		}
		setregisterCred((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};
	const loginCredChange = (e) => {
		setError('');
		const name = e.target.name;
		const value = e.target.value;
		if (name === 'mobile' && !/[^a-zA-Z]/.test(value)) {
			return;
		}
		setloginCred((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};
	const forgotCredChange = (e) => {
		setError('');
		const name = e.target.name;
		const value = e.target.value;
		if (name === 'mobile' && !/[^a-zA-Z]/.test(value)) {
			return;
		}
		setforgotCred((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};
	return (
		<>
			{type === 'login' && (
				<div className='login-wrapper'>
					{HeaderDiv()}
					<div className='row justify-content-center'>
						<form className='col-lg-4 col-10 wrapper' onSubmit={loginSubmit}>
							<span className='header'>Candidate Login</span>
							<input
								type='text'
								placeholder='Email / Mobile'
								name='username'
								required={true}
								disabled={loading}
								value={loginCred.username}
								onChange={loginCredChange}
							/>
							<input
								type='password'
								placeholder='Password'
								name='password'
								required={true}
								disabled={loading}
								value={loginCred.password}
								onChange={loginCredChange}
							/>
							{error && <p className='error'>{error}</p>}
							<button disabled={loading}>Login</button>
							<span className='_or'>or</span>
							<span
								className='register'
								onClick={(e) => {
									if (!loading) settype('register');
								}}
							>
								Register Now !
							</span>
							<span className='_hr' />
							<span
								className='link'
								onClick={(e) => {
									if (!loading) settype('forgot-password');
								}}
							>
								Forgot Password ?
							</span>
						</form>
					</div>
				</div>
			)}

			{type === 'register' && (
				<div className='login-wrapper'>
					{HeaderDiv()}
					<div className='row justify-content-center'>
						<form className='col-lg-4 col-10 wrapper' onSubmit={registerSubmit}>
							<span className='header'>Candidate Registration</span>
							<input
								type='email'
								placeholder='Email'
								required={true}
								name='email'
								onChange={registerCredChange}
								value={registerCred.email}
								disabled={loading}
							/>
							<input
								type='tel'
								placeholder='Mobile'
								maxLength='10'
								minLength='10'
								required={true}
								name='mobile'
								onChange={registerCredChange}
								value={registerCred.mobile}
								disabled={loading}
								pattern='[6789][0-9]{9}'
								title='Mobile Number should be of length 10 and starts with 6,7,8,9'
							/>
							<input
								type='password'
								placeholder='Password'
								autoComplete='off'
								required={true}
								name='password'
								onChange={registerCredChange}
								value={registerCred.password}
								disabled={loading}
								pattern='.{8,}'
								title='Password must contains at least 8 or more characters'
							/>
							<input
								type='password'
								placeholder='Confirm Password'
								autoComplete='off'
								name='confirm_password'
								onChange={registerCredChange}
								value={registerCred.confirm_password}
								required={true}
								disabled={loading}
							/>
							{error && <p className='error'>{error}</p>}
							<button className='register' disabled={loading}>
								Register
							</button>
							<span className='_hr' />
							<span
								className='link'
								onClick={(e) => {
									if (!loading) settype('login');
								}}
								disabled={loading}
							>
								Have a account? Login
							</span>
						</form>
					</div>
				</div>
			)}

			{type === 'forgot-password' && (
				<div className='login-wrapper'>
					{HeaderDiv()}
					<div className='row justify-content-center'>
						<form
							className='col-lg-4 col-10 wrapper'
							onSubmit={(e) => {
								e.preventDefault();
							}}
						>
							<span className='header'>Forgot Password</span>
							<input
								type='text'
								placeholder='Registered Email or Mobile Number'
								name='username'
								value={forgotCred.username}
								onChange={forgotCredChange}
								required={true}
								disabled={message || loading}
							/>

							{message && (
								<>
									<input
										type='number'
										placeholder='OTP'
										required={true}
										name='otp'
										value={forgotCred.otp}
										onChange={forgotCredChange}
										min='100000'
										max='999999'
									/>
									<input
										type='password'
										placeholder='Create Password'
										autoComplete='off'
										name='password'
										value={forgotCred.password}
										required={true}
										onChange={forgotCredChange}
										disabled={loading}
										pattern='.{8,}'
										title='Password must contains at least 8 or more characters'
									/>
									<button
										className='register'
										name='reset'
										onClick={forgotSubmit}
										disabled={loading}
									>
										Change Password
									</button>
								</>
							)}
							{error && <p className='error'>{error}</p>}
							{message && <p className='message'>{message}</p>}
							<button
								className='register'
								style={{ display: `${message ? 'none' : 'block'}` }}
								name='proceed'
								onClick={forgotSubmit}
								disabled={loading}
							>
								Proceed
							</button>
							<span className='_hr' />
							<span
								className='link'
								onClick={(e) => {
									if (!loading) settype('login');
								}}
								disabled={loading}
							>
								← Back
							</span>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

const HeaderDiv = () => {
	return (
		<div className='row upper-header' style={{ marginBottom: '2rem', justifyContent: 'center' }}>
			<span className='col-lg-5 col-sm-10' style={{ height: '255px', paddingRight: '0' }}>
				<img src={IMAGE} alt='' />
			</span>
			<div className='col-lg-5 col-sm-10' style={{ height: '255px', paddingLeft: '0' }}>
				<ul
					style={{
						backgroundColor: '#404B69',
						color: '#FFF',
						padding: '3rem 1rem 0 3rem',
						width: '80%',
						borderRadius: '0 10px 10px 0',
						height: '95%',
					}}
				>
					<li>No. 1 Website For Fresher</li>
					<li>No Fee / No Registration Charge</li>
					<li>No Hidden Cost</li>
					<li>Minimum Age to Register is 18</li>
					<li>
						For Any Assistance Email us to
						<a href='mailto::info@factory-jobs.com'>info@factory-jobs.com</a>
					</li>
				</ul>
			</div>
		</div>
	);
};
