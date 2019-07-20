import React from "react";
import NavItems from "../NavItems/NavItems";
import FunctionWrap from "../FunctionWrap/FunctionWrap";
import { Link } from "react-router-dom"

const toolbar = props => {
  return (
    <header className="top-nav">
      <div className="nav-wrap">
        <Link className="my-logo" to="/">
          9GAG
        </Link>
        <nav className="nav-menu">{<NavItems />}</nav>
        <FunctionWrap
          history={props.history}
          handleLogOut={props.handleLogOut}
        />
      </div>
    </header>
  );
};

export default toolbar;
