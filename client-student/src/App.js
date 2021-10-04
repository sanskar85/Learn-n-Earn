import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import {
	LoginRoute,
	DashboardRoute,
	ExaminationRoute,
	LogoutRoute,
} from './components/Controller/Routing';
import Login from './components/screens/Login';
import ExaminationTerms from './components/Examination/ExaminationTerms';
import ExaminationScreen from './components/Examination/ExaminationScreen';
import ExaminationResult from './components/Examination/ExaminationResult';

function App() {
	const setTitle = (title) => {
		document.title = title;
	};

	return (
		<Router>
			<div className='app'>
				<Switch>
					<LoginRoute exact path='/login' component={Login} setTitle={setTitle} />
					<ExaminationRoute
						exact
						path='/start-exam/terms'
						component={ExaminationTerms}
						setTitle={setTitle}
					/>
					<ExaminationRoute exact path='/exam' component={ExaminationScreen} setTitle={setTitle} />
					<Route
						exact
						path='/exam-result/:exam_id'
						component={ExaminationResult}
						setTitle={setTitle}
					/>
					<DashboardRoute exact path='/' setTitle={setTitle} />
					<LogoutRoute exact path='/logout' setTitle={setTitle} />

					<Route render={() => <Redirect to={`/`} />} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
