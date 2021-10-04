import '../comps/ExaminationResult.css';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FetchExamDetails } from '../Controller/API';
const ExaminationResult = ({ setTitle }) => {
	const { exam_id } = useParams();
	const [message, setMessage] = useState('');
	const [name, setName] = useState('');
	const [report, setReport] = useState('');
	const [marks, setMarks] = useState('');

	useEffect(() => {
		let mounted = true;
		document.title = 'Exam Result • Factory Jobs';
		async function fetchData() {
			const data = await FetchExamDetails(exam_id);
			if (!mounted) return;
			if (!data.success) {
				alert(data.message);

				window.location.replace('/');
			} else {
				setMessage(data.message);
				setReport(data.report);
				setMarks(data.marks);
				setName(data.name);
			}
		}
		fetchData();
		return () => {
			mounted = false;
		};
	}, [exam_id, setTitle]);
	if (!message) return <>Loading Result...</>;
	if (report === ' PASS ') {
		return (
			<>
				<div className='examination-result-wrapper'>
					<div className='status' style={{ background: '#D9FFEA', color: '#06C15C' }}>
						You have successfully qualified the exam
					</div>
					<div className='content'>
						<h3>{name}</h3>
						<p>exam-id : {exam_id}</p>
						<h3>Marks Got - {marks}</h3>
						<div className='pass' style={{ background: '#D9FFEA', color: '#06C15C' }}>
							{report}
						</div>
						<p>{message}</p>
					</div>
					<Link
						onClick={(e) => {
							window.location.replace('/');
						}}
					>
						Return
					</Link>
				</div>
			</>
		);
	} else {
		return (
			<>
				<div className='examination-result-wrapper'>
					<div className='status' style={{ background: '#FFEBEB', color: '#CB3737' }}>
						Sorry you coldn’t qualify the exam
					</div>
					<div className='content'>
						<h3>{name}</h3>
						<p>exam-id : {exam_id}</p>
						<h3>Marks Got - {marks}</h3>
						<div className='pass' style={{ background: '#FFEBEB', color: '#CB3737' }}>
							{report}
						</div>
						<p>{message}</p>
					</div>
					<Link
						onClick={(e) => {
							window.location.replace('/');
						}}
					>
						Return
					</Link>
				</div>
			</>
		);
	}
};
export default ExaminationResult;
