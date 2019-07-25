import React from "react";
import { KComponent } from "../KComponent";
import debounce from "lodash/debounce";

import * as yup from "yup";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";
import { userInfo } from "../../common/states/user-info"
import { userApi } from "../../common/api/common/user-api";

import Selector from "./Selector/Selector"


class Account extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: userInfo.getState(),
      optionMaskNSFW: userInfo.getState().maskNSFW,
      optionShowNSFW: userInfo.getState().showNSFW,
      email: "",
      checkingUsername: false,
      checkingEmail: false,
      loadingUsername: false,
      loadingEmail: false,
      error: "",
      loading: false
    };

    this.accountSchema = yup.object().shape({
      newUsername: yup
        .string()
        .min(4, "Username must be at least 6-char long.")
        .max(15, "Username max length is 15."),
      newEmail: yup
        .string()
        .email("Email is not valid.")
        .required("Email should not be null."),
    });


    this.form = createFormWithValidator(this.accountSchema, {
      initData: {
        newUsername: this.state.data.username,
        newEmail: this.state.data.email,
      }
    });

    this.onUnmount(this.form.on("change", () => this.forceUpdate()));

    this.form.validateData();
  }

  handleUpdateAccount = (e) => {
    const { newUsername, newEmail } = this.form.getData();
    const newShowNSFW = this.state.optionShowNSFW;
    const newMaskNSFW = this.state.optionMaskNSFW;
    userApi
      .updateAccount({ newUsername, newEmail, newShowNSFW, newMaskNSFW })
      .then(res => {
        if (res.data.message === "update_account_successfully") {
          this.setState({ loading: false });
          this.props.history.push("/");
        } else {
          this.setState({
            error: { message: "bad_error" },
            loading: false,
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

  handleChangeUsername = username => {
    if (!this.state.checkingUsername) {
      this.setState({ checkingUsername: true });
    }
    this.setState({ error: "", newUsername: username });
    console.log(username)
    if (this.accountSchema.isValidSync({ newUsername: username, newEmail: this.state.data.email })) {

      this.debounceCheckUsernameExisted(username);
    } else {
      this.setState({ loadingUsername: false });
    }
  };

  checkUsernameExisted = username => {
    console.log("imasd")

    const currentUsername = userInfo.getState().username;
    if (currentUsername === username) return;
    this.setState({ loadingUsername: true });
    userApi
      .checkUsername({ username })
      .then(res => {
        console.log(res);
        if (res.data.message === "account_found") {
          this.setState({
            error: { message: "user_account_found" },
            checkingUsername: false,
            loadingUsername: false,
          });
        } else if (res.data.message === "account_not_found") {
          this.setState({
            error: "",
            checkingUsername: false,
            loadingUsername: false,
          });
        } else {
          this.setState({
            error: { message: "bad_error" },
            checkingUsername: false,
            loadingUsername: false,
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          checkingUsername: false,
          loadingUsername: false,
        });
      });
  };

  handleChangeEmail = email => {
    if (!this.state.checkingEmail) {
      this.setState({ checkingEmail: true });
    }
    this.setState({ error: "", newEmail: email });
    if (this.accountSchema.isValidSync({ newEmail: email, newUsername: this.state.data.username })) {
      console.log("Start querying");
      this.debounceCheckEmailExisted(email);
    } else {
      this.setState({ loadingEmail: false });
    }
  };


  checkEmailExisted = email => {
    const currentEmail = userInfo.getState().email;
    if (email === currentEmail) return;
    this.setState({ loadingEmail: true });
    userApi
      .checkEmail({ email })
      .then(res => {
        console.log(res);
        if (res.data.message === "account_found") {
          this.setState({
            error: { message: "email_account_found" },
            checkingEmail: false,
            loadingEmail: false,
          });
        } else if (res.data.message === "account_not_found") {
          this.setState({
            error: "",
            checkingEmail: false,
            loadingEmail: false,
          });
        } else {
          this.setState({
            error: { message: "bad_error" },
            checkingEmail: false,
            loadingEmail: false,
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          checkingEmail: false,
          loadingEmail: false,
        });
      });
  };
  debounceCheckUsernameExisted = debounce(this.checkUsernameExisted, 500);
  debounceCheckEmailExisted = debounce(this.checkEmailExisted, 500);

  handleSelectorMaskNSFW = (e) => {
    this.setState({
      optionMaskNSFW: e.target.value
    })
    console.log(this.state.optionMaskNSFW)
  }

  handleSelectorShowNSFW = (e) => {
    this.setState({
      optionShowNSFW: e.target.value
    })
  }

  handleServerError = () => {
    const { error } = this.state;
    const { newEmail } = this.form.getData();
    const { newUsername } = this.form.getData();
    const message = error.message;
    let errorMatcher = {
      email_account_found: `Email ${newEmail} have been used `,
      network_error: "Database is ded",
      user_account_found: `Username ${newUsername} have been used `,
      account_not_found: "This user is not valid.",

    };
    return errorMatcher.hasOwnProperty(message)
      ? errorMatcher[message]
      : "Something bad happened.";
  };

  render() {

    console.log(this.form.getInvalidPaths())

    const isSubmittable =
      this.form.getInvalidPaths().length === 0 &&
      this.state.error === "" &&
      !this.state.checking &&
      !this.state.loading &&
      !this.state.loadingEmail &&
      !this.state.loadingUsername;
    console.log(this.state.data)
    console.log(this.state)
    return (
      <form id="setting-form">
        <h2>Account</h2>

        <div className="field">
          {this.state.error && (
            <div className="server-error">{this.handleServerError()}</div>
          )}
        </div>
        <div className="field width440px">
          <label>Username</label>
          {this.form.enhancedComponent(
            "newUsername",
            ({ error, onChange, onEnter, ...others }) => (
              <InputBase
                maxLength="15"
                className=""
                error={error}
                onChange={e => {
                  const username = e.target.value;
                  onChange(e);
                  this.handleChangeUsername(username);
                }}
                onKeyDown={onEnter}
                type={"text"}
                icon={
                  this.state.loadingUsername ? (
                    <i className="fas fa-spinner spin" />
                  ) : null
                }
                {...others}

              />
            ),
            true
          )}
          <p className="tips">https://9gag.com/u/{this.state.data.username}</p>
        </div>
        <div className="field width440px">
          <label>Email</label>
          {this.form.enhancedComponent(
            "newEmail",
            ({ error, onChange, onEnter, ...others }) => (
              <InputBase
                maxLength="200"
                className=""
                error={error}
                id={"email"}
                onKeyDown={onEnter}
                onChange={e => {
                  const email = e.target.value;
                  onChange(e);
                  this.handleChangeEmail(email);
                }}
                type={"email"}
                icon={
                  this.state.loadingEmail ? (
                    <i className="fas fa-spinner spin" />
                  ) : null
                }
                {...others}
              />
            ),
            true
          )}
          <p className="tips">Email will not be displayed publicly</p>
        </div>
        <div className="field">
          <label>Mask Sensitive Content</label>
          <Selector name="saveMode" optionValue={this.state.optionMaskNSFW} handleSelector={this.handleSelectorMaskNSFW} />
        </div>
        <div className="field">
          <label>Show Sensitive Content</label>
          <Selector name="nsfwMode" optionValue={this.state.optionShowNSFW} handleSelector={this.handleSelectorShowNSFW} />
        </div>

        <div className="btn-setting-container">
          <button className="my-blue-button" disabled={!isSubmittable} onClick={this.handleUpdateAccount}>Save Changes</button>
        </div>
      </form>
    );
  }
}

export default Account;
