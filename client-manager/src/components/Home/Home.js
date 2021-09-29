import { useState, useEffect } from 'react';
import HorizontalNavBar from './HomeNavBar/Navbar';
import NavigationBar from './NavigationBar';
import './Home.css';
import $ from 'jquery';
import Profile from './fragments/Profile';
import Students from './fragments/Students';
import Teams from './fragments/Teams';
import Dashboard from './fragments/Dashboard';
import Question from './fragments/Question';
import Reports from './fragments/Reports';
import AssignTarget from './fragments/AssignTarget';
import CompanyDetails from './fragments/CompanyDetails';

export default function Home({ setTitle, history }) {
	const [menu, _setMenu] = useState('Dashboard');
	const [alertMessage, setAlertMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const setMenu = (text) => {
		_setMenu(text);
		setTitle(`${text} • Learn n Earn`);
	};
	useEffect(() => {
		setTitle(`Dashboard • Learn n Earn`);
	}, [setTitle]);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [menu]);

	useEffect(() => {
		if (!alertMessage) return;
		$('.bottom-alert-bar').addClass('show');
		setTimeout(() => {
			setAlertMessage('');
			$('.bottom-alert-bar').removeClass('show');
		}, 5000);
	}, [alertMessage]);
	return (
		<>
			<HorizontalNavBar setSelectedMenu={setMenu} />
			<NavigationBar />
			<div className='home-wrapper'>
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
				{menu === 'Dashboard' && <Dashboard showAlert={setAlertMessage} setLoading={setLoading} />}
				{menu === 'Question Paper' && (
					<Question showAlert={setAlertMessage} setLoading={setLoading} />
				)}
				{menu === 'Assign Target' && (
					<AssignTarget showAlert={setAlertMessage} setLoading={setLoading} />
				)}
				{menu === 'Teams' && <Teams showAlert={setAlertMessage} setLoading={setLoading} />}
				{menu === 'Reports' && <Reports showAlert={setAlertMessage} setLoading={setLoading} />}
				{menu === 'Industry' && (
					<CompanyDetails showAlert={setAlertMessage} setLoading={setLoading} />
				)}
				{menu === 'Students' && <Students showAlert={setAlertMessage} setLoading={setLoading} />}
				{menu === 'Profile' && <Profile showAlert={setAlertMessage} setLoading={setLoading} />}
			</div>
			<BootomAlertBar alertMessage={alertMessage} />
		</>
	);
}
const BootomAlertBar = ({ alertMessage }) => {
	return (
		<>
			<div className='bottom-alert-bar'>{alertMessage}</div>
		</>
	);
};
