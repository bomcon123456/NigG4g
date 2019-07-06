import React from "react";
import NavItems from "../NavItems/NavItems";
import image from '../../../Images/sprite-logo.png'

const toolbar = props => {
  return (
    <header id="top-nav">
      <div className="nav-wrap">
        <a className="my-logo" href="/">9GAG</a>
        <nav className="nav-menu">
          {<NavItems />}
        </nav>
        <div className="function-wrap"></div>
      </div>
    </header>
  );
};

export default toolbar;
