import React, { Fragment } from "react";
import classnames from "classnames";
import * as yup from "yup";

import { KComponent } from "../../../../components/KComponent";
import { modals } from "../modals";
import { createFormWithValidator } from "../../form-validator/form-validator";
import { InputBase } from "../../input-base/input-base";
import { LoadingInline } from "../../loading-inline/loading-inline";

import { authenCache } from "../../../cache/authen-cache";
import { userInfo } from "../../../states/user-info";
import UploadButton from "../../upload-btn/upload-btn";

export class UploadPostModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    };

    const schema = yup.object().shape({});

    this.form = createFormWithValidator(schema, {
      initData: {}
    });
    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => this.handlePost()));
    this.form.validateData();
  }

  handlePost = () => {};

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
    let { onClose, onPostSuccess } = this.props;
    let { loading } = this.state;

    return (
      <div className={classnames("upload-post-modal")}>
        <Fragment>
          <div className="modal-header">
            <div className="modal-title upload-modal-header">
              <h4 className="upload-modal-title">Upload a Post</h4>
              <p className="upload-modal-subtitle">
                Choose how you want to upload the post
              </p>
            </div>
            <i
              className="fas fa-times close-modal register-close-button"
              onClick={() => onClose()}
            />
          </div>
          <div className="modal-body">
            {/* <LoadingInline /> */}
            <UploadButton
              onError={err => console.log(err)}
              onChange={data => console.log(data)}
              isUploadImage
              renderBtn={({ onClick }) => (
                <button className="btn btn-primary" onClick={onClick}>
                  Choose image
                </button>
              )}
            />
          </div>

          <div className="modal-footer justify-content-between register-modal-footer" />
        </Fragment>
      </div>
    );
  }
}

export const uploadPostModal = {
  open(handlePost) {
    const modal = modals.openModal({
      content: (
        <UploadPostModal
          onClose={() => modal.close()}
          onPostSuccess={() => {
            modal.close();
            handlePost();
          }}
        />
      )
    });
    return modal.result;
  }
};
