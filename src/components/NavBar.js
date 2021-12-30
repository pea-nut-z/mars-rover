import React, { useState, useImperativeHandle, forwardRef } from "react";
import { NavData } from "./NavData";
import * as ioIcons from "react-icons/io5";
import "./Nav.css";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";

export const NavBar = forwardRef(({}, ref) => {
  const [navBar, setNavBar] = useState(false);
  const toggleNavBar = () => setNavBar(!navBar);

  useImperativeHandle(ref, () => ({
    navBar,
    toggleNavBar,
  }));

  return (
    <IconContext.Provider value={{ color: "#fff" }}>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <ioIcons.IoMenu onClick={toggleNavBar} />
        </Link>
      </div>
      <nav className={navBar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <ioIcons.IoCloseCircle />
            </Link>
          </li>
          {NavData.map((item, index) => {
            return (
              <li key={index} className="nav-text">
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </IconContext.Provider>
  );
});
