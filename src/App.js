import React from "react";
// import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import PrivateRoute from "./components/auth/PrivateRoute";
// import Page from "./components/Page";
// import UpdateProfile from "./components/auth/UpdateProfile";
// import Signup from "./components/auth/Signup";
import Main from "./components/Main";
import Likes from "./components/Likes";
import "./App.css";

export default function App() {
  return (
    <div>
      <Router>
        <Switch>
          {/* <PrivateRoute exact path="/" component={Page} /> */}
          {/* <PrivateRoute path="/update-profile" component={UpdateProfile} /> */}
          <Route exact path="/" component={Main} />
          <Route exact path="/likes" component={Likes} />
          {/* <Route path="/login" component={Login} /> */}
          {/* <Route path="/forgot-password" component={ForgotPassword} /> */}
        </Switch>
      </Router>
    </div>
  );
}
