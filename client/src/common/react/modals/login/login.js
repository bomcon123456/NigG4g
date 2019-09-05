import React from "react";
import { Link } from "react-router-dom";
import omit from "lodash/omit";
import axios from "axios";

import { KComponent } from "../../../../components/KComponent";
import { modals } from "../modals";
import { createFormWithValidator } from "../../form-validator/form-validator";
import { InputBase } from "../../input-base/input-base";
import { LoadingInline } from "../../loading-inline/loading-inline";
import { LoginSocial } from "../login-social/login-social";

import { authApi } from "../../../api/common/auth-api";
import { authenCache } from "../../../cache/authen-cache";
import { userInfo } from "../../../states/user-info";
import { accountSchema } from "./schema";

export class LoginModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    };

    this.form = createFormWithValidator(accountSchema, {
      initData: {
        email: "",
        password: ""
      }
    });
    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => this.handleLogin()));
    this.form.validateData();
  }

  handleLogin = () => {
    const { email, password } = this.form.getData();
    this.setState({ loading: true });
    authApi
      .post({
        email: email,
        password: password
      })
      .then(data => {
        authenCache.setAuthen(data.data.token, { expire: 1 });
        userInfo.setState(data.data.user).then(() => {
          console.log("[USER_STATE]", userInfo);
          this.props.onLoginSuccess();
        });
      })
      .catch(err =>
        this.setState({
          loading: false,
          error: err
        })
      );
  };

  socialStrategies = {
    google: {
      isValid: res => res.hasOwnProperty("googleId") && res.googleId,
      getData: res => {
        let { email, name, imageUrl, googleId } = res.profileObj;
        let { accessToken } = res;
        return {
          email,
          name: name,
          avatarURL: imageUrl,
          accessToken,
          social: { id: googleId, type: "GOOGLE" }
        };
      },
      getBirthday: (accessToken, googleId) => {
        return axios
          .get(
            `https://people.googleapis.com/v1/people/${googleId}?personFields=birthdays`,
            {
              headers: {
                Authorization: "Bearer " + accessToken
              }
            }
          )
          .then(data => {
            if (data && data.data) {
              console.log(data.data.birthdays[0].date);
              let { year, month, day } = data.data.birthdays[0].date;
              return {
                birthday:
                  year && month && day
                    ? new Date(year, month - 1, day).toISOString()
                    : null
              };
            }
          });
      },
      errorMsg: "gg_login_failed"
    },
    facebook: {
      isValid: res => res.hasOwnProperty("userID") && res.userID,
      getData: res => {
        console.log(res);
        let { email, name, picture, userID, birthday } = res;
        let imageUrl = picture.data.url;
        return {
          email,
          name: name,
          avatarURL: imageUrl,
          birthday: birthday ? new Date(birthday).toISOString() : null,
          social: { id: userID, type: "FACEBOOK" }
        };
      },
      errorMsg: "fb_login_failed"
    }
  };

  handleSocialResponse = async (res, type) => {
    let strategy = this.socialStrategies[type];
    let { isValid, getData, errorMsg } = strategy;
    if (!isValid(res)) {
      console.log(type, res);
      this.setState({ error: errorMsg, loading: false });
    } else {
      let rawData = getData(res);
      let sendData = rawData;
      let birthday = null;
      if (type === "google") {
        try {
          birthday = await strategy.getBirthday(
            rawData.accessToken,
            rawData.social.id
          );
        } catch (error) {
          this.setState({ error: error, loading: false });
        }
        sendData = omit(rawData, "accessToken");
        sendData.birthday = birthday.birthday;
      }
      console.log(sendData);
      authApi
        .postSocial(sendData)
        .then(data => {
          console.log(data);
          authenCache.setAuthen(data.data.token, { expire: 1 });
          userInfo.setState(data.data.user).then(() => {
            console.log("[USER_STATE]", userInfo);
            this.props.onLoginSuccess();
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({ error: err, loading: false });
        });
    }
  };

  handleServerError = () => {
    const { error } = this.state;
    const { email } = this.form.getData();
    const message = error.message;
    let errMatcher = {
      account_not_found: "User is not registered yet.",
      network_error: "Database is ded",
      wrong_password: "Password is invalid.",
      gg_taken: `Email: ${email} has been linked to Google`,
      fb_taken: `Email: ${email} has been linked to Facebook`
    };
    return errMatcher.hasOwnProperty(message)
      ? errMatcher[message]
      : "Something bad happened.";
  };

  render() {
    let { onClose } = this.props;
    let canSubmit = this.form.isValid() && !this.state.loading;
    const emailForm = this.form.enhancedComponent(
      "email",
      ({ error, onChange, onEnter, ...other }) => (
        <InputBase
          autoFocus
          className="login-modal-input"
          error={error}
          id={"email"}
          onChange={e => {
            onChange(e);
          }}
          label="Email"
          type={"email"}
          placeholder={"abc@xyz.com"}
          onKeyDown={onEnter}
          {...other}
        />
      ),
      true
    );
    const passForm = this.form.enhancedComponent(
      "password",
      ({ error, onChange, onEnter, ...other }) => (
        <InputBase
          className="login-modal-input"
          error={error}
          id={"password"}
          onChange={e => {
            onChange(e);
          }}
          label="Password"
          type={"password"}
          onKeyDown={onEnter}
          {...other}
        />
      ),
      true
    );
    return (
      <div className="login-modal">
        <div className="modal-header">
          <div className="modal-title login-modal-header">
            <h2 className="login-modal-title">Login</h2>
            <p className="login-modal-subtitle">
              Connect with a social network
            </p>
            <LoginSocial
              handleClickSocialBtn={() => this.setState({ loading: true })}
              onResponse={this.handleSocialResponse}
            />
          </div>
          <i
            className="fas fa-times close-modal login-close-button"
            onClick={() => onClose()}
          />
        </div>
        <div className="modal-body">
          <p className="login-modal-subtitle">Log in with your email address</p>
          {this.state.error && (
            <div className="server-error">{this.handleServerError()}</div>
          )}
          {emailForm}
          {passForm}
          {this.state.loading ? <LoadingInline /> : null}
        </div>

        <div className="modal-footer justify-content-between login-modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              this.handleLogin();
            }}
            disabled={!canSubmit}
          >
            Log in
          </button>
          <Link
            className="login-modal-footer-link"
            to="/forgot-password"
            onClick={() => onClose()}
          >
            Forgot password
          </Link>
        </div>
      </div>
    );
  }
}

export const loginModal = {
  open(onLoginSuccess = null) {
    const modal = modals.openModal({
      content: (
        <LoginModal
          onClose={() => modal.close()}
          onLoginSuccess={() => {
            modal.close();
            onLoginSuccess && onLoginSuccess();
            console.log(userInfo.getState());
          }}
        />
      )
    });
    return modal.result;
  }
};
