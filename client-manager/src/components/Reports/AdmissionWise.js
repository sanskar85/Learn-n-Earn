import { useState, useEffect } from 'react';
import { AdmissionWiseReport } from '../controllers/API';
import './Styles.css';
const AdmissionWise = () => {
	const [teams, setteams] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const data = await AdmissionWiseReport();
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
					<h4>Admission Wise Report</h4>
				</div>
				<div className='row header'>
					<span className='col-2'>Team Name</span>
					<span className='col-2'></span>
					<span className='col-2'>Issued</span>
					<span className='col-2'>Not Issued</span>
					<span className='col-2'>Joined</span>
					<span className='col-2'>Not Responding</span>
				</div>
				<div className='details-wrapper'>
					{teams.map((team) => {
						return (
							<div className='row details'>
								<span className='col-2'>{team.name}</span>
								<span className='col-2'></span>
								<span className='col-2'>{team.issued}</span>
								<span className='col-2'>{team.not_issued}</span>
								<span className='col-2'>{team.joined}</span>
								<span className='col-2'>{team.not_responding}</span>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default AdmissionWise;
