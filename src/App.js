import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./components/Main";
import Likes from "./components/Likes";
import MoreImages from "./components/MoreImages";
import "./App.css";

export default function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/likes" component={Likes} />
          <Route path="/MoreImages" component={MoreImages} />
        </Switch>
      </Router>
    </div>
  );
}
