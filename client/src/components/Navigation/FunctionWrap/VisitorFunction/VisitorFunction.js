import React from "react";
import { Link } from "react-router-dom";

const VisitorFunction = props => (
  <div className="visitor-function">
    <button id="login-btn" className="my-btn-mute" onClick={null} to="/">Login</button>
    <button id="signup-btn" className="my-btn-primary" onClick={null} to="/">Sign up</button>
  </div>

);

export default VisitorFunction;