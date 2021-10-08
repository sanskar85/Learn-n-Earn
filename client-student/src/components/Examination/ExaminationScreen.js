import '../comps/Examination.css';
import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FetchImage, StartExam, SubmitExam } from '../Controller/API';
import $ from 'jquery';
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

const ExaminationScreen = ({ setTitle }) => {
	const [questionNo, setQuestionNo] = useState(1);
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState({});
	const [inProcess, setProcessing] = useState(false);
	const [isFullScreen, setFullScreen] = useState(false);

	const startTime = Date.now() / 1000;
	const endTime = startTime + 75 * 60 - 1;
	const remainingTime = endTime - startTime;

	const getAnswer = (id) => {
		return answers[id];
	};
	const updateAnswer = (id, answer) => {
		setAnswers((prev) => {
			return {
				...prev,
				[id]: answer,
			};
		});
	};

	useEffect(() => {
		localStorage.setItem('exam', JSON.stringify(answers));
	}, [answers]);

	useEffect(() => {
		setTitle('Examination Portal • Factory Jobs');
		async function fetchData() {
			localStorage.setItem('exam', '');
			localStorage.setItem('misconduct', 2);
			const data = await StartExam();
			if (!data || !data.success) {
				if (data.error) alert(data.error.message);
			} else {
				setQuestions(JSON.parse(data.questions));
			}
		}
		fetchData();
	}, [setTitle]);

	useEffect(() => {
		$(window).blur(() => {
			if (getFullScreenElement()) {
				document.exitFullscreen();
			}
		});
		document.addEventListener('fullscreenchange', () => {
			if (getFullScreenElement()) setFullScreen(true);
			else {
				const misconduct = localStorage.getItem('misconduct') || 2;
				const submitExam = async () => {
					setProcessing(true);
					let answer = {};
					if (localStorage.getItem('exam')) answer = JSON.parse(localStorage.getItem('exam'));
					localStorage.setItem('exam', '');
					localStorage.clear();
					const data = await SubmitExam(answer);
					if (!data.success) {
						alert(data.message);
						$(window).off('blur');
						window.location.replace('/');
					} else {
						$(window).off('blur');
						window.location.replace(`/exam-result/${data.message}`);
					}
				};
				if (misconduct <= 0) {
					submitExam();
				} else localStorage.setItem('misconduct', misconduct - 1);
				setFullScreen(false);
			}
		});
	}, []);

	const handlePrev = (e) => {
		e.preventDefault();
		setQuestionNo((prev) => (prev <= 1 ? prev : prev - 1));
	};
	const handleNext = (e) => {
		e.preventDefault();
		setQuestionNo((prev) => (prev >= questions.length ? prev : prev + 1));
	};

	const getFullScreenElement = (e) => {
		return (
			document.fullscreenElement ||
			document.webkitFullScreen ||
			document.mozFullScreen ||
			document.msFullScreen
		);
	};

	const enableFullScreen = (e) => {
		document
			.getElementById('examination-wrapper')
			.requestFullscreen()
			.catch((e) => {
				alert('Alert!!! cannot enable full screen. Please clear cache and cookies');
			});
	};

	if (questions.length === 0 || inProcess) {
		return <>Processing please wait...</>;
	}
	return (
		<>
			{!isFullScreen && (
				<div className='alert-popup-wrapper' id='alert-popup-wrapper'>
					<div className='alert-popup-card'>
						<h2 style={{ marginTop: '20px', fontWeight: '600' }}>Enable FullScreen</h2>

						<button id='enable-full-screeen-btn' onClick={enableFullScreen}>
							ENABLE
						</button>
						<p>Exiting full-screen will result in automatic submission of the exam.</p>
					</div>
				</div>
			)}
			<div
				className='examination-wrapper'
				id='examination-wrapper'
				style={{ display: isFullScreen ? 'block' : 'none' }}
			>
				<div className='w3-row wrapper'>
					<div className='w3-col l9 s12'>
						<span>Question No. {questionNo}</span>
						<div className='question-wrapper'>
							{questions[questionNo - 1].type === 'Text' ? (
								<QuestionText
									question={questions[questionNo - 1]}
									getAnswer={getAnswer}
									updateAnswer={updateAnswer}
								/>
							) : (
								<QuestionImage
									question={questions[questionNo - 1]}
									getAnswer={getAnswer}
									updateAnswer={updateAnswer}
								/>
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
									updateAnswer(questions[questionNo - 1]._id, null);
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
									localStorage.setItem('misconduct', 0);
									document.exitFullscreen();
								}}
							>
								Submit
							</button>

							<div className='w3-col l12 s5 card right-box'>
								<CountdownCircleTimer
									{...timerProps}
									colors={[['#FF9247']]}
									duration={hourSeconds}
									initialRemainingTime={remainingTime % hourSeconds}
									onComplete={() => {
										localStorage.setItem('misconduct', 0);
										document.exitFullscreen();
										return [false];
									}}
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
			</div>
		</>
	);
};
export const QuestionText = ({ question, getAnswer, updateAnswer }) => {
	const handleChange = (e) => {
		updateAnswer(question._id, e.target.value);
	};
	useEffect(() => {
		const myAnswer = getAnswer(question._id);
		var ele = document.getElementsByName('options');
		for (var i = 0; i < ele.length; i++) {
			if (ele[i].value === myAnswer) ele[i].checked = true;
			else ele[i].checked = false;
		}
	}, [question, getAnswer]);
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
export const QuestionImage = ({ question, getAnswer, updateAnswer }) => {
	const handleChange = (e) => {
		updateAnswer(question._id, e.target.value);
	};
	useEffect(() => {
		const myAnswer = getAnswer(question._id);
		var ele = document.getElementsByName('options');
		for (var i = 0; i < ele.length; i++) {
			if (ele[i].value === myAnswer) ele[i].checked = true;
			else ele[i].checked = false;
		}
	}, [question, getAnswer]);
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
