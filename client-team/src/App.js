import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import InterviewResponse from "./components/Home/InterviewResponse";
import {LoginRoute,DashboardRoute,InterviewRoute} from "./components/controllers/Routing"

function App() {

  const setTitle = (title) => {
    document.title = title;
  }


  return (
    <Router>
        <Switch>
          
          <LoginRoute exact path="/login" component={Login} setTitle={setTitle} />
          <InterviewRoute exact path="/interview-response/:interview_id" component={InterviewResponse} setTitle={setTitle} />
          <DashboardRoute exact path="/" component={Home} setTitle={setTitle} />
          
          <Route render={() =><Redirect to={`/`} />}/>
        </Switch>
    </Router>
  );
}

export default App;
