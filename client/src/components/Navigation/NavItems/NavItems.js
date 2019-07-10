import React from "react";
import NavItem from "../NavItems/NavItem/NavItem.js";

const navigationItems = () => (
  <ul className="secondary">
    <NavItem link="/">Free App</NavItem>
    <NavItem link="/">
      9GAG Tee{" "}
      <span role="img" aria-label="T-Shirt">
        👕
      </span>
    </NavItem>
    <NavItem link="/">Rate My Outfit</NavItem>
    <NavItem link="/">Crappy Design</NavItem>
    <NavItem link="/">
      Near You{" "}
      <span role="img" aria-label="Near you">
        📍
      </span>
    </NavItem>
    <NavItem link="/">K-Pop</NavItem>
  </ul>
);

export default navigationItems;
