import React, { Component } from "react";
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
      <div className="login-social-container">
        <FacebookLogin
          appId="2158998807742962"
          autoLoad={false}
          fields="name,email,picture"
          onClick={() => this.props.handleClickSocialBtn()}
          callback={this.facebookResponse}
          render={props => {
            return (
              <FacebookLoginButton onClick={props.onClick} text={"Facebook"} />
            );
          }}
        />
        <GoogleLogin
          clientId="315323914416-ivad6fjm9ehif4fal5j359lc83len18s.apps.googleusercontent.com"
          render={props => (
            <GoogleLoginButton onClick={props.onClick} text={"Google"} />
          )}
          onClick={() => this.props.handleClickSocialBtn()}
          onSuccess={this.googleResponse}
          cookiePolicy={"single_host_origin"}
          onFailure={this.googleResponse}
        />
      </div>
    );
  }
}
