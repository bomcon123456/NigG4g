import React from "react";
import { NavLink } from "react-router-dom";

const navigationItem = props => (
  <li >
    <a href="/">{props.children}</a>
  </li>
);

export default navigationItem;
