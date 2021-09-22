import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./components/Main";
import Likes from "./components/Likes";
import "./App.css";

export default function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/likes" component={Likes} />
        </Switch>
      </Router>
    </div>
  );
}
