import React from "react";
import { Link } from "react-router-dom";

const GeneralFunction = props => (
  <div className="general-function">
    <Link id="header-darkmode-btn" className="darkmode-toggle" to="/">Dark mode</Link>
    <Link id="header-search-btn" className="search" onClick={null} to="/">Search</Link>
  </div>

);

export default GeneralFunction;