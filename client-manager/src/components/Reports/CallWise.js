import { useState, useEffect } from 'react';
import { CallWiseReport } from '../controllers/API';
import './Styles.css';

const CallWise = () => {
	const [call_data, setcalldata] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const data = await CallWiseReport();
			if (data && data.success) {
				setcalldata(data.call_wise_report);
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
					<h4>Call Wise Report</h4>
				</div>
				<div className='row header'>
					<span className='col-3'>Team Name</span>
					<span className='col-1'></span>
					<span className='col-2'>Total Target</span>
					<span className='col-2'>Achieved</span>
					<span className='col-2'>Interested</span>
					<span className='col-2'>Convinced</span>
				</div>
				<div className='details-wrapper'>
					{call_data.map((element) => {
						return <CallCard key={element} data={element} />;
					})}
				</div>
			</div>
		</>
	);
};
const CallCard = ({ data }) => {
	return (
		<>
			<div className='row details'>
				<span className='col-3'>{data.name}</span>
				<span className='col-1'></span>
				<span className='col-2'>{data.total}</span>
				<span className='col-2'>{data.achieved}</span>
				<span className='col-2'>{data.interested}</span>
				<span className='col-2'>{data.convinced}</span>
			</div>
		</>
	);
};
export default CallWise;
