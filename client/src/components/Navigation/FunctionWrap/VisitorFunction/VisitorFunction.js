import React from "react";
import { Link } from "react-router-dom";

const VisitorFunction = props => (
  <div className="visitor-function">
    <Link id="login-btn" className="my-btn-mute" onClick={null} to="/">Login</Link>
    <Link id="signup-btn" className="my-btn-primary" onClick={null} to="/">Sign up</Link>
  </div>

);

export default VisitorFunction;