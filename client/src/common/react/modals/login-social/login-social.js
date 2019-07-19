import React, { Component } from "react";
import classnames from "classnames";

import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GoogleLogin } from "react-google-login";

import {
  FacebookLoginButton,
  GoogleLoginButton
} from "../../social-buttons/social-button";

export class LoginSocial extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleFacebookResponse = res => {
    this.props.onResponse(res, "facebook");
  };

  handleGoogleResponse = res => {
    this.props.onResponse(res, "google");
  };

  render() {
    return (
      <div
        className={classnames("login-social-container", this.props.className)}
      >
        <FacebookLogin
          appId={process.env.REACT_APP_FB_APPID}
          autoLoad={false}
          fields="name,email,picture"
          scope="public_profile, email"
          onClick={() => this.props.handleClickSocialBtn()}
          callback={this.handleFacebookResponse}
          render={props => {
            return (
              <FacebookLoginButton onClick={props.onClick} text={"Facebook"} />
            );
          }}
        />
        <GoogleLogin
          clientId={process.env.REACT_APP_GG_CLIENTID}
          scope="https://www.googleapis.com/auth/user.birthday.read"
          hello="test"
          render={props => (
            <GoogleLoginButton
              onClick={() => {
                props.onClick();
              }}
              text={"Google"}
            />
          )}
          onSuccess={this.handleGoogleResponse}
          cookiePolicy={"single_host_origin"}
          onFailure={this.handleGoogleResponse}
        />
      </div>
    );
  }
}
