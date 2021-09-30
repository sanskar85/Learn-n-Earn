import { useState, useEffect } from 'react';
import { InterviewWiseReport } from '../controllers/API';
import './Styles.css';
const InterviewWise = () => {
	const [teams, setteams] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const data = await InterviewWiseReport();
			if (data && data.success) {
				setteams(data.teams);
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
					<h4>Interview Wise Report</h4>
				</div>
				<div className='row header'>
					<span className='col-2'>Team Name</span>
					<span className='col-2'>Scheduled</span>
					<span className='col-2'>Not Scheduled</span>
					<span className='col-2'>Pass</span>
					<span className='col-2'>Fail</span>
					<span className='col-2'>Not Responding</span>
				</div>
				<div className='details-wrapper'>
					{teams.map((team) => {
						return (
							<div className='row details'>
								<span className='col-2'>{team.name}</span>
								<span className='col-2'>{team.scheduled}</span>
								<span className='col-2'>{team.not_scheduled}</span>
								<span className='col-2'>{team.pass}</span>
								<span className='col-2'>{team.fail}</span>
								<span className='col-2'>{team.not_responding}</span>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default InterviewWise;
