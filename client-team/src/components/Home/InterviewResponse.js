import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import $ from 'jquery';
import { CreateInterviewResponse, FetchIndustries } from '../controllers/API';

const CandidateSrc = [
	'',
	'NTTF OWN',
	'JUST HR',
	'E-Compat',
	'Career Tree',
	'Jashuva',
	'Heyinz',
	'Harsh',
];

const InterviewResponse = ({ setTitle }) => {
	const { interview_id } = useParams();
	const [loading, setLoading] = useState(false);
	const [Industry, setIndustries] = useState([]);
	const [details, setdetails] = useState({
		income: 0,
		interview_mode: 'Meeting',
		documents_verified: 'Yes',
		candidate_need: '',
		financial_background: '',
		english: '',
		maths: '',
		gk: '',
		ignou: 'Accepted',
		result: 'Pass',
		industry: '',
		remarks: '',
	});
	useEffect(() => {
		setTitle('Interview Response • Learn n Earn');
		async function fetchData() {
			const data = await FetchIndustries();
			if (data && data.success) {
				setIndustries(['', ...data.industry]);
			} else {
				alert('Unable to fetch Industries.');
				window.close();
			}
		}
		fetchData();
	}, [setTitle]);

	const changeListener = (e) => {
		setdetails((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};

	const selectorChange = (name, value) => {
		setdetails((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		if (
			!details.interview_mode ||
			!details.documents_verified ||
			!details.candidate_need ||
			!details.financial_background ||
			!details.english ||
			!details.maths ||
			!details.gk ||
			!details.ignou ||
			!details.result
		) {
			return alert('Fields cannot be empty');
		}
		setLoading(true);
		const data = await CreateInterviewResponse(interview_id, details);
		if (data) {
			setLoading(false);
			window.close();
		} else {
			setLoading(false);
			alert('Error Saving Response. Please try again later.');
		}
	};

	return (
		<>
			{loading && (
				<>
					<div className='loading-div'>
						<div className='loading'>
							<lottie-player
								src='https://assets6.lottiefiles.com/packages/lf20_6gdqhizo.json'
								background='transparent'
								speed='1'
								style={{ width: '200px', height: '200px' }}
								loop
								autoplay
							></lottie-player>
						</div>
					</div>
				</>
			)}
			<form
				className='interview-response-wrapper row justify-content-center'
				onSubmit={submitHandler}
				disabled={loading}
			>
				<div className='col-9 '>
					<span className='header'>Interview form</span>
					<div className='row justify-content-center'>
						<div className='col-6'>
							<label>Mode of Interview</label>
							<select
								name='interview_mode'
								value={details.interview_mode}
								onChange={changeListener}
							>
								<option>Meeting</option>
								<option>Telephonic</option>
							</select>
						</div>
						<div className='col-6'>
							<label>Parent Monthly Amount</label>
							<input
								type='number'
								name='income'
								value={details.income}
								onChange={changeListener}
								min={0}
								style={{ margin: '1rem 1.5rem 0.5rem', borderRadius: '5px' }}
							/>
						</div>
					</div>
					<div className='row '>
						<div className='col-9'>
							<label>Documents Verified?(DOB, Educational Certificates & Aadhaar Card)</label>
							<select
								name='documents_verified'
								value={details.documents_verified}
								onChange={changeListener}
							>
								<option>Yes</option>
								<option>No</option>
							</select>
						</div>
					</div>
					<div>
						<label>Rate Candidates need for this program ?</label>
						<Rating className='candidate_need' onChange={selectorChange} />
					</div>
					<div>
						<label>Financial Background</label>
						<Rating className='financial_background' onChange={selectorChange} />
					</div>
					<div>
						<label>Candidate can read / write English ?</label>
						<Rating className='english' onChange={selectorChange} />
					</div>
					<div>
						<label>Mathematics / Computing ?</label>
						<Rating className='maths' onChange={selectorChange} />
					</div>
					<div>
						<label>General Knowledge ?</label>
						<Rating className='gk' onChange={selectorChange} />
					</div>
					<div className='row justify-content-center'>
						<div className='col-6'>
							<label>IGNOU or Distance Education Status Explained ?</label>
							<select name='ignou' value={details.ignou} onChange={changeListener}>
								<option>Accepted</option>
								<option>Not Accepted</option>
								<option>Already Student</option>
							</select>
						</div>
						<div className='col-6'>
							<label>Interview Result</label>
							<select name='result' value={details.result} onChange={changeListener}>
								<option>Pass</option>
								<option>Fail</option>
								<option>Re-schedule Interview</option>
							</select>
						</div>
					</div>
					<div className='row justify-content-center'>
						<div className='col-6'>
							<label>If Pass, Selected for Which Industry ?</label>
							<select name='industry' value={details.industry} onChange={changeListener}>
								{Industry.map((item) => {
									return <option>{item.company_name}</option>;
								})}
							</select>
						</div>
						<div className='col-6'>
							<label>Remarks (if any)</label>
							<textarea
								type='text'
								placeholder='Enter Your Answer'
								name='remarks'
								value={details.remarks}
								onChange={changeListener}
							></textarea>
						</div>
						<button className='submit-btn col-2'>SAVE</button>
					</div>
				</div>
			</form>
		</>
	);
};

const Rating = ({ className, onChange }) => {
	function clickHandler(e) {
		$(`.${className} .active`).removeClass('active');
		$(e.target).addClass('active');
		const value = $(e.target).text();
		onChange(className, value);
	}

	return (
		<div className={`row rating ${className}`}>
			<div id='1' onClick={clickHandler} className='col-1'>
				1
			</div>
			<div id='2' onClick={clickHandler} className='col-1'>
				2
			</div>
			<div id='3' onClick={clickHandler} className='col-1'>
				3
			</div>
			<div id='4' onClick={clickHandler} className='col-1'>
				4
			</div>
			<div id='5' onClick={clickHandler} className='col-1'>
				5
			</div>
			<div id='6' onClick={clickHandler} className='col-1'>
				6
			</div>
			<div id='7' onClick={clickHandler} className='col-1'>
				7
			</div>
			<div id='8' onClick={clickHandler} className='col-1'>
				8
			</div>
			<div id='9' onClick={clickHandler} className='col-1'>
				9
			</div>
			<div id='10' onClick={clickHandler} className='col-1'>
				10
			</div>
		</div>
	);
};

export default InterviewResponse;
