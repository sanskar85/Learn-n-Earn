import { useState, useEffect } from 'react';
import { AssignedTargets as assigned_targets } from '../controllers/API';
import './Styles.css';
import { CSVLink } from 'react-csv';
import ExportButton from '../Home/fragments/ExportButton';

const options = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
};

const AssignedTargets = () => {
	const [data, setData] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const data = await assigned_targets();
			if (data && data.success) {
				setData(data.targets);
			} else {
				alert('Server Error Please try again later');
			}
		}
		fetchData();
	}, []);
	const csv_header = [
		{ label: 'Name', key: 'name' },
		{ label: 'Gender', key: 'gender' },
		{ label: 'Father', key: 'fname' },
		{ label: 'DOB', key: 'dob' },
		{ label: 'Mobile1', key: 'mobile1' },
		{ label: 'Mobile2', key: 'mobile2' },
		{ label: 'Aadhaar Number', key: 'aadhaar' },
		{ label: 'Email', key: 'email' },
		{ label: 'District', key: 'district' },
		{ label: 'State', key: 'state' },
		{ label: 'Qualification', key: 'qualification' },
		{ label: 'Year of Passing', key: 'y_o_p' },
		{ label: 'Pincode', key: 'pincode' },
		{ label: 'Source', key: 'source' },
	];

	return (
		<>
			<div className='report-wrapper'>
				<div className='row justify-content-between'>
					<h4>Assigned Targets</h4>
				</div>
				<div className='row header'>
					<span className='col-2'>Date</span>
					<span className='col-2'>Team</span>
					<span className='col-2'>Name</span>
					<span className='col-2'>Mobile1</span>
					<span className='col-2'>Qualification</span>
					<span className='col-2'>State</span>
				</div>
				<div className='details-wrapper'>
					{data.map((entry) => {
						return (
							<div className='row details'>
								<span className='col-2'>
									{new Date(entry.date).toLocaleDateString('en-GB', options)}
								</span>
								<span className='col-2'>{entry.team}</span>
								<span className='col-2'>{entry.name}</span>
								<span className='col-2'>{entry.mobile1}</span>
								<span className='col-2'>{entry.qualification}</span>
								<span className='col-2'>{entry.state}</span>
							</div>
						);
					})}
				</div>
				<CSVLink data={data} headers={csv_header} filename={'assigned_targets.csv'}>
					<ExportButton />
				</CSVLink>
			</div>
		</>
	);
};

export default AssignedTargets;
