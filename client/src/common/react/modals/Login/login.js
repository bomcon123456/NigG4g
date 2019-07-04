import React from "react";
import { modals } from "../modals";
import { KComponent } from "../../../../components/KComponent";
import { createFormWithValidator } from "../../form-validator/form-validator";
import { accountSchema } from "./schema";
import { InputBase } from "../../input-base/input-base";
import { LoadingInline } from "../../loading-inline/loading-inline";
import { authApi } from "../../../api/common/auth-api";
import { authenCache } from "../../../cache/authen-cache";
import { userInfo } from "../../../states/user-info";
import { Link } from "react-router-dom";
import {
  FacebookLoginButton,
  GoogleLoginButton
} from "../../social-buttons/social-button";

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
          console.log(userInfo);
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

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errMatcher = {
      account_not_found: "User is not registered yet.",
      network_error: "Database is ded",
      wrong_password: "Password is invalid."
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
      ({ error, onChange, value }) => (
        <InputBase
          className="login-modal-input"
          error={error}
          id={"email"}
          onChange={e => {
            onChange(e);
          }}
          label="Email"
          type={"email"}
          placeholder={"abc@xyz.com"}
        />
      ),
      true
    );
    const passForm = this.form.enhancedComponent(
      "password",
      ({ error, onChange, value }) => (
        <InputBase
          className="login-modal-input"
          error={error}
          id={"password"}
          onChange={e => {
            onChange(e);
          }}
          label="Password"
          type={"password"}
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
            <div className="login-modal-social-auth-container">
              <FacebookLoginButton
                text="Facebook"
                onClick={() => console.log("facebook")}
              />
              <GoogleLoginButton
                text="Google"
                onClick={() => console.log("google")}
              />
            </div>
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
          <Link className="login-modal-footer-link" to="/">
            Forgot password
          </Link>
        </div>
      </div>
    );
  }
}

export const loginModal = {
  open() {
    const modal = modals.openModal({
      content: (
        <LoginModal
          onLoginSuccess={() => {
            modal.close();
            console.log(userInfo.getState());
          }}
        />
      )
    });
    return modal.result;
  }
};
