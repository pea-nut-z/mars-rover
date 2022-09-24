import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import Home from "./Pages/Home";
import Likes from "./Pages/Likes";
import Search from "./Pages/Search";
import "./App.css";

export default function App() {
  const ref = useRef();

  useEffect(() => {
    const closeNavBar = () => {
      ref.current.navBar && ref.current.toggleNavBar();
    };
    document.body.addEventListener("click", closeNavBar);

    return () => {
      document.body.removeEventListener("click", closeNavBar);
    };
  }, []);

  return (
    <div>
      <Router>
        <NavBar ref={ref} />
        <p className="corner-name">PAULINE ZHANG</p>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/likes" component={Likes} />
          <Route path="/search" component={Search} />
        </Switch>
      </Router>
    </div>
  );
}
