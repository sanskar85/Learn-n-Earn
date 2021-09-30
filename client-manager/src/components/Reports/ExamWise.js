import { useState, useEffect } from 'react';
import { ExamWiseReport } from '../controllers/API';
import './Styles.css';
const ExamWise = () => {
	const [teams, setteams] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const data = await ExamWiseReport();
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
					<h4>Exam Wise Report</h4>
				</div>
				<div className='row header'>
					<span className='col-2'>Team Name</span>
					<span className='col-2'></span>
					<span className='col-2'>Attended</span>
					<span className='col-2'>Pending</span>
					<span className='col-2'>Pass</span>
					<span className='col-2'>Fail</span>
				</div>
				<div className='details-wrapper'>
					{teams.map((team) => {
						return (
							<div className='row details'>
								<span className='col-2'>{team.name}</span>
								<span className='col-2'></span>
								<span className='col-2'>{team.eligible}</span>
								<span className='col-2'>{team.pass}</span>
								<span className='col-2'>{team.fail}</span>
								<span className='col-2'>{team.attended}</span>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default ExamWise;
