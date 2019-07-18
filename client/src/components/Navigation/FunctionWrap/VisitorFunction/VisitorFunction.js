import React from "react";
import { loginModal } from "../../../../common/react/modals/login/login";
import { registerModal } from "../../../../common/react/modals/register/register";

const VisitorFunction = props => (
  <div className="visitor-function">
    <button
      id="login-btn"
      className="my-btn-mute"
      onClick={() => {
        loginModal.open();
      }}
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
    >
      Sign up
    </button>
  </div>
);

export default VisitorFunction;
