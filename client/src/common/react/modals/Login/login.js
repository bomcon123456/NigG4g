import React from "react";
import { modals } from "../modals";
import { KComponent } from "../../../../components/KComponent";
import { createFormWithValidator } from "../../form-validator/form-validator";
import { accountSchema } from "./schema";
import { InputBase } from "../../input-base/input-base";
import { LoadingInline } from "../../loading-inline/loading-inline";
import { authApi } from "../../../api/common/auth-api";
import { userApi } from "../../../api/common/user-api";
import { authenCache } from "../../../cache/authen-cache";
import { userInfo } from "../../../states/user-info";

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
    const message = error.response.data.message;
    console.log(message);
    let errMatcher = {
      account_not_found: "User is not registered yet."
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
          error={error}
          id={"password"}
          onChange={e => {
            console.log(e);
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
          <div className="modal-title">Login</div>
          <i className="fas fa-times close-modal" onClick={() => onClose()} />
        </div>
        <div className="modal-body">
          {this.state.error && (
            <div className="server-error">{this.handleServerError()}</div>
          )}{" "}
          {emailForm}
          {passForm}
          {this.state.loading ? <LoadingInline /> : null}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              this.handleLogin();
            }}
            disabled={!canSubmit}
          >
            OK
          </button>
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
