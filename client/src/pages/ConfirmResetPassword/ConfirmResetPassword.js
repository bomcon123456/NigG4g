import React from "react";
import * as yup from "yup";

import { KComponent } from "../../components/KComponent";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";
import Layout from "../../hoc/Layout/Layout";

import { userApi } from "../../common/api/common/user-api";

import logo from "../../assets/img/logo.png";

export default class ForgotPassword extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: ""
    };

    const search = new URLSearchParams(this.props.location.search);
    this.token = search.get("token");

    this.passwordSchema = yup.object().shape({
      password: yup
        .string()
        .min(6, "Password must be at least 6-char long.")
        .required("Password should not be empty"),
      confirmPassword: yup
        .string()
        .equalTo(yup.ref("password"), "Passwords must match")
        .required("Confirmed password should not be empty")
    });

    this.form = createFormWithValidator(this.passwordSchema, {
      initData: {
        password: "",
        confirmPassword: ""
      }
    });
    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => this.handleForgotPassword()));
    this.form.validateData();
    console.log(this.props);
  }

  handleResetPassword = () => {
    const { password } = this.form.getData();
    console.log(this.token);
    this.setState({ error: "", loading: true });
    userApi
      .postUpdatePassword({ password: password, token: this.token })
      .then(res => {
        if (res.data.message === "change_password_successfully") {
          this.setState({ loading: false });
          this.props.history.push("/");
        } else {
          this.setState({
            error: { message: "bad_error" },
            loading: false
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          loading: false
        });
      });
  };

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errorMatcher = {
      network_error: "Database is ded.",
      user_validation_faied: "Password is not valid.",
      token_expired: "Reset password token is expired.",
      account_not_found: "This user is not valid."
    };
    return errorMatcher.hasOwnProperty(message)
      ? errorMatcher[message]
      : "Something bad happened.";
  };

  render() {
    return (
      <Layout>
        <div className="reset-password-page">
          <div className="row">
            <div className="col-md-12">
              <div className="logo-center">
                <img src={logo} alt="Logo" height="125" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 col-center-block">
              <div className="reset-pw-form-title">
                <h3>Reset Password</h3>
              </div>
              <div className="form-group">
                <p className="help-block">
                  Enter your new password for your account
                </p>
              </div>
              <div className="form-group">
                {this.form.enhancedComponent(
                  "password",
                  ({ error, onChange, onEnter, ...others }) => (
                    <InputBase
                      className="reset-password-input"
                      autoFocus
                      error={error}
                      id={"password"}
                      onChange={e => {
                        onChange(e);
                      }}
                      type="password"
                      label={"New password"}
                      {...others}
                    />
                  ),
                  true
                )}
              </div>
              <div className="form-group">
                {this.form.enhancedComponent(
                  "confirmPassword",
                  ({ error, onChange, onEnter, ...others }) => (
                    <InputBase
                      className="reset-password-input"
                      error={error}
                      id={"confirmPassword"}
                      onKeyDown={onEnter}
                      onChange={e => {
                        onChange(e);
                      }}
                      type="password"
                      label={"Confirm new password"}
                      {...others}
                    />
                  ),
                  true
                )}
              </div>
              {this.state.error && (
                <div className="server-error">{this.handleServerError()}</div>
              )}
              <div className="btn-container">
                <button
                  className="btn btn-primary"
                  disabled={this.state.loading}
                  onClick={this.handleResetPassword}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
