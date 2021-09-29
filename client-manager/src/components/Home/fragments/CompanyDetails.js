import './Students.css';
import { useEffect, useState } from 'react';
import { CloseIcon } from '../../assets/Images';
import { CompanyData, SaveCompanyDetails } from '../../controllers/API';
const CompanyDetails = ({ setLoading, showAlert }) => {
	const [industries, setIndustries] = useState([]);
	const [companyEditor, setEditingCompany] = useState(null);

	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const data = await CompanyData();
			if (data && data.success) {
				setIndustries(data.industries);
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
			{companyEditor && (
				<EditCompany
					editingCompany={companyEditor}
					setEditingCompany={setEditingCompany}
					setLoading={setLoading}
					showAlert={showAlert}
					industries={industries}
					setIndustries={setIndustries}
				/>
			)}
			<div className='student-wrapper'>
				<div className='row justify-content-between' style={{ marginBottom: '1rem' }}>
					<h4>Industry Panel</h4>
					<button className='btn btn-primary' onClick={(e) => setEditingCompany('new')}>
						Add Company
					</button>
				</div>
				<div className='row header'>
					<span className='col-4'>Name</span>
					<span className='col-4'>State</span>
					<span className='col-4'>Term</span>
				</div>
				<div className='details-wrapper'>
					{industries.map((industry) => {
						return <Card key={industry._id} detail={industry} editCompany={setEditingCompany} />;
					})}
				</div>
			</div>
		</>
	);
};

const Card = ({ detail, editCompany }) => {
	return (
		<>
			<div className='row details' onClick={(e) => editCompany(detail)}>
				<span className='col-4'>{detail.company_name}</span>
				<span className='col-4'>{detail.state}</span>
				<span className='col-4'>{detail.term} Years</span>
			</div>
		</>
	);
};

const EditCompany = ({
	editingCompany,
	setEditingCompany,
	setLoading,
	showAlert,
	industries,
	setIndustries,
}) => {
	const [details, setDetails] = useState({
		_id: '',
		company_name: '',
		term: '',
		state: '',
		rope_in_1: '',
		rope_in_2: '',
		rope_in_3: '',
		rope_in_4: '',
		rope_in_location: '',
		rope_in_assistance: '',
		practical_1: '',
		practical_2: '',
		practical_3: '',
		practical_4: '',
	});
	useEffect(() => {
		console.log(editingCompany);
		if (editingCompany !== 'new') {
			setDetails((prev) => {
				return {
					...prev,
					...editingCompany,
				};
			});
		}
	}, [editingCompany]);
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
		marginTop: '1.5rem',
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
		if (!details.company_name || !details.term || !details.state) {
			return showAlert('Company Name, Term, State cannot be empty');
		}
		setEditingCompany(null);
		setLoading(true);
		const data = await SaveCompanyDetails(details);
		if (data && data.success) {
			let filtered = industries;
			filtered = filtered.filter((company) => company._id !== data.message);
			filtered.push({ ...details, _id: data.message });
			setIndustries(filtered);
			showAlert('Company details saved.');
		} else {
			showAlert('Unable to save company details.');
		}
		setLoading(false);
	};
	return (
		<div className='popup-wrapper'>
			<form className='extra-details' style={{ padding: '1rem 2rem' }} onSubmit={submitHandler}>
				<span style={{ fontWeight: '600', fontSize: '1.2rem', marginLeft: '40%' }}>
					Company Details
				</span>
				<CloseIcon onClick={(e) => setEditingCompany(null)} />
				<div style={SCROLLINGDIV}>
					<div style={ROW}>
						<span style={LABEL}>Company Name</span>
						<input
							type='text'
							style={INPUT}
							name='company_name'
							value={details.company_name}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={ROW}>
						<span style={LABEL}>State</span>
						<select
							style={{ ...INPUT, width: '30%' }}
							name='state'
							value={details.state}
							onChange={onChangeListener}
						>
							{states.map((state) => (
								<option key={state}>{state}</option>
							))}
						</select>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Term</span>
						<input
							type='number'
							style={{ ...INPUT, width: '30%' }}
							name='term'
							value={details.term}
							onChange={onChangeListener}
							placeholder=''
							autoComplete='off'
						/>
					</div>
					<div style={{ ...ROW, alignItems: 'normal' }}>
						<span style={LABEL}>Initial Rope In</span>
						<div style={{ width: '70%' }}>
							<input
								type='text'
								style={{ ...INPUT, width: '100%' }}
								name='rope_in_1'
								value={details.rope_in_1}
								onChange={onChangeListener}
								placeholder='Address Line 1'
								autoComplete='off'
							/>
							<input
								type='text'
								style={{ ...INPUT, width: '100%', marginTop: '0.25rem' }}
								name='rope_in_2'
								value={details.rope_in_2}
								onChange={onChangeListener}
								placeholder='Address Line 2'
								autoComplete='off'
							/>
							<input
								type='text'
								style={{ ...INPUT, width: '100%', marginTop: '0.25rem' }}
								name='rope_in_3'
								value={details.rope_in_3}
								onChange={onChangeListener}
								placeholder='Address Line 3'
								autoComplete='off'
							/>
							<input
								type='text'
								style={{ ...INPUT, width: '100%', marginTop: '0.25rem' }}
								name='rope_in_4'
								value={details.rope_in_4}
								onChange={onChangeListener}
								placeholder='Address Line 4'
								autoComplete='off'
							/>
							<input
								type='text'
								style={{ ...INPUT, width: '100%', marginTop: '0.25rem' }}
								name='rope_in_location'
								value={details.rope_in_location}
								onChange={onChangeListener}
								placeholder='Geo-Location link'
								autoComplete='off'
							/>
						</div>
					</div>
					<div style={ROW}>
						<span style={LABEL}>Assistance Detail</span>
						<input
							type='text'
							style={INPUT}
							name='rope_in_assistance'
							value={details.rope_in_assistance}
							onChange={onChangeListener}
							placeholder='Call Ms. XYZ -  961XXXXXXX'
							autoComplete='off'
						/>
					</div>
					<div style={{ ...ROW, alignItems: 'normal' }}>
						<span style={LABEL}>OJT / Practical classes</span>
						<div style={{ width: '70%' }}>
							<input
								type='text'
								style={{ ...INPUT, width: '100%' }}
								name='practical_1'
								value={details.practical_1}
								onChange={onChangeListener}
								placeholder='Address Line 1'
								autoComplete='off'
							/>
							<input
								type='text'
								style={{ ...INPUT, width: '100%', marginTop: '0.25rem' }}
								name='practical_2'
								value={details.practical_2}
								onChange={onChangeListener}
								placeholder='Address Line 2'
								autoComplete='off'
							/>
							<input
								type='text'
								style={{ ...INPUT, width: '100%', marginTop: '0.25rem' }}
								name='practical_3'
								value={details.practical_3}
								onChange={onChangeListener}
								placeholder='Address Line 3'
								autoComplete='off'
							/>
							<input
								type='text'
								style={{ ...INPUT, width: '100%', marginTop: '0.25rem' }}
								name='practical_4'
								value={details.practical_4}
								onChange={onChangeListener}
								placeholder='Address Line 4'
								autoComplete='off'
							/>
						</div>
					</div>
					<div style={{ ...ROW, justifyContent: 'center', margin: '2rem 0' }}>
						<button style={BUTTON_STYLE}>Save Company Details</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CompanyDetails;
