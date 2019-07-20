import React from "react";
import { KComponent } from "../KComponent";

import * as yup from "yup";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";

import { userInfo } from "../../common/states/user-info"
import { userApi } from "../../common/api/common/user-api";


class Password extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      data: userInfo.getState()
    };
    this.passwordSchema = yup.object().shape({
      currentPassword: yup
        .string()
        .min(6, "Password must be at least 6-char long.")
        .required("Password should not be empty"),
      newPassword: yup
        .string()
        .min(6, "New password must be at least 6-char long.")
        .required("New password should not be empty"),
      comfirmNewPassword: yup
        .string()
        .equalTo(yup.ref("newPassword"), "New password must match")
        .required("Confirmed new password should not be empty"),
    });

    this.form = createFormWithValidator(this.passwordSchema, {
      initData: {
        currentPassword: "",
        newPassword: "",
        comfirmNewPassword: ""
      }
    });
    this.onUnmount(this.form.on("change", () => this.forceUpdate()));

    this.form.validateData();
  }

  handleChangePassword = (e) => {
    const { currentPassword, newPassword } = this.form.getData();
    userApi
      .putChangePassword({ currentPassword: currentPassword, newPassword: newPassword })
      .then(res => {
        if (res.data.message === "changed_password_successfully" || res.data.message === "changed_password_the_1st_time_successfully") {
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
  }

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errorMatcher = {
      network_error: "Database is ded.",
      user_validation_faied: "Password is not valid.",
      incorrect_password: "Current password is wrong",
      account_not_found: "This user is not valid."
    };
    return errorMatcher.hasOwnProperty(message)
      ? errorMatcher[message]
      : "Something bad happened.";
  };


  render() {
    console.log(userInfo.getState())
    return (
      <form id="setting-form">
        <h2>Password</h2>
        {((this.state.data.social.length === 1 && this.state.data.isChangePassword)
          || (this.state.data.social.length !== 1))
          && (
            <div className="field">
              <label>Current Password</label>
              {this.form.enhancedComponent(
                "currentPassword",
                ({ error, onChange, ...other }) => (
                  <InputBase
                    maxLength="32"
                    className=""
                    error={error}
                    onChange={e => {
                      onChange(e)
                    }}
                    type={"password"}
                  />
                ),
                true
              )}
            </div>
          )}


        <div className="field">
          <label>New Password</label>
          {this.form.enhancedComponent(
            "newPassword",
            ({ error, onChange, ...other }) => (
              <InputBase
                maxLength="32"
                className=""
                error={error}
                onChange={e => {
                  onChange(e)
                }}
                type={"password"}
              />
            ),
            true
          )}
        </div>
        <div className="field">
          <label>Re-type New Password</label>
          {this.form.enhancedComponent(
            "comfirmNewPassword",
            ({ error, onChange, ...other }) => (
              <InputBase
                maxLength="32"
                className=""
                error={error}
                onChange={e => {
                  onChange(e)
                }}
                type={"password"}
              />
            ),
            true
          )}
        </div>
        {this.state.error && (
          <div className="field">
            <div className="server-error">{this.handleServerError()}</div>
          </div>
        )}
        <div className="btn-setting-container">
          <button className="my-blue-button" disabled={this.state.loading} onClick={this.handleChangePassword}>Save Changes</button>
        </div>
      </form>
    );
  }
}

export default Password;
