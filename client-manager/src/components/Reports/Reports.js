import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import AdmissionWise from './AdmissionWise';
import ExamWise from './ExamWise';
import IndustryWise from './IndustryWise';
import InterviewWise from './InterviewWise';
import StateWise from './StateWise';
import SourceWise from './SourceWise';
import CallWise from './CallWise';
import AssignedTargets from './AssignedTargets';

const Reports = ({ setTitle }) => {
	const { report } = useParams();
	useEffect(() => {
		if (report === 'exam-wise') {
			setTitle(`Exam Wise • Factory Jobs`);
		}
		if (report === 'interview-wise') {
			setTitle(`Interview Wise • Factory Jobs`);
		}
		if (report === 'admission-wise') {
			setTitle(`Admission Wise • Factory Jobs`);
		}
		if (report === 'state-wise') {
			setTitle(`State Wise • Factory Jobs`);
		}
		if (report === 'company-wise') {
			setTitle(`Company Wise • Factory Jobs`);
		}
		if (report === 'source-wise') {
			setTitle(`Source Wise • Factory Jobs`);
		}
		if (report === 'call-wise') {
			setTitle(`Call Wise • Factory Jobs`);
		}
		if (report === 'target-data') {
			setTitle(`Target Data • Factory Jobs`);
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
			{report === 'target-data' && <AssignedTargets />}
		</>
	);
};

export default Reports;
