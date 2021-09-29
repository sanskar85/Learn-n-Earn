import { useState, useEffect } from 'react';
import { StateWiseReport } from '../controllers/API';
import './Styles.css';

const _states = [
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
const StateWise = () => {
	const [states, setstates] = useState({
		'Andhra Pradesh': [],
		'Andaman and Nicobar Islands': [],
		'Arunachal Pradesh': [],
		Assam: [],
		Bihar: [],
		Chandigarh: [],
		Chhattisgarh: [],
		'Dadra and Nagar Haveli': [],
		'Daman and Diu': [],
		Delhi: [],
		Goa: [],
		Gujarat: [],
		Haryana: [],
		'Himachal Pradesh': [],
		'Jammu and Kashmir': [],
		Jharkhand: [],
		Karnataka: [],
		Kerala: [],
		Lakshadweep: [],
		'Madhya Pradesh': [],
		Maharashtra: [],
		Manipur: [],
		Meghalaya: [],
		Mizoram: [],
		Nagaland: [],
		Odisha: [],
		Puducherry: [],
		Punjab: [],
		Rajasthan: [],
		Sikkim: [],
		'Tamil Nadu': [],
		Telangana: [],
		Tripura: [],
		'Uttar Pradesh': [],
		Uttarakhand: [],
		'West Bengal': [],
	});
	useEffect(() => {
		async function fetchData() {
			const data = await StateWiseReport();
			if (data && data.success) {
				setstates(data.states);
			} else {
				alert('Server Error Please try again later');
			}
		}
		fetchData();
	}, []);

	const getMonth = (diff) => {
		const date = new Date();
		date.setMonth(date.getMonth() - diff);
		return date.toLocaleString('en-GB', { month: 'long' });
	};
	return (
		<>
			<div className='report-wrapper'>
				<div className='row justify-content-between'>
					<h4>State Wise Admission Report</h4>
				</div>
				<div className='row header'>
					<span className='col-3'>State</span>
					<span className='col-3'></span>
					<span className='col-1'>{getMonth(5)}</span>
					<span className='col-1'>{getMonth(4)}</span>
					<span className='col-1'>{getMonth(3)}</span>
					<span className='col-1'>{getMonth(2)}</span>
					<span className='col-1'>{getMonth(1)}</span>
					<span className='col-1'>{getMonth(0)}</span>
				</div>
				<div className='details-wrapper'>
					{_states.map((state) => {
						return <StateCard key={state} state={state} data={states[state]} />;
					})}
				</div>
			</div>
		</>
	);
};
const StateCard = ({ state, data }) => {
	const getCount = (data, diff) => {
		const start = new Date();
		start.setMonth(start.getMonth() - diff);
		start.setDate(1);
		const end = new Date();
		end.setMonth(end.getMonth() - diff + 1);
		end.setDate(0);

		let count = 0;
		data.forEach((element) => {
			const date = new Date(element);
			if (date >= start && date <= end) {
				count++;
			}
		});
		return count;
	};
	return (
		<>
			<div className='row details'>
				<span className='col-3' style={{ textAlign: 'left' }}>
					{state}
				</span>
				<span className='col-3'></span>
				<span className='col-1'>{getCount(data, 5)}</span>
				<span className='col-1'>{getCount(data, 4)}</span>
				<span className='col-1'>{getCount(data, 3)}</span>
				<span className='col-1'>{getCount(data, 2)}</span>
				<span className='col-1'>{getCount(data, 1)}</span>
				<span className='col-1'>{getCount(data, 0)}</span>
			</div>
		</>
	);
};
export default StateWise;
