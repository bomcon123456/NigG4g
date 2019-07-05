import React from "react";

export const FacebookLoginButton = props => {
  return (
    <button
      className="btn btn-facebook-login btn-social"
      onClick={props.onClick}
    >
      <span className="fb-icon social-icon">
        <i className="fab fa-facebook-square" />
      </span>
      <span className="line" />
      <span className="btn-text">{props.text}</span>
    </button>
  );
};

export const GoogleLoginButton = props => {
  return (
    <button className="btn btn-google-login btn-social" onClick={props.onClick}>
      <span className="google-icon social-icon">
        <i className="fab fa-google-plus-square" />
      </span>
      <span className="line" />
      <span className="btn-text">{props.text}</span>
    </button>
  );
};
