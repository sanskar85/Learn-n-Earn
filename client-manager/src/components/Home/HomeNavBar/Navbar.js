import './Navbar.css';
import $ from 'jquery';
import DASHBOARD from './icons/dashboard.svg';
import STUDENT from './icons/students.svg';
import EXAM from './icons/exam.svg';
import CALL from './icons/call-form.svg';
import TEAMS from './icons/teams.svg';
import INDUSTRY from './icons/company.svg';
import TARGET from './icons/target.svg';
import PROFILE from './icons/profile.svg';
export default function HorizontalNavBar({ setSelectedMenu }) {
	const clickHandler = (e) => {
		$('.nav-active').removeClass('nav-active');
		$(e.target).addClass('nav-active');
		$('.nav_bar').removeClass('nav-hover');
		setTimeout(() => {
			$('.nav_bar').addClass('nav-hover');
		}, 500);
		if (setSelectedMenu) setSelectedMenu($('.nav-active span').text());
	};
	return (
		<>
			<div className='nav_bar nav-hover'>
				<div className='menu-item nav-active' onClick={clickHandler}>
					<img src={DASHBOARD} alt='' className='icon' />
					<span>Dashboard</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={TEAMS} alt='' className='icon' />
					<span>Teams</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={STUDENT} alt='' className='icon' />
					<span>Candidates</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={EXAM} alt='' className='icon' />
					<span>Question Paper</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={CALL} alt='' className='icon' />
					<span>Assign Target</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={INDUSTRY} alt='' className='icon' />
					<span>Industry</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={TARGET} alt='' className='icon' />
					<span>Reports</span>
				</div>
				<div className='menu-item' onClick={clickHandler}>
					<img src={PROFILE} alt='' className='icon' />
					<span>Profile</span>
				</div>
			</div>
		</>
	);
}
