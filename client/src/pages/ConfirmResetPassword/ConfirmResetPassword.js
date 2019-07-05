import React from "react";
import * as yup from "yup";

import { KComponent } from "../../components/KComponent";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";
import { userApi } from "../../common/api/common/user-api";
import Layout from "../../hoc/Layout/Layout";

export default class ForgotPassword extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: ""
    };

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
  }

  handleResetPassword = () => {
    let { email } = this.state;
    this.setState({ error: "", loading: true });
    userApi
      .postForgotPassword({ email })
      .then(res => {
        if (res.data.message === "reset_email_sent") {
          this.setState({ sentPassword: true, loading: false });
        } else {
          this.setState({
            error: { message: "bad_error" },
            loading: false,
            sentPassword: true
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

  handleServerResponse = () => {
    const { error } = this.state;
    const message = error.message;
    let errorMatcher = {
      network_error: "Database is ded"
    };
    return errorMatcher.hasOwnProperty(message)
      ? errorMatcher[message]
      : "Something bad happened.";
  };

  render() {
    return (
      <Layout>
        <div className="forgot-password-page" />
      </Layout>
    );
  }
}
