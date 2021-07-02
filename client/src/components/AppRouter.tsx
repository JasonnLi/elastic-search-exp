import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import * as jwt_decode from "jwt-decode";
// import setAuthToken from "../utils/setAuthToken";
import { setCurrentUser, userLogout, IUserToken } from "../actions/authActions";
import PrivateRoute from "./private-route/PrivateRoute";
import PlaysPage from "./PlaysPage";
import PlayPage from "./PlayPage";
import CreatePlayPage from "./CreatePlayPage";
import Dashboard from "./DashboardPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import store from "../store";


// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  console.log(token);
  // setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode<IUserToken>(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    // store.dispatch(userLogout());
    // Redirect to home page without login status
    // window.location.href = "./plays";
  }
}


export default function AppRouter(props: any) {
  return (
    <Provider store={store}>
      <Router>
        {props.children}
        <Switch>
          <Route exact path="/plays">
            <PlaysPage />
          </Route>
          <Route exact path="/plays/createPlay">
            <CreatePlayPage />
          </Route>
          <Route exact path="/plays/login">
            <LoginPage />
          </Route>
          <Route exact path="/plays/register">
            <RegisterPage />
          </Route>
          <PrivateRoute exact path="/plays/dashboard" component={Dashboard} />
          <Route exact path="/plays/:userId">
            <PlayPage />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}
