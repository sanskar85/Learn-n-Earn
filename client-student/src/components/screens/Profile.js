import { UploadIcon } from '../assets/Images';
import { LabelledInput, LabelledSelectInput } from '../comps/Input';
import '../comps/Profile.css';
import { useState, useEffect } from 'react';
import { FetchPinCode, UploadFile, CreateProfile } from '../Controller/API';

export default function Profile({ setTitle, history }) {
	const [required, _setrequired] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [details, setdetails] = useState({
		name: '',
		fname: '',
		DOB: '',
		gender: '',
		aadhaar: '',
		pincode: '',
		state: '',
		district: '',
		qualification: '',
		diploma: '',
		y_o_p: '',
		cgpa: '',
		backlog: '',
		college: '',
		opportunity: '',
		plant_worked: '',
		height: '',
		weight: '',
		pwd: '',
		referral_mob: '',
		work_experience: '',
		photo: '',
		aadhaar_photo: '',
	});
	const opportunity = [
		'',
		'News Paper',
		'Pamphlet',
		'School / College',
		'Employment Exchange Office',
		'E-Mail',
		'Friends / Relatives',
		'FaceBook',
		'SMS',
		'Tele Caller',
		'NTTF Trainee Reference',
		'www.nttftrg.com',
		'YouTube',
		'Any Other',
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
		' Pursuing ITI -Electronic Mechanic',
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
		'',
		'Passenger Vehicle',
		'Commercial Vehicle',
		'Not Worked in Tata Motor',
		'Worked Some Other Tata Motors Plant',
	];
	const gender = ['', 'Male', 'Female', 'Others'];
	useEffect(() => {
		setTitle('Profile • Factory Jobs');
	}, [setTitle]);

	const setRequired = (e) => {
		_setrequired(e);
		let x = document.getElementsByName(e);
		if (x.length > 0) {
			x[0].focus();
		}
	};
	const textChangeHandler = async (e) => {
		const name = e.target.name;
		let value = e.target.value;
		if (name === required) {
			setRequired('');
		}
		if (name === 'pincode') {
			if (value.length >= 6) value = value.slice(0, 6);

			setdetails((prev) => {
				return {
					...prev,
					[name]: value,
				};
			});
			if (value.length === 6) {
				const { district, state, error } = await FetchPinCode(value);
				if (error) {
					return setdetails((prev) => {
						return {
							...prev,
							pincode: '',
						};
					});
				}
				return setdetails((prev) => {
					return {
						...prev,
						district: district,
						state: state,
					};
				});
			}
		}
		if (name === 'referral_mob' && !/[^a-zA-Z]/.test(value)) {
			return;
		}
		if (name === 'aadhaar' && !/[^a-zA-Z]/.test(value)) {
			return;
		}
		setdetails((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};
	const selectChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		if (name === required) {
			setRequired('');
		}
		setdetails((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};
	const uploadfile = async (e) => {
		if (e.target.files[0].size > 204800) {
			alert('File should be less than 200 kb');
			return;
		}

		if (e.target.id === 'aadhaar_image') {
			const data = await UploadFile(e.target.files[0]);
			if (data) {
				setdetails((prev) => {
					return {
						...prev,
						aadhaar_photo: data,
					};
				});
			}
		}
		if (e.target.id === 'photo') {
			const data = await UploadFile(e.target.files[0]);
			if (data) {
				setdetails((prev) => {
					return {
						...prev,
						photo: data,
					};
				});
			}
		}
	};

	const submit_handler = async (e) => {
		e.preventDefault();
		if (!details.name) return setRequired('name');
		if (!details.fname) return setRequired('fname');
		if (!details.DOB) return setRequired('DOB');
		if (!details.gender) return setRequired('gender');
		if (!details.aadhaar || details.aadhaar.length !== 12) return setRequired('aadhaar');
		if (!details.pincode || details.pincode.length !== 6) return setRequired('pincode');
		if (!details.state) return setRequired('state');
		if (!details.district) return setRequired('district');
		if (!details.qualification) return setRequired('qualification');
		if (!details.y_o_p || details.y_o_p.length !== 4) return setRequired('y_o_p');
		if (!details.cgpa || Number(details.cgpa) > 10) return setRequired('cgpa');
		if (!details.backlog) return setRequired('backlog');
		if (!details.college) return setRequired('college');
		if (!details.opportunity) return setRequired('opportunity');
		if (!details.plant_worked) return setRequired('plant_worked');
		if (!details.height) return setRequired('height');
		if (!details.weight) return setRequired('weight');
		if (!details.pwd) return setRequired('pwd');
		if (!details.work_experience) return setRequired('work_experience');
		if (!details.photo || !details.aadhaar_photo) {
			setError('Document Required');
			return setTimeout(() => {
				setError('');
			}, 5000);
		}
		setLoading(true);
		setError('');
		setMessage('Creating profile...');

		const data = await CreateProfile(details);
		if (data.success) {
			setLoading(false);
			window.location.reload();
		} else {
			setLoading(false);
			setError(data.message);
			setMessage('');
		}
	};

	function getMaxDate() {
		var dtToday = new Date();

		var month = dtToday.getMonth() + 1; // jan=0; feb=1 .......
		var day = dtToday.getDate();
		var year = dtToday.getFullYear() - 18;
		if (month < 10) month = '0' + month.toString();
		if (day < 10) day = '0' + day.toString();
		return year + '-' + month + '-' + day;
	}

	return (
		<div className='profile-wrapper'>
			<div className='background'>
				<form>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							fontSize: '1.2rem',
							fontWeight: 'bold',
						}}
					>
						Please enter your details correctly.
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='name'
								labelText='Name'
								required={required}
								disabled={loading}
								type='text'
								value={details.name}
								textChangeHandler={textChangeHandler}
								placeholder='Enter your full name'
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='fname'
								labelText="Father's Name"
								required={required}
								disabled={loading}
								type='text'
								value={details.fname}
								textChangeHandler={textChangeHandler}
								placeholder="Enter your father's name"
							/>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='DOB'
								labelText='Date of Birth'
								required={required}
								disabled={loading}
								type='date'
								max={getMaxDate()}
								value={details.DOB}
								textChangeHandler={textChangeHandler}
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledSelectInput
								labelClassName='label'
								className='input'
								name='gender'
								labelText='Gender'
								required={required}
								disabled={loading}
								type='text'
								options={gender}
								optionClass='input-selector-options'
								selectChangeHandler={selectChangeHandler}
							/>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='referral_mob'
								labelText='Reffered by'
								required={required}
								disabled={loading}
								type='tel'
								value={details.referral_mob}
								textChangeHandler={textChangeHandler}
								placeholder='Mobile number of our refferal team.'
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='aadhaar'
								labelText='Aadhaar'
								required={required}
								disabled={loading}
								type='number'
								value={details.aadhaar}
								textChangeHandler={textChangeHandler}
								placeholder='Enter 12 digit Aadhaar Number'
							/>
							<div className='image-upload' style={{ display: 'inline-block', marginLeft: '15px' }}>
								<label htmlFor='aadhaar_image' className='file-label'>
									Upload Image
									<UploadIcon style={{ height: '20px', marginLeft: '5px' }} />
								</label>

								<input
									id='aadhaar_image'
									style={{ display: 'none' }}
									required={required}
									disabled={loading}
									onChange={uploadfile}
									type='file'
									accept='image/*'
								/>
							</div>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='pincode'
								labelText='Pincode'
								required={required}
								disabled={loading}
								type='number'
								value={details.pincode}
								textChangeHandler={textChangeHandler}
								placeholder='Enter pincode'
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='state'
								labelText='State'
								required={required}
								type='text'
								disabled={true}
								value={details.state}
								textChangeHandler={textChangeHandler}
								placeholder='. . . . .'
							/>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='district'
								labelText='District'
								required={required}
								disabled={true}
								type='text'
								value={details.district}
								textChangeHandler={textChangeHandler}
								placeholder='. . . . .'
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<div
								className='image-upload'
								style={{ display: 'inline-block', marginLeft: '15px', marginTop: '30px' }}
							>
								<label htmlFor='photo' className='file-label'>
									Passport size photo
									<UploadIcon style={{ height: '20px', marginLeft: '5px' }} />
								</label>

								<input
									id='photo'
									style={{ display: 'none' }}
									required={required}
									disabled={loading}
									onChange={uploadfile}
									type='file'
									accept='image/*'
								/>
							</div>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledSelectInput
								labelClassName='label'
								className='input'
								name='qualification'
								labelText='Qualification'
								required={required}
								disabled={loading}
								type='text'
								options={qualifications}
								optionClass='input-selector-options'
								selectChangeHandler={selectChangeHandler}
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='diploma'
								labelText='Any other Diploma/write trade name'
								required={required}
								disabled={loading}
								type='text'
								value={details.diploma}
								textChangeHandler={textChangeHandler}
								placeholder='. . .'
							/>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='y_o_p'
								labelText='Year of passing'
								required={required}
								disabled={loading}
								type='number'
								value={details.y_o_p}
								textChangeHandler={textChangeHandler}
								placeholder='. . .'
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='cgpa'
								labelText='CGPA'
								required={required}
								disabled={loading}
								type='number'
								value={details.cgpa}
								textChangeHandler={textChangeHandler}
								placeholder='. . .'
							/>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='backlog'
								labelText='Any Backlog'
								required={required}
								disabled={loading}
								type='text'
								value={details.backlog}
								textChangeHandler={textChangeHandler}
								placeholder='Yes / No'
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='college'
								labelText='Last college name and adddress'
								required={required}
								disabled={loading}
								type='text'
								value={details.college}
								textChangeHandler={textChangeHandler}
								placeholder='. . .'
							/>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledSelectInput
								labelClassName='label'
								className='input'
								name='opportunity'
								labelText='How do you came to know about this Oppurtuity?'
								required={required}
								disabled={loading}
								type='text'
								options={opportunity}
								optionClass='input-selector-options'
								selectChangeHandler={selectChangeHandler}
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledSelectInput
								labelClassName='label'
								className='input'
								name='plant_worked'
								labelText='Which Plant you have worked in TATA MOTORS-PUNE'
								required={required}
								disabled={loading}
								type='text'
								options={plant_worked}
								optionClass='input-selector-options'
								selectChangeHandler={selectChangeHandler}
							/>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='height'
								labelText='Height'
								required={required}
								disabled={loading}
								type='number'
								value={details.height}
								textChangeHandler={textChangeHandler}
								placeholder='in cms'
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='weight'
								labelText='Weight'
								required={required}
								disabled={loading}
								type='number'
								value={details.weight}
								textChangeHandler={textChangeHandler}
								placeholder='in kgs'
							/>
						</div>
					</div>
					<div className='row  justify-content-center'>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='pwd'
								labelText='Differently Abled ?'
								required={required}
								disabled={loading}
								type='text'
								value={details.pwd}
								textChangeHandler={textChangeHandler}
								placeholder='Yes / No'
							/>
						</div>
						<div className='column col-lg-6 col-sm-8'>
							<LabelledInput
								labelClassName='label'
								className='input'
								name='work_experience'
								labelText='Any work experience?'
								required={required}
								disabled={loading}
								type='text'
								value={details.work_experience}
								textChangeHandler={textChangeHandler}
								placeholder='Yes / No'
							/>
						</div>
					</div>
					<hr />
					<div className='submit-wrapper'>
						<button className='submit-btn' onClick={submit_handler} disabled={loading}>
							Submit
						</button>
					</div>

					{error ? <span className='error'>{error}</span> : ''}
					{message ? <span className='message'>{message}</span> : ''}
				</form>
			</div>
		</div>
	);
}
