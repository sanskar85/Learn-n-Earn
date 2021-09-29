import { useState, useEffect } from 'react';
import './Students.css';
import './AssignTarget.css';
import { CloseIcon } from '../../assets/Images';
import { Teams as MyTeams, CreateTargetRecord } from '../../controllers/API';
const AssignTarget = ({ showAlert, setLoading }) => {
	const [data, setData] = useState([]);
	const [teams, setTeams] = useState([]);
	const [selectedTeam, setSelectedTeam] = useState('');
	const [fileVerified, setFileVerified] = useState(false);
	const [isAssignmentDialogVisble, showAssignmentDialog] = useState(false);

	const SUBMIT_STYLE = {
		marginTop: '2rem',
		color: '#FFF',
		float: 'right',
		padding: '0.5rem 2rem',
		borderRadius: '7px',
		border: 'none',
		outline: 'none',
		fontWeight: '500',
	};
	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			const teamsRes = await MyTeams();
			if (teamsRes && teamsRes.success) {
				setTeams(['', ...teamsRes.teams]);
				setLoading(false);
			} else {
				setLoading(false);
				showAlert('Unable to fetch Data');
			}
		}
		fetchData();
	}, [setLoading, showAlert]);

	const assignHandler = async (e) => {
		e.preventDefault();
		showAssignmentDialog(false);
		setLoading(true);
		const res = await CreateTargetRecord(selectedTeam, data);
		if (res) {
			setData([]);
			setSelectedTeam('');
			setFileVerified(false);
			setLoading(false);
		} else {
			setLoading(false);
			showAlert('Unable to assign Target.');
		}
	};
	return (
		<>
			{isAssignmentDialogVisble && (
				<div className='popup-wrapper'>
					<div className='popup-wrapper'>
						<div className='popup'>
							<CloseIcon
								onClick={(e) => {
									showAssignmentDialog(false);
								}}
							/>
							<div>
								<span className='popup-details'>Assign a Team Member</span>
							</div>
							<div className='row' style={{ marginTop: '2rem' }}>
								<form className='popup-from' onSubmit={assignHandler} style={{ width: '100%' }}>
									<select
										style={{
											width: '60%',
											background: '#DBE3FF',
											outline: 'none',
											border: 'none',
											padding: '0.25rem 1rem',
											margin: '0 0 1rem',
											borderRadius: '8px',
										}}
										name='type'
										onChange={(e) => {
											const selectedIndex = e.target.options.selectedIndex;
											const id = e.target.options[selectedIndex].getAttribute('data-key');
											setSelectedTeam(id);
										}}
									>
										{teams.map(({ _id, name }) => {
											return (
												<option key={_id} data-key={_id}>
													{name}
												</option>
											);
										})}
									</select>

									<button className='submit-btn'>Save</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
			{!fileVerified && (
				<div className='file-upload-wrapper'>
					<div>
						<label htmlFor='file' className='file-upload-label'>
							Click here to upload file
						</label>
						<input
							style={{ display: 'none' }}
							onChange={(e) => {
								setLoading(true);
								VerifyFile(
									e.target,
									(data) => {
										setLoading(false);
										setData(data);
										setFileVerified(true);
									},
									(err) => {
										setLoading(false);
										showAlert(err);
										setFileVerified(false);
									}
								);
								e.target.value = '';
							}}
							type='file'
							id='file'
							accept='.csv'
						/>
					</div>
				</div>
			)}
			{fileVerified && (
				<>
					<Table data={data} />
					<button
						style={SUBMIT_STYLE}
						className='btn btn-primary '
						onClick={(e) => {
							e.preventDefault();
							if (data.length > 0) showAssignmentDialog(true);
							else showAlert('No Candidate Selected ');
						}}
					>
						Assign Target
					</button>
				</>
			)}
		</>
	);
};

const Table = ({ data }) => {
	return (
		<div className='student-wrapper'>
			<div className='row header'>
				<span className='col-3'>Name</span>
				<span className='col-2'>Father</span>
				<span className='col-3'>Email</span>
				<span className='col-2'>Mobile1</span>
				<span className='col-2'>Mobile2</span>
			</div>

			<div className='details-wrapper'>
				{data.map((detail) => {
					return <Card key={detail} detail={detail} />;
				})}
			</div>
		</div>
	);
};

const Card = ({ detail }) => {
	return (
		<>
			<div className='row details' style={{ cursor: 'default' }}>
				<span className='col-3'>{detail[0]}</span>
				<span className='col-2'>{detail[1]}</span>
				<span className='col-3'>{detail[2]}</span>
				<span className='col-2'>{detail[3]}</span>
				<span className='col-2'>{detail[4]}</span>
			</div>
		</>
	);
};

const VerifyFile = (element, Callback, Error) => {
	if (element.files.length === 0) throw new Error('No File Uploaded');
	var allowedExtensions = /(\.csv)$/i;
	if (!allowedExtensions.exec(element.value)) {
		element.value = '';
		throw Error('Invalid File Format');
	}
	ReadFile(element, (data) => {
		if (!data) {
			return Error('Empty File');
		}
		data = data.trim();
		if (!data) {
			return Error('Empty File');
		}
		const lines = data.split(/\r?\n/);
		if (lines.length < 1) {
			return Error('Empty File');
		}
		const headers = lines[0].split(',');
		if (
			headers[0] === 'Name' &&
			headers[1] === 'Father' &&
			headers[2] === 'Email' &&
			headers[3] === 'Mobile1' &&
			headers[4] === 'Mobile2'
		) {
			data = lines.slice(1);
			data = data.filter((e) => e.length !== 0);
			if (data.length < 1) {
				return Error('File does not contain any target data');
			}
			data = data.map((e, index) => {
				let row = e.split(',');
				if (row.length >= 5) {
					row = row.slice(0, 5);
					return row;
				} else {
					return Error('Bad File Formatting. Row data missing at line ' + (index + 1));
				}
			});
			Callback(data);
		} else {
			return Error('Bad Header Formatting');
		}
	});
};
const ReadFile = function (element, callback) {
	const reader = new FileReader();
	reader.onload = (e) => {
		callback(e.target.result);
	};
	reader.readAsText(element.files[0]);
};

export default AssignTarget;
