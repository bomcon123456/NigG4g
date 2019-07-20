import React from "react";
import { KComponent } from "../KComponent";

import * as yup from "yup";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";


class Password extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: ""
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

  render() {
    console.log(this.props)
    return (
      <form id="setting-form">
        <h2>Password</h2>

        <div className="field">
          <label>New Password</label>
          <input type="password" name="new_password" maxLength="32" autoComplete="off" />
          {this.form.enhancedComponent(
            "newPassword",
            ({ error, onChange, ...other }) => (
              <InputBase
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
          <input type="password" name="new_password_repeat" maxLength="32" autoComplete="off" />
        </div>
        <div className="btn-setting-container">
          <input type="submit" value="Save Changes" />
        </div>
      </form>
    );
  }
}

export default Password;
