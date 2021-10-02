import React, { useState, useEffect } from 'react';
import './Login.css';
import { LogoIcon } from '../assets/Images';
import { LoginAPI, ResetPassword, ForgotPassword } from '../controllers/API';
export default function Login({ setTitle, history }) {
	const [type, setType] = useState('login');
	const [loginCred, setloginCred] = useState({ username: '', password: '' });
	const [forgotCred, setforgotCred] = useState({
		username: '',
		otp: '',
		password: '',
	});
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
					<LogoIcon />
					<div className='row justify-content-center'>
						<form className='col-lg-4 col-10 wrapper' onSubmit={loginSubmit}>
							<span className='header'>Team Login</span>
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

			{type === 'forgot-password' && (
				<div className='login-wrapper'>
					<LogoIcon />
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
