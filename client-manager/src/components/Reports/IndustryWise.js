import { useState, useEffect } from 'react';
import { IndustryWiseReport } from '../controllers/API';
import './Styles.css';

const IndustryWise = () => {
	const [industry, setindusrty] = useState({});
	useEffect(() => {
		async function fetchData() {
			const data = await IndustryWiseReport();
			if (data && data.success) {
				setindusrty(data.industry);
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
					<h4>Company Wise Admission Report</h4>
				</div>
				<div className='row header'>
					<span className='col-3'>Industry</span>
					<span className='col-3'></span>
					<span className='col-1'>{getMonth(5)}</span>
					<span className='col-1'>{getMonth(4)}</span>
					<span className='col-1'>{getMonth(3)}</span>
					<span className='col-1'>{getMonth(2)}</span>
					<span className='col-1'>{getMonth(1)}</span>
					<span className='col-1'>{getMonth(0)}</span>
				</div>
				<div className='details-wrapper'>
					{Object.keys(industry).map((element) => {
						return <IndustryCard key={element} industry={element} data={industry[element]} />;
					})}
				</div>
			</div>
		</>
	);
};
const IndustryCard = ({ industry, data }) => {
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
					{industry}
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
export default IndustryWise;
