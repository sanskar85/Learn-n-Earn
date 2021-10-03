import { useState, useEffect } from 'react';
import { AssignedTargets } from '../controllers/API';
import './Styles.css';

const options = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
};

const TargetData = () => {
	const [data, setData] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const data = await AssignedTargets();
			if (data && data.success) {
				setData(data.targets);
			} else {
				alert('Server Error Please try again later');
			}
		}
		fetchData();
	}, []);
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
			</div>
		</>
	);
};

export default TargetData;
