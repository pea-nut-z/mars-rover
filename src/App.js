import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import Home from "./Pages/Home";
import Likes from "./Pages/Likes";
import Search from "./Pages/Search";
import "./App.css";
import * as func from "./helper";

export default function App() {
  const ref = useRef();

  const closeNavBar = () => {
    ref.current.navBar && ref.current.toggleNavBar();
  };

  return (
    <div onClick={closeNavBar}>
      <Router>
        <NavBar ref={ref} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/likes" component={Likes} />
          <Route path="/search" component={Search} />
        </Switch>
      </Router>
    </div>
  );
}
