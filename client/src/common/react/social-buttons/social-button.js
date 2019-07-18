import React from "react";

export const FacebookShareButton = props => {
  return (
    <button
      className="btn btn-facebook-share btn-social-packed"
      onClick={props.onClick}
    >
      <span className="fb-icon social-icon">
        <i className="fab fa-facebook-f" />
      </span>
      <span className="btn-text">Facebook</span>
    </button>
  );
};

export const PinterestShareButton = props => {
  return (
    <button
      className="btn btn-pinterest-share btn-social-packed"
      onClick={props.onClick}
    >
      <span className="fb-icon social-icon">
        <i class="fab fa-pinterest" />
      </span>
      <span className="btn-text">Pinterest</span>
    </button>
  );
};

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
