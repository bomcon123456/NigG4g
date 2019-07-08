import React from "react";
import { Link, withRouter } from "react-router-dom";
import { loginModal } from "../../../../common/react/modals/login/login";
import { registerModal } from "../../../../common/react/modals/register/register";

const VisitorFunction = props => (
  <div className="visitor-function">
    <button
      id="login-btn"
      className="my-btn-mute"
      onClick={() => {
        loginModal.open(props.handleLoginSuccess);
      }}
      to="/"
    >
      Login
    </button>
    <button
      id="signup-btn"
      className="my-btn-primary"
      onClick={() => {
        console.log(props);
        registerModal.open(() => props.history.push("/"));
      }}
      to="/"
    >
      Sign up
    </button>
  </div>
);

export default withRouter(VisitorFunction);
