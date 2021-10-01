import { useState, useEffect } from 'react';
import { SourceWiseReport } from '../controllers/API';
import './Styles.css';

const _sources = [
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
const SourceWise = () => {
	const [source, setsource] = useState({
		'News Paper': 0,
		Pamphlet: 0,
		'School / College': 0,
		'Employment Exchange Office': 0,
		'E-Mail': 0,
		'Friends / Relatives': 0,
		FaceBook: 0,
		SMS: 0,
		'Tele Caller': 0,
		'NTTF Trainee Reference': 0,
		'www.nttftrg.com': 0,
		YouTube: 0,
		'Any Other': 0,
	});
	useEffect(() => {
		async function fetchData() {
			const data = await SourceWiseReport();
			if (data && data.success) {
				setsource(data.source_wise_report);
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
					<h4>Source Wise Report</h4>
				</div>
				<div className='row header'>
					<span className='col-3'>Source</span>
					<span className='col-2'></span>
					<span className='col-2'>No of Candidates</span>
				</div>
				<div className='details-wrapper'>
					{_sources.map((element) => {
						return <SourceCard key={element} source={element} data={source[element]} />;
					})}
				</div>
			</div>
		</>
	);
};
const SourceCard = ({ source, data }) => {
	return (
		<>
			<div className='row details'>
				<span className='col-3' style={{ textAlign: 'left' }}>
					{source}
				</span>
				<span className='col-2'></span>
				<span className='col-2'>{data}</span>
			</div>
		</>
	);
};
export default SourceWise;
