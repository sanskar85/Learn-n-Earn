import './Students.css';
import FILTER_OUTLINED from '../../assets/filter-outlined.svg';
import FILTER_FILLED from '../../assets/filter-filled.svg';
import { CloseIcon } from '../../assets/Images';
import { useState, useEffect } from 'react';
import { OfferLetter_Details, IssueLetter } from '../../controllers/API';

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

const OfferLetter = ({ showAlert, setLoading }) => {
	var today = currDate();
	const [filterOpen, setFilterOpen] = useState(false);
	const [offer_letter_data, setDetails] = useState([]);
	const [offer_letter_details, setOfferLetterData] = useState([]);
	const [filter, _setFilter] = useState({
		mobile: '',
		state: '🌐 All States',
		from_date: '2021-01-01',
		to_date: today,
		status: 'Status',
	});
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
	useEffect(() => {
		const filtered = offer_letter_data.filter((candidate) => {
			const to_date = new Date(filter.to_date);
			to_date.setHours(23, 59, 59, 999);

			if (filter.mobile && !candidate.mobile.startsWith(filter.mobile)) {
				return false;
			}
			if (filter.state !== '🌐 All States' && candidate.state !== filter.state) {
				return false;
			}
			if (filter.status !== 'Status' && candidate.status !== filter.status) {
				return false;
			}
			return true;
		});
		setOfferLetterData(filtered);
	}, [offer_letter_data, filter]);

	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const data = await OfferLetter_Details();
			if (data && data.success) {
				setDetails(data.offer_details);
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
					<h4>Offer Letter </h4>
					<img
						src={filterOpen ? FILTER_FILLED : FILTER_OUTLINED}
						onClick={(e) => {
							setFilterOpen((prev) => !prev);
						}}
						alt=''
					/>
				</div>
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
					</div>
				)}

				<div className='row header'>
					<span className='col-3'>Name</span>
					<span className='col-3'>Phone</span>
					<span className='col-3'>Industry</span>
					<span className='col-3'>Action</span>
				</div>
				<div className='details-wrapper'>
					{offer_letter_details.map((candidate) => {
						return (
							<OfferCard
								key={candidate}
								candidate={candidate}
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

const OfferCard = ({ candidate, showAlert, setLoading }) => {
	const [popup, showPopup] = useState(false);
	const [details, setDetails] = useState({
		issue_date: currDate(),
		stipend: 0,
	});
	const [visible, setVisible] = useState(true);
	const STYLE = {
		backgroundColor: '#5CA1F1',
		borderRadius: '5px',
		padding: '0.125rem 1rem',
		color: '#FFFFFF',
		fontWeight: '500',
		cursor: 'pointer',
		textAlign: 'center',
		margin: '0 auto',
	};

	const changeHandler = (e) => {
		setDetails((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};
	const submitHandler = async (e) => {
		e.preventDefault();
		setLoading(true);
		const data = await IssueLetter(candidate.offer_id, details);
		if (data) {
			showPopup(false);
			setVisible(false);
			showAlert('Offer letter Sent.');
		} else {
			showAlert('Unable to save offer letter details. Please try again later.');
		}
		setLoading(false);
	};
	return (
		<>
			<div
				className='row details'
				style={{ cursor: 'default', display: visible ? 'flex' : 'none' }}
			>
				<span className='col-3'>{candidate.name}</span>
				<span className='col-3'>{candidate.mobile}</span>
				<span className='col-3'>{candidate.industry}</span>
				<span
					className='col-2'
					style={STYLE}
					onClick={(e) => {
						showPopup(true);
					}}
				>
					Issue Offer Letter
				</span>
			</div>
			{popup && (
				<div className='popup-wrapper'>
					<div className='popup'>
						<CloseIcon
							onClick={(e) => {
								showPopup(false);
							}}
						/>
						<div>
							<span className='popup-details'>Offer Letter</span>
							<span className='popup-details'>Name : {candidate.name}</span>
						</div>
						<form className='popup-from' onSubmit={submitHandler}>
							<div>
								<span> Stipend Amount</span>
								<input
									type='number'
									name='stipend'
									value={details.stipend}
									onChange={changeHandler}
									min={0}
									style={{ margin: '1rem 1.5rem 0.5rem', borderRadius: '5px' }}
								/>
							</div>
							<div>
								<span> Reporting Date </span>
								<input
									type='date'
									name='issue_date'
									value={details.issue_date}
									onChange={changeHandler}
									min={currDate()}
									style={{ margin: '0.5rem 1.5rem' }}
								/>
							</div>
							<button className='submit-btn' style={{ margin: '2.5rem 0 0' }}>
								Issue Offer Letter
							</button>
						</form>
					</div>
				</div>
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

export default OfferLetter;
