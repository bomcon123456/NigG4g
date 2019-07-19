import React from "react";

export const FacebookSharingButton = props => {
  return (
    <button
      className="btn btn-facebook-share btn-social-packed"
      style={{
        marginRight: props.marginRight ? `${props.marginRight}px` : "",
        height: props.height ? `${props.height}px` : ""
      }}
      onClick={props.onClick}
    >
      <span className="fb-icon social-icon">
        <i className="fab fa-facebook-f" />
      </span>
      <span
        className="btn-text"
        style={{
          fontSize: props.marginRight ? `${props.fontSize}px` : "",
          width: `calc(100% - 50px)`
        }}
      >
        {props.text}
      </span>
    </button>
  );
};

export const PinterestSharingButton = props => {
  return (
    <button
      className="btn btn-pinterest-share btn-social-packed"
      onClick={props.onClick}
      style={{
        marginRight: props.marginRight ? `${props.marginRight}px` : "",
        height: props.height ? `${props.height}px` : ""
      }}
    >
      <span className="fb-icon social-icon">
        <i className="fab fa-pinterest" />
      </span>
      <span
        className="btn-text"
        style={{
          fontSize: props.marginRight ? `${props.fontSize}px` : "",
          width: `calc(100% - 50px)`
        }}
      >
        {props.text}
      </span>
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
