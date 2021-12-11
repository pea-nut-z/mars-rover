import React, { useState } from "react";
import { NavData } from "./NavData";
import * as ioIcons from "react-icons/io5";
import "./Nav.css";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <IconContext.Provider value={{ color: "#fff" }}>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <ioIcons.IoMenu onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
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
}
