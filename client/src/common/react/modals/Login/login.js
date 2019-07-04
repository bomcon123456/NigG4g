import React from "react";
import { modals } from "../modals";
import { KComponent } from "../../../../components/KComponent";
import { createFormWithValidator } from "../../form-validator/form-validator";
import { accountSchema } from "./schema";
import { InputBase } from "../../input-base/input-base";

export class LoginModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
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

  render() {
    let { onClose } = this.props;
    let canSubmit = this.form.isValid() && !this.state.loading;
    return (
      <div className="login-modal">
        <div className="modal-header">
          <div className="modal-title">Login</div>
          <i className="fas fa-times close-modal" onClick={() => onClose()} />
        </div>
        <div className="modal-body">
          {this.form.enhancedComponent(
            "email",
            ({ error, onChange, value }) => (
              <InputBase
                error={error}
                id={"email"}
                onChange={e => {
                  console.log(e);
                  onChange(e);
                }}
                label="Email"
                type={"text"}
                placeholder={"abc@xyz.com"}
              />
            ),
            true
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onClose()}
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
      content: <LoginModal onClose={() => modal.close()} />
    });
    return modal.result;
  }
};
