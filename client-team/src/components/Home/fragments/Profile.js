import './Profile.css';
import { useEffect, useState } from 'react';
import {
	MyProfile,
	FetchImage,
	UpdateProfile,
	UploadFile,
	UpdateProfilePhoto,
} from '../../controllers/API';
import USER_IMAGE from '../../assets/user-image.jpg';

const Profile = ({ showAlert, setLoading, history }) => {
	const [details, setDetails] = useState({
		name: '',
		mobile: '',
		email: '',
		photo: '',
	});
	const [passwords, setPasswords] = useState({
		current: '',
		password: '',
		confirm_password: '',
	});
	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const data = await MyProfile();
			if (data && data.success) {
				setDetails(data.profile);
			} else {
				showAlert('Server Error!!! Please try Later.');
			}
			setLoading(false);
		}
		fetchData();
	}, [showAlert, setDetails, setLoading]);

	const changeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		if (value && name === 'mobile' && !/[^a-zA-Z]/.test(value)) {
			return;
		}
		setDetails((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const passwordChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setPasswords((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};
	const UpdateProfileImage = async (e) => {
		if (e.target.files[0].size > 204800) {
			showAlert('File should be less than 200 kb');
			return;
		}
		setLoading(true);
		let data = await UploadFile(e.target.files[0]);
		if (data) {
			data = await UpdateProfilePhoto(data);
			if (data && data.success) {
				setDetails((prev) => {
					return {
						...prev,
						photo: data.photo,
					};
				});
				window.location.reload();
			} else {
				showAlert('Photo Upload Failed. Please try again later.');
			}
		} else {
			showAlert('Photo Upload Failed. Please try again later.');
		}
		setLoading(false);
	};
	const submitHandler = async (e) => {
		e.preventDefault();
		if (passwords.current) {
			if (passwords.password !== passwords.confirm_password)
				return showAlert('Passwords Mismatched');
		}
		setLoading(true);
		const data = await UpdateProfile(details, passwords);
		if (data && data.success) {
			setPasswords({
				current: '',
				password: '',
				confirm_password: '',
			});
			showAlert('Profile Saved');
			window.location.reload();
		} else {
			setLoading(false);
			if (data.message) {
				showAlert(data.message);
			} else {
				showAlert('Server Error. Please try later');
			}
		}
	};
	return (
		<form className='profile-wrapper' onSubmit={submitHandler}>
			<h4>Edit Information</h4>
			<div className='row'>
				<img alt='' src={details.photo ? FetchImage(details.photo) : USER_IMAGE} />
				<div className='edit'>
					<label className='file-label' htmlFor='photo'>
						Change Photo
					</label>
					<input
						id='photo'
						style={{ display: 'none' }}
						type='file'
						accept='image/*'
						onChange={UpdateProfileImage}
					/>
					<p>max size 200KB ( .png / .jpeg)</p>
				</div>
			</div>
			<hr />
			<div>
				<h4>Account info</h4>
				<div className='row detail'>
					<div className='col-3'>
						<label htmlFor=''>Name</label>
					</div>
					<div className='col-4'>
						<input
							type='text'
							name='name'
							value={details.name}
							onChange={changeHandler}
							placeholder=''
						/>
					</div>
				</div>
				<div className='row detail'>
					<div className='col-3'>
						<label htmlFor=''>Mobile No</label>
					</div>
					<div className='col-4'>
						<input
							type='text'
							name='mobile'
							value={details.mobile}
							onChange={changeHandler}
							placeholder=''
						/>
					</div>
				</div>
				<div className='row detail'>
					<div className='col-3'>
						<label htmlFor=''>Email ID</label>
					</div>
					<div className='col-4'>
						<input
							type='email'
							name='email'
							value={details.email}
							onChange={changeHandler}
							placeholder=''
							disabled={true}
						/>
					</div>
					<hr />
				</div>
			</div>
			<div>
				<h4>Change Password</h4>
				<div className='row detail'>
					<div className='col-3'>
						<label htmlFor=''>Current password</label>
					</div>
					<div className='col-4'>
						<input
							type='password'
							placeholder=''
							name='current'
							value={passwords.current}
							onChange={passwordChangeHandler}
						/>
					</div>
				</div>
				<div className='row detail'>
					<div className='col-3'>
						<label htmlFor=''>New password</label>
					</div>
					<div className='col-4'>
						<input
							type='password'
							placeholder=''
							name='password'
							value={passwords.password}
							onChange={passwordChangeHandler}
							pattern='.{8,}'
							title='Password must contains at least 8 or more characters'
						/>
					</div>
				</div>
				<div className='row detail'>
					<div className='col-3'>
						<label htmlFor=''>Confirm password</label>
					</div>
					<div className='col-4'>
						<input
							type='password'
							placeholder=''
							name='confirm_password'
							value={passwords.confirm_password}
							onChange={passwordChangeHandler}
						/>
					</div>
				</div>
				<button style={{ width: '150px' }}>SAVE</button>
				<button
					style={{ width: '150px', marginLeft: '5rem', backgroundColor: '#30475E' }}
					onClick={(e) => {
						e.preventDefault();
						history.push('/logout');
					}}
				>
					Logout
				</button>
			</div>
		</form>
	);
};

export default Profile;
