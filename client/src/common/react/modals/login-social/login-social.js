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
          appId="2158998807742962"
          autoLoad={false}
          fields="name,email,picture,birthday"
          scope="public_profile, email, user_birthday"
          onClick={() => this.props.handleClickSocialBtn()}
          callback={this.handleFacebookResponse}
          render={props => {
            return (
              <FacebookLoginButton onClick={props.onClick} text={"Facebook"} />
            );
          }}
        />
        <GoogleLogin
          clientId="315323914416-kboqkv3ehemndnke8cumdbcbfqmvqa2d.apps.googleusercontent.com"
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
