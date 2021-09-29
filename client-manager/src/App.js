import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Reports from './components/Reports/Reports';
import { LoginRoute, DashboardRoute, Routes } from './components/controllers/Routing';
function App() {
	const setTitle = (title) => {
		document.title = title;
	};

	return (
		<Router>
			<Switch>
				<LoginRoute exact path='/login' component={Login} setTitle={setTitle} />
				<DashboardRoute exact path='/' component={Home} setTitle={setTitle} />
				<Routes exact path='/reports/:report' component={Reports} setTitle={setTitle} />
				<Routes exact path='/company/:id' component={Reports} setTitle={setTitle} />
				<Route render={() => <Redirect to={`/`} />} />
			</Switch>
		</Router>
	);
}

export default App;
