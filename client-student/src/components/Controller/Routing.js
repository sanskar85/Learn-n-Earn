import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import Verification from '../screens/Verification';

import { RefreshToken, ProfileStatus, Logout } from './API';

export const LoginRoute = ({ component: Component, setTitle, ...rest }) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let isMounted = true;
		async function fetchData() {
			const logged = await RefreshToken();
			if (isMounted) {
				setLoggedIn(logged);
				setLoading(false);
			}
		}
		fetchData();
		return () => {
			isMounted = false;
		};
	}, []);

	if (loading) {
		return <></>;
	}
	return (
		<Route
			{...rest}
			render={(props) =>
				loggedIn ? <Redirect to={`/`} /> : <Component {...props} setTitle={setTitle} />
			}
		/>
	);
};

export const DashboardRoute = ({ component: Component, setTitle, ...rest }) => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState({
		verified: false,
		profileComplete: false,
		onHold: true,
		accessDashboard: false,
		remarks: '',
	});

	useEffect(() => {
		let isMounted = true;
		async function fetchData() {
			const data = await ProfileStatus();
			if (isMounted) {
				if (data && data.success) {
					setData(data);
					setLoading(false);
				}
			}
		}
		fetchData();
		return () => {
			isMounted = false;
		};
	}, []);

	if (loading) {
		return <></>;
	}
	return (
		<Route
			{...rest}
			render={(props) =>
				!data.verified ? (
					<Verification {...props} setTitle={setTitle} />
				) : !data.profileComplete ? (
					<Profile {...props} setTitle={setTitle} />
				) : data.onHold ? (
					<>
						<div
							style={{
								textAlign: 'center',
							}}
						>
							<h3 style={{ display: 'block', marginTop: '1rem' }}>
								Please wait until our team verifies your details
							</h3>
							<p style={{ display: 'block', marginTop: '2rem' }}>
								This process may take 2 - 3 hours. Please keep checking.
							</p>
						</div>
					</>
				) : !data.accessDashboard ? (
					<>
						<div
							style={{
								textAlign: 'center',
							}}
						>
							<h3 style={{ display: 'block', marginTop: '1rem' }}>
								Our team has verified your documents.
							</h3>
							<p style={{ display: 'block', marginTop: '2rem' }}>
								You are not eligible for this program because you are {data.remarks}
							</p>
						</div>
					</>
				) : (
					<Dashboard {...props} setTitle={setTitle} />
				)
			}
		/>
	);
};

export const ProfileRoute = ({ component: Component, setTitle, ...rest }) => {
	return <Route {...rest} render={(props) => <Component {...props} setTitle={setTitle} />} />;
};

export const LogoutRoute = ({ component: Component, setTitle, ...rest }) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let isMounted = true;
		setTitle('Logging Out');
		async function fetchData() {
			const data = await Logout();
			if (isMounted) {
				setLoggedIn(!data);
				setLoading(false);
			}
		}
		fetchData();
		return () => {
			isMounted = false;
		};
	}, [setTitle]);
	if (loading) {
		return <></>;
	}
	return (
		<Route
			{...rest}
			render={(props) => (loggedIn ? <Redirect to={`/`} /> : <Redirect to={`/login`} />)}
		/>
	);
};

export const ExaminationRoute = ({ component: Component, setTitle, type, ...rest }) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let isMounted = true;
		async function fetchData() {
			const logged = await RefreshToken();
			if (isMounted) {
				setLoggedIn(logged);
				setLoading(false);
			}
		}
		fetchData();
		return () => {
			isMounted = false;
		};
	}, []);

	if (loading) {
		return <></>;
	}
	return (
		<Route
			{...rest}
			render={(props) =>
				loggedIn ? <Component {...props} setTitle={setTitle} /> : <Redirect to='/login' />
			}
		/>
	);
};
