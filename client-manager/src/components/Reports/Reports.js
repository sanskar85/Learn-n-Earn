import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import AdmissionWise from './AdmissionWise';
import ExamWise from './ExamWise';
import IndustryWise from './IndustryWise';
import InterviewWise from './InterviewWise';
import StateWise from './StateWise';
import SourceWise from './SourceWise';
import CallWise from './CallWise';

const Reports = ({ setTitle }) => {
	const { report } = useParams();
	useEffect(() => {
		if (report === 'exam-wise') {
			setTitle(`Exam Wise • Learn n Earn`);
		}
		if (report === 'interview-wise') {
			setTitle(`Interview Wise • Learn n Earn`);
		}
		if (report === 'admission-wise') {
			setTitle(`Admission Wise • Learn n Earn`);
		}
		if (report === 'state-wise') {
			setTitle(`State Wise • Learn n Earn`);
		}
		if (report === 'company-wise') {
			setTitle(`Company Wise • Learn n Earn`);
		}
		if (report === 'source-wise') {
			setTitle(`Source Wise • Learn n Earn`);
		}
		if (report === 'call-wise') {
			setTitle(`Call Wise • Learn n Earn`);
		}
	});
	return (
		<>
			{report === 'exam-wise' && <ExamWise />}
			{report === 'interview-wise' && <InterviewWise />}
			{report === 'admission-wise' && <AdmissionWise />}
			{report === 'state-wise' && <StateWise />}
			{report === 'company-wise' && <IndustryWise />}
			{report === 'source-wise' && <SourceWise />}
			{report === 'call-wise' && <CallWise />}
		</>
	);
};

export default Reports;
