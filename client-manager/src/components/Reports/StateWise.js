import { useState, useEffect } from 'react';
import { StateWiseReport } from '../controllers/API';
import './Styles.css';
import { CSVLink } from 'react-csv';
import ExportButton from '../Home/fragments/ExportButton';

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
		return date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
	};

	const createHeader = () => {
		const header = [];
		header.push({ label: 'State', key: 'state' });
		header.push({ label: getMonth(23), key: '23' });
		header.push({ label: getMonth(22), key: '22' });
		header.push({ label: getMonth(21), key: '21' });
		header.push({ label: getMonth(20), key: '20' });
		header.push({ label: getMonth(19), key: '19' });
		header.push({ label: getMonth(18), key: '18' });
		header.push({ label: getMonth(16), key: '16' });
		header.push({ label: getMonth(15), key: '15' });
		header.push({ label: getMonth(14), key: '14' });
		header.push({ label: getMonth(13), key: '13' });
		header.push({ label: getMonth(12), key: '12' });
		header.push({ label: getMonth(11), key: '11' });
		header.push({ label: getMonth(10), key: '10' });
		header.push({ label: getMonth(9), key: '9' });
		header.push({ label: getMonth(8), key: '8' });
		header.push({ label: getMonth(7), key: '7' });
		header.push({ label: getMonth(6), key: '6' });
		header.push({ label: getMonth(5), key: '5' });
		header.push({ label: getMonth(4), key: '4' });
		header.push({ label: getMonth(3), key: '3' });
		header.push({ label: getMonth(2), key: '2' });
		header.push({ label: getMonth(1), key: '1' });
		header.push({ label: getMonth(0), key: '0' });
		return header;
	};
	const createCSVData = () => {
		const csvData = _states.map((state) => {
			const data = states[state];
			const obj = {
				state: state,
				23: getCount(data, 23),
				22: getCount(data, 22),
				21: getCount(data, 21),
				20: getCount(data, 20),
				19: getCount(data, 19),
				18: getCount(data, 18),
				17: getCount(data, 17),
				16: getCount(data, 16),
				15: getCount(data, 15),
				14: getCount(data, 14),
				13: getCount(data, 13),
				12: getCount(data, 12),
				11: getCount(data, 11),
				10: getCount(data, 10),
				9: getCount(data, 9),
				8: getCount(data, 8),
				7: getCount(data, 7),
				6: getCount(data, 6),
				5: getCount(data, 5),
				4: getCount(data, 4),
				3: getCount(data, 3),
				2: getCount(data, 2),
				1: getCount(data, 1),
				0: getCount(data, 0),
			};
			return obj;
		});
		return csvData;
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
				<CSVLink
					data={createCSVData()}
					headers={createHeader()}
					filename={'state-wise-admission.csv'}
				>
					<ExportButton />
				</CSVLink>
			</div>
		</>
	);
};
const StateCard = ({ state, data }) => {
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
export default StateWise;
