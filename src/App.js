import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Main from "./Pages/Home";
import Likes from "./Pages/Likes";
import Search from "./Pages/Search";
import "./App.css";

export default function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/likes" component={Likes} />
          <Route path="/search" component={Search} />
        </Switch>
      </Router>
    </div>
  );
}
