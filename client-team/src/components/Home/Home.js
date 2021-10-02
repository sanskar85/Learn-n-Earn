import { useState, useEffect } from 'react';
import HorizontalNavBar from './HorizontalNavBar/Navbar';
import NavigationBar from './NavigationBar';
import './Home.css';
import $ from 'jquery';
import Dashboard from './fragments/Dashboard';
import Students from './fragments/Students';
import CallResponse from './fragments/CallResponse';
import Profile from './fragments/Profile';
import Examination from './fragments/Examination';
import Interview from './fragments/Interview';
import OfferLetter from './fragments/OfferLetter';
import Admission from './fragments/Admission';

export default function Home({ setTitle, history }) {
	const [menu, _setMenu] = useState('Dashboard');
	const [alertMessage, setAlertMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const setMenu = (text) => {
		_setMenu(text);
		setTitle(`${text} • Factory Jobs`);
	};
	useEffect(() => {
		setTitle(`Dashboard • Factory Jobs`);
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
				{menu === 'Candidates' && <Students showAlert={setAlertMessage} setLoading={setLoading} />}
				{menu === 'Call Response' && (
					<CallResponse showAlert={setAlertMessage} setLoading={setLoading} />
				)}
				{menu === 'Profile' && <Profile showAlert={setAlertMessage} setLoading={setLoading} />}
				{menu === 'Exam' && <Examination showAlert={setAlertMessage} setLoading={setLoading} />}
				{menu === 'Interview' && <Interview showAlert={setAlertMessage} setLoading={setLoading} />}
				{menu === 'Offer-Letter' && (
					<OfferLetter showAlert={setAlertMessage} setLoading={setLoading} />
				)}
				{menu === 'Admission' && <Admission showAlert={setAlertMessage} setLoading={setLoading} />}
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
