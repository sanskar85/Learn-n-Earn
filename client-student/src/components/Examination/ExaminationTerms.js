import { useEffect } from 'react';
import '../comps/ExaminationTerms.css';
import camera from '../assets/camera.png';
import signal from '../assets/signal.png';
const ExaminationTerms = ({ setTitle }) => {
	useEffect(() => {
		setTitle('Terms and Conditions • Factory Jobs');
	}, [setTitle]);

	const startHandler = (e) => {
		setTimeout(function () {
			window.close();
		}, 1000);
		window.location.replace('/exam');
	};
	return (
		<div className='terms-wrapper'>
			<h4>Exam Instruction</h4>
			<p>Duration of this exam is 75 minutes.</p>
			<div className='table'>
				<span>
					<p>Science & mathematics</p>
					<p>English</p>
					<p>General Knowledge</p>
					<p>Technical Reasoning</p>
					<p>Coding & aptitude</p>
				</span>
				<span>
					<p> - 20 marks</p>
					<p> - 10 marks</p>
					<p> - 10 marks</p>
					<p> - 10 marks</p>
					<p> - 10 marks</p>
				</span>
			</div>
			<p>
				Allow adequate time to complete this exam in one sitting before the due date and time. If
				time’s up the exam will be submited automatically.
			</p>
			<p>
				This is an restricted open book exam. The following materials and provisions are not
				permitted:
			</p>
			<p>
				<span>Communication device -</span>
				<span>Mobile Phones</span>
				<span>Bluetooth</span>
				<span>Earphones</span>
				<span>Microphone</span>
				<span>Pager</span>
				<span>Health Band</span>
			</p>
			<p>
				There are 60 questions in this exam and will be presented one at a time Each question is
				worth the same marks.
			</p>
			<p>
				Make sure you have a{' '}
				<img src={camera} alt='' style={{ margin: '0 0.5rem', height: '24px' }} /> webcam and{' '}
				<img src={signal} alt='' style={{ margin: '0 0.5rem', height: '24px' }} />
				stable internet connection.
			</p>

			<h4>Examination Conduct</h4>
			<p>
				You must only attempt this exam once. Any additional attempts should only be used in the
				event where a serious technical issue has occurred and supporting evidence supporting this
				will be required.
			</p>
			<p>
				You are not permitted to switch tabs or application during the exam. If found so your exam
				will be rejected.
			</p>
			<p>
				You are not permitted to obtain assistance by improper means or ask for help from or give
				help to any other person.
			</p>
			<p>
				You are not permitted to take screenshots, record the screen, copy and paste questions or
				answers or otherwise attempt to take any of the content of this exam out of the exam for any
				purpose.
			</p>
			<p>
				You are not permitted to post any requests for clarification of exam content. Answer all
				questions to the best of your ability and perception of the questions’ intent, make
				reasonable assumptions if necessary, to answer all questions. UTS assessments never apply
				negative marking techniques.
			</p>
			<p>Misconduct action will be taken against you if you breach university rules. </p>
			<h4>Candidate declaration</h4>
			<p>By attempting this exam, I acknowledge that</p>

			<p>
				I agree to be bound by the Organization rules, codes of conduct, and other policies relating
				to examinations.
			</p>

			<p>I have read and understand the examination conduct requirements for this exam </p>

			<p>I am aware of the Organization rules regarding misconduct during examinations </p>

			<p>
				I am not in possession of, nor do I have access to, any unauthorised material during this
				examination
			</p>

			<p>
				In attempting this examination and submitting an answer, candidates are undertaking that the
				work they submit is a result of their own unaided efforts and that they have not discussed
				the questions or possible answers with other persons during the examination period.
				Candidates who are found to have participated in any form of cooperation or collusion or any
				activity which could amount to academic misconduct in the answering of this examination will
				have their marks withdrawn and disciplinary action will be initiated.
			</p>
			<button className='btn btn-primary' onClick={startHandler}>
				Accept
			</button>
		</div>
	);
};

export default ExaminationTerms;
