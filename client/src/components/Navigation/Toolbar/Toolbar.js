import React from "react";
import NavItems from "../NavItems/NavItems.js";
import "./Toolbar.styl";

const toolbar = props => {
  return (
    <header className="toolbar">
      <div className="logo" />
      <nav className="nav">
        <NavItems />
      </nav>
    </header>
  );
};

export default toolbar;
