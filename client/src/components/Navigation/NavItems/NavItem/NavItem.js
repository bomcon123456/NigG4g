import React from "react";
import { NavLink } from "react-router-dom";

const navigationItem = props => (
  <li >
    <NavLink className="my-nav-link"
      to={props.link}
    >
      {props.children}
    </NavLink>
  </li>
);

export default navigationItem;
