import { useEffect } from 'react';
import { LogoutIcon, UserIcon } from '../assets/Images';
import '../comps/NavigationBar.css';
import $ from 'jquery';

const NavigationBar = ({ name, history }) => {
	useEffect(() => {
		let mounted = true;
		function displayClock() {
			if (mounted) {
				var display = new Date().toLocaleTimeString();
				$('#time').text(display);
				setTimeout(displayClock, 1000);
			}
		}
		displayClock();
		return () => {
			mounted = false;
		};
	}, []);
	return (
		<div className='navigation-wrapper justify-content-between'>
			<span style={{ fontSize: '1.3rem', margin: 'auto 1rem' }}>Dashboard</span>
			<div className='menu-wrapper'>
				<span className='nav-menu' id='time'></span>
				<span className='nav-menu'>
					<UserIcon className='nav-menu-icon' />
					{name}
				</span>
				<span
					className='nav-menu'
					style={{ cursor: 'pointer' }}
					onClick={(e) => history.push('/logout')}
				>
					<LogoutIcon className='nav-menu-icon' />
					Logout
				</span>
			</div>
		</div>
	);
};
export default NavigationBar;
