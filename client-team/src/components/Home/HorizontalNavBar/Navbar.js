import './Navbar.css';
import { useEffect, useState } from 'react';
import { Admission_Allowed } from '../../controllers/API';
import $ from 'jquery';
import DASHBOARD from './icons/dashboard.svg';
import STUDENT from './icons/students.svg';
import EXAM from './icons/exam.svg';
import INTERVIEW from './icons/interview.svg';
import OFFER_LETTER from './icons/offer-letter.svg';
import CALL from './icons/call-form.svg';
import PROFILE from './icons/profile.svg';
import ADMISSIONS from './icons/admissions.svg';
export default function HorizontalNavBar({ setSelectedMenu }) {
	const [admission, setAdmission] = useState(false);
	const clickHandler = (e) => {
		$('.nav-active').removeClass('nav-active');
		$(e.target).addClass('nav-active');
		$('.nav_bar').removeClass('nav-hover');
		setTimeout(() => {
			$('.nav_bar').addClass('nav-hover');
		}, 500);
		if (setSelectedMenu) setSelectedMenu($('.nav-active span').text());
	};
	useEffect(() => {
		async function fetchData() {
			const data = await Admission_Allowed();
			if (data) {
				setAdmission(data);
			}
		}
		fetchData();
	}, []);
	return (
		<>
			<div className='nav_bar nav-hover'>
				<div className='menu-item nav-active' onClick={clickHandler}>
					<img src={DASHBOARD} alt='' className='icon' />
					<span>Dashboard</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={STUDENT} alt='' className='icon' />
					<span>Candidates</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={EXAM} alt='' className='icon' />
					<span>Exam</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={INTERVIEW} alt='' className='icon' />
					<span>Interview</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={OFFER_LETTER} alt='' className='icon' />
					<span>Offer-Letter</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={CALL} alt='' className='icon' />
					<span>Call Response</span>
				</div>
				{admission && (
					<div className='menu-item' onClick={clickHandler}>
						<img src={ADMISSIONS} alt='' className='icon' />
						<span>Admission</span>
					</div>
				)}
				<div className='menu-item' onClick={clickHandler}>
					<img src={PROFILE} alt='' className='icon' />
					<span>Profile</span>
				</div>
			</div>
		</>
	);
}
