import '../comps/Examination.css';
import { useEffect, useState, useCallback, useRef } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FetchImage, StartExam, SubmitExam } from '../Controller/API';
const minuteSeconds = 60;
const hourSeconds = 4500;

const timerProps = {
	isPlaying: true,
	size: 110,
	strokeWidth: 10,
};
const getTimeSeconds = (time) => {
	const res = (minuteSeconds - time) | 0;

	return res === 75 ? '00' : res > 9 ? res : `0${res}`;
};
const getTimeMinutes = (time) => {
	const res = ((time % hourSeconds) / minuteSeconds) | 0;
	return res === 75 ? '00' : res > 9 ? res : `0${res}`;
};

const ExaminationScreen = ({ history, setTitle }) => {
	const screen = useFullScreenHandle();
	const [rejectionTime, setRejectionTime] = useState(10);
	const intervalId = useRef(null);
	const [questionNo, setQuestionNo] = useState(1);
	const [questions, setQuestions] = useState([]);
	const [userDetails, setUserDetails] = useState({ dp: '', name: '' });
	const startTime = Date.now() / 1000;
	const endTime = startTime + 4500 - 1;
	const remainingTime = endTime - startTime;
	const [inProcess, setProcessing] = useState(false);
	const submitExam = useCallback(async () => {
		setProcessing(true);
		const answers = [];
		questions.forEach((question) => {
			const obj = {
				id: question._id,
				answer: sessionStorage.getItem(question._id),
			};
			answers.push(obj);
		});
		const res = JSON.stringify(answers);
		const data = await SubmitExam(res);
		if (!data.success) {
			alert(data.message);
			setProcessing(false);
			history.push('/');
		} else {
			setProcessing(false);
			history.push(`/exam-result/${data.message}`);
		}
	}, [questions, history]);

	const reportScreenChange = useCallback(
		(isFullScreeen, handle) => {
			if (handle === screen) {
				if (!isFullScreeen) {
					setRejectionTime(10);
					intervalId.current = setInterval(() => {
						let rejectionTime;
						setRejectionTime((prev) => {
							rejectionTime = prev;
							return prev;
						});
						if (rejectionTime <= 0) {
							clearInterval(intervalId.current);
							submitExam();
						} else {
							setRejectionTime((prev) => {
								return prev - 1;
							});
						}
					}, 1000);
				} else {
					clearInterval(intervalId.current);
				}
			}
		},
		[screen, submitExam, setRejectionTime]
	);

	useEffect(() => {
		window.onpopstate = (e) => {
			window.alert('Your exam will be rejected');
			history.push('/');
		};
		async function fetchData() {
			const data = await StartExam();
			if (!data || !data.success) {
				if (data.error) alert(data.error.message);
			} else {
				setQuestions(JSON.parse(data.questions));
				setUserDetails(data.user);
			}
		}
		fetchData();
	}, [history]);
	useEffect(() => {
		setTitle('Examination Portal • Factory Jobs');
		setTimeout(() => {
			if (!inProcess) submitExam();
		}, 75 * 60 * 1000);
	});

	const handlePrev = (e) => {
		e.preventDefault();
		setQuestionNo((prev) => (prev <= 1 ? prev : prev - 1));
	};
	const handleNext = (e) => {
		e.preventDefault();
		setQuestionNo((prev) => (prev >= questions.length ? prev : prev + 1));
	};

	if (questions.length === 0 || inProcess) {
		return <>Loading...</>;
	}
	return (
		<>
			{!screen.active && (
				<div className='alert-popup-wrapper'>
					<div className='alert-popup-card'>
						<h2 style={{ marginTop: '20px', fontWeight: '600' }}>Please enable fullScreen</h2>

						<button className='enable-full-screeen-btn' onClick={screen.enter}>
							ENABLE
						</button>
						<p>Otherwise you exam will be reject in {rejectionTime} seconds</p>
					</div>
				</div>
			)}
			<div className='examination-wrapper'>
				<FullScreen handle={screen} onChange={reportScreenChange}>
					<div className='w3-row wrapper'>
						<div className='w3-col l9 s12'>
							<span>Question No. {questionNo}</span>
							<div className='question-wrapper'>
								{questions[questionNo - 1].type === 'Text' ? (
									<QuestionText question={questions[questionNo - 1]} />
								) : (
									<QuestionImage question={questions[questionNo - 1]} />
								)}
							</div>
							<div className='controls w3-row'>
								<button
									className='btn btn-outline-primary w3-col l2 s5'
									style={{
										visibility: `${questionNo === 1 ? 'hidden' : 'visible'}`,
									}}
									onClick={handlePrev}
								>
									Previous
								</button>
								<button
									className='btn btn-outline-primary w3-col l2 s5'
									style={{
										visibility: `${questionNo === questions.length ? 'hidden' : 'visible'}`,
									}}
									onClick={handleNext}
								>
									Next
								</button>
								<button
									className='btn btn-warning w3-col l2 s5'
									style={{ color: '#FFFFFF' }}
									onClick={(e) => {
										sessionStorage.removeItem(questions[questionNo - 1]._id);
										var ele = document.getElementsByName('options');
										for (var i = 0; i < ele.length; i++) ele[i].checked = false;
									}}
								>
									Clear
								</button>
							</div>
						</div>
						<div className='w3-col l2 s12 right-box-wrapper'>
							<div className='w3-row'>
								<button
									className='btn btn-primary submit w3-col l12 s12'
									onClick={(e) => {
										submitExam();
									}}
								>
									Submit
								</button>
								<div className='w3-col l12 s5 card right-box'>
									<img src={FetchImage(userDetails.dp)} alt='' />
									<span>{userDetails.name}</span>
								</div>
								<div className='w3-col l12 s5 card right-box'>
									<CountdownCircleTimer
										{...timerProps}
										colors={[['#FF9247']]}
										duration={hourSeconds}
										initialRemainingTime={remainingTime % hourSeconds}
										onComplete={() => [false]}
									>
										{({ elapsedTime }) => {
											return (
												<>
													<div className='time'>
														{getTimeMinutes(hourSeconds - elapsedTime)} :{' '}
														{getTimeSeconds(elapsedTime % minuteSeconds)}
													</div>
												</>
											);
										}}
									</CountdownCircleTimer>

									<span
										style={{
											display: 'block',
											fontSize: '0.9rem',
											margin: '10px 0 0',
										}}
									>
										Time Left
									</span>
								</div>
							</div>
						</div>
					</div>
				</FullScreen>
			</div>
		</>
	);
};
export const QuestionText = ({ question }) => {
	const handleChange = (e) => {
		sessionStorage.setItem(question._id, e.target.value);
	};
	useEffect(() => {
		const myAnswer = sessionStorage.getItem(question._id);
		var ele = document.getElementsByName('options');
		for (var i = 0; i < ele.length; i++) {
			if (ele[i].value === myAnswer) ele[i].checked = true;
			else ele[i].checked = false;
		}
	}, [question]);
	return (
		<>
			<p> {question.text}</p>
			<fieldset id='options' className='w3-row options'>
				<div className='w3-col l11 option'>
					<input type='radio' value='A' id='A' name='options' onChange={handleChange} />
					<label forhtml='A'>{question.options[0]}</label>
				</div>
				<div className='w3-col l11 option'>
					<input type='radio' value='B' id='B' name='options' onChange={handleChange} />
					<label forhtml='B'>{question.options[1]}</label>
				</div>
				<div className='w3-col l11 option'>
					<input type='radio' value='C' id='C' name='options' onChange={handleChange} />
					<label forhtml='C'>{question.options[2]}</label>
				</div>
				<div className='w3-col l11 option'>
					<input type='radio' value='D' id='D' name='options' onChange={handleChange} />
					<label forhtml='D'>{question.options[3]}</label>
				</div>
			</fieldset>
		</>
	);
};
export const QuestionImage = ({ question }) => {
	const handleChange = (e) => {
		sessionStorage.setItem(question._id, e.target.value);
	};
	useEffect(() => {
		const myAnswer = sessionStorage.getItem(question._id);
		var ele = document.getElementsByName('options');
		for (var i = 0; i < ele.length; i++) {
			if (ele[i].value === myAnswer) ele[i].checked = true;
			else ele[i].checked = false;
		}
	}, [question]);
	return (
		<>
			<img alt='Loading' src={FetchImage(question.image)} />
			<fieldset id='options' className='w3-row options'>
				<div className='w3-col l3 option'>
					<input type='radio' value='A' id='A' name='options' onChange={handleChange} />
					<label forhtml='A'>{question.options[0]}</label>
				</div>
				<div className='w3-col l3 option'>
					<input type='radio' value='B' id='B' name='options' onChange={handleChange} />
					<label forhtml='B'>{question.options[1]}</label>
				</div>
				<div className='w3-col l3 option'>
					<input type='radio' value='C' id='C' name='options' onChange={handleChange} />
					<label forhtml='C'>{question.options[2]}</label>
				</div>
				<div className='w3-col l3 option'>
					<input type='radio' value='D' id='D' name='options' onChange={handleChange} />
					<label forhtml='D'>{question.options[3]}</label>
				</div>
			</fieldset>
		</>
	);
};
export default ExaminationScreen;
