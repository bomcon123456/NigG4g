import React, { Fragment } from "react";
import omit from "lodash/omit";
import debounce from "lodash/debounce";
import axios from "axios";
import classnames from "classnames";

import { KComponent } from "../../../../components/KComponent";
import { modals } from "../modals";
import { registerSchema } from "./schema";
import { createFormWithValidator } from "../../form-validator/form-validator";
import { InputBase } from "../../input-base/input-base";
import { LoadingInline } from "../../loading-inline/loading-inline";
import { loginModal } from "../login/login";
import { LoginSocial } from "../login-social/login-social";

import { userApi } from "../../../api/common/user-api";
import { authApi } from "../../../api/common/auth-api";
import { authenCache } from "../../../cache/authen-cache";
import { userInfo } from "../../../states/user-info";

const MODALTYPE = {
  INITIAL: "initial",
  SIGNUP: "signup"
};

export class RegisterModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalType: MODALTYPE.INITIAL,
      checking: false,
      validated: false,
      loading: false,
      loadingRegister: false,
      error: null
    };

    this.form = null;
  }

  checkEmailExisted = email => {
    userApi
      .checkEmail({ email })
      .then(res => {
        console.log(res);
        if (res.data.message === "account_not_found") {
          this.setState({
            error: "",
            checking: false,
            loading: false,
            validated: true
          });
        } else if (res.data.message === "account_found") {
          this.setState({
            error: { message: "account_found" },
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

  debounceCheckEmailExisted = debounce(this.checkEmailExisted, 2000);

  handleChange = email => {
    if (!this.state.checking) {
      this.setState({ checking: true });
    }
    this.setState({ error: "", email });
    if (
      registerSchema.isValidSync({
        username: "testonly",
        email: email,
        password: "testonly"
      })
    ) {
      console.log("eee");
      this.setState({ loading: true });
      console.log("Start querying");
      this.debounceCheckEmailExisted(email);
    } else {
      this.setState({ loading: false });
    }
  };

  prepareRegisterForm = () => {
    this.setState({ modalType: MODALTYPE.SIGNUP });
    this.form = createFormWithValidator(registerSchema, {
      initData: {
        username: "",
        email: "",
        password: ""
      }
    });
    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => this.handleLogin()));
    this.form.validateData();
  };

  handleRegister = () => {
    const { username, email, password } = this.form.getData();
    this.setState({ loadingRegister: true });
    userApi
      .post({
        username: username,
        email: email,
        password: password
      })
      .then(data => {
        authenCache.setAuthen(data.data.token, { expire: 1 });
        userInfo.setState(data.data.user).then(() => {
          this.props.onRegisterSuccess();
        });
      })
      .catch(err =>
        this.setState({
          loadingRegister: false,
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
          username: name,
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
        let { email, name, picture, userID, birthday } = res;
        let imageUrl = picture.data.url;
        return {
          email,
          username: name,
          avatarURL: imageUrl,
          birthday: birthday ? new Date(birthday).toISOString() : null,
          social: { id: userID, type: "FACEBOOK" }
        };
      },
      errorMsg: "fb_login_failed"
    }
  };

  handleSocialResponse = async (res, type) => {
    console.log(type, res);
    let strategy = this.socialStrategies[type];
    let { isValid, getData, errorMsg } = strategy;
    if (!isValid(res)) {
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
            this.props.onRegisterSuccess();
          });
        })
        .catch(err => this.setState({ error: err, loading: false }));
    }
  };

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errMatcher = {
      account_found: "This email has been used for another user.",
      network_error: "Database is ded."
    };
    return errMatcher.hasOwnProperty(message)
      ? errMatcher[message]
      : "Something bad happened.";
  };

  render() {
    let { onClose, onRegisterSuccess } = this.props;
    let { modalType, loading, loadingRegister, validated } = this.state;
    const isSignup = modalType === MODALTYPE.SIGNUP;
    let isSubmittable = false;
    if (isSignup) {
      isSubmittable =
        validated && !loading && this.form.getInvalidPaths().length === 0;
    }
    const initialModalBody = (
      <Fragment>
        <div className="modal-header">
          <div className="modal-title register-modal-header">
            <h2 className="register-modal-title">Hey there!</h2>
            <p className="register-modal-subtitle">
              9GAG is your best source for fun. Share anything you find
              interesting, get real responses from people all over the world,
              and discover what makes you laugh.
            </p>
            <LoginSocial
              className="mb-2"
              handleClickSocialBtn={() => this.setState({ loading: true })}
              onResponse={this.handleSocialResponse}
            />
          </div>
          <i
            className="fas fa-times close-modal register-close-button"
            onClick={() => onClose()}
          />
        </div>
        <div className="modal-footer register-modal-footer">
          <p className="register-modal-subtitle">
            Sign up with your{" "}
            <span
              className="register-text-link"
              onClick={() => {
                this.prepareRegisterForm();
              }}
            >
              Email Address
            </span>
          </p>
          <p className="register-modal-subtitle">
            Have an account?{" "}
            <span
              className="register-text-link"
              onClick={() => {
                onClose();
                loginModal.open(this.props.handleLogin);
              }}
            >
              Login
            </span>
          </p>
        </div>
      </Fragment>
    );
    const registerModalBody = isSignup ? (
      <Fragment>
        <div className="modal-header">
          <div className="modal-title register-modal-header">
            <h2 className="register-modal-title">Become a member</h2>
          </div>
          <i
            className="fas fa-times close-modal register-close-button"
            onClick={() => onClose()}
          />
        </div>
        <div className="modal-body">
          {this.form.enhancedComponent(
            "username",
            ({ error, onChange, onEnter, ...other }) => (
              <InputBase
                className="login-modal-input"
                error={error}
                id={"username"}
                onChange={e => {
                  onChange(e);
                }}
                label="Username"
                type={"text"}
                {...other}
              />
            ),
            true
          )}
          {this.form.enhancedComponent(
            "email",
            ({ error, onChange, onEnter, ...others }) => (
              <InputBase
                className="forgot-password-input"
                autoFocus
                error={error}
                success={this.state.validated}
                id={"email"}
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
          {this.form.enhancedComponent(
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
          )}
          {this.state.error && (
            <div className="server-error">{this.handleServerError()}</div>
          )}
          {loadingRegister ? <LoadingInline /> : null}
        </div>

        <div className="modal-footer justify-content-between register-modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!isSubmittable}
            onClick={() => {
              this.handleRegister();
            }}
          >
            Register
          </button>
        </div>
      </Fragment>
    ) : null;

    return (
      <div
        className={classnames(
          "register-modal",
          isSignup ? "register-modal-longer" : null
        )}
      >
        {isSignup ? registerModalBody : initialModalBody}
      </div>
    );
  }
}

export const registerModal = {
  open(handleRegister, handleLogin = null) {
    const modal = modals.openModal({
      content: (
        <RegisterModal
          onClose={() => modal.close()}
          handleLogin={handleLogin}
          onRegisterSuccess={() => {
            modal.close();
            handleRegister();
            console.log(userInfo.getState());
          }}
        />
      )
    });
    return modal.result;
  }
};
