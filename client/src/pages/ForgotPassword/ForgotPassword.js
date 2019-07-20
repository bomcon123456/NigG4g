import React from "react";
import * as yup from "yup";
import debounce from "lodash/debounce";

import { KComponent } from "../../components/KComponent";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";
import Layout from "../../hoc/Layout/Layout";

import { userApi } from "../../common/api/common/user-api";

export default class ForgotPassword extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      checking: false,
      loading: false,
      validated: false,
      sentPassword: false,
      error: ""
    };

    this.forgotPasswordSchema = yup.object().shape({
      email: yup
        .string()
        .email("Email is not valid.")
        .required("Email should not be null.")
    });

    this.form = createFormWithValidator(this.forgotPasswordSchema, {
      initData: {
        email: ""
      }
    });
    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => this.handleForgotPassword()));
    this.form.validateData();
  }

  handleForgotPassword = () => {
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

  checkEmailExisted = email => {
    this.setState({ loading: true });
    userApi
      .checkEmail({ email })
      .then(res => {
        console.log(res);
        if (res.data.message === "account_found") {
          this.setState({
            error: "",
            checking: false,
            loading: false,
            validated: true
          });
        } else if (res.data.message === "account_not_found") {
          this.setState({
            error: { message: "account_not_found" },
            checking: false,
            loading: false,
            validated: false
          });
        } else {
          this.setState({
            error: { message: "bad_error" },
            checking: false,
            loading: false,
            validated: false
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          checking: false,
          loading: false,
          validated: false
        });
      });
  };

  debounceCheckEmailExisted = debounce(this.checkEmailExisted, 1500);

  handleServerError = () => {
    const { error } = this.state;
    const { email } = this.form.getData();
    const message = error.message;
    let errorMatcher = {
      account_not_found: `Email ${email} is not used for any user!`,
      network_error: "Database is ded"
    };
    return errorMatcher.hasOwnProperty(message)
      ? errorMatcher[message]
      : "Something bad happened.";
  };

  handleChange = email => {
    if (!this.state.checking) {
      this.setState({ checking: true });
    }
    this.setState({ error: "", email });
    if (this.forgotPasswordSchema.isValidSync({ email })) {
      console.log("Start querying");
      this.debounceCheckEmailExisted(email);
    } else {
      this.setState({ loading: false });
    }
  };

  render() {
    const isSubmittable =
      this.form.getPathData("email") !== "" &&
      this.state.error === "" &&
      !this.state.checking &&
      !this.state.loading &&
      this.state.validated;
    return (
      <Layout>
        <div className="forgot-password-page">
          <h1 className="forgot-password-title">Forgot Password</h1>
          {this.state.sentPassword ? (
            <div className="forgot-password-res">
              <p className="forgot-password-res-text">
                You should receive an email shortly.
              </p>
              <p className="forgot-password-res-text">
                If you still need assistance, contant me.
              </p>
            </div>
          ) : (
            <div className="forgot-password-action">
              <div className="forgot-password-form">
                {this.form.enhancedComponent(
                  "email",
                  ({ error, onChange, onEnter, ...others }) => (
                    <InputBase
                      className="forgot-password-input"
                      error={error}
                      success={this.state.validated}
                      id={"email"}
                      onKeyDown={onEnter}
                      onChange={e => {
                        const email = e.target.value;
                        onChange(e);
                        this.handleChange(email);
                      }}
                      type="email"
                      label={"Your email address"}
                      placeholder={"name@email.com"}
                      icon={
                        this.state.loading ? (
                          <i className="fas fa-spinner spin" />
                        ) : null
                      }
                      {...others}
                    />
                  ),
                  true
                )}
                {this.state.error && (
                  <div className="server-error">{this.handleServerError()}</div>
                )}
              </div>
              <button
                className="btn btn-primary"
                disabled={!isSubmittable}
                onClick={this.handleForgotPassword}
              >
                Send Information
              </button>
            </div>
          )}
        </div>
      </Layout>
    );
  }
}
