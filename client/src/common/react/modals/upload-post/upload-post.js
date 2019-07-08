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

import trollface from "../../../../assets/img/trollface.png";

export class UploadPostModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      uploadError: null,
      error: null
    };

    const schema = yup.object().shape({
      picture: yup.mixed().required("Picture must not be empty")
    });

    this.form = createFormWithValidator(schema, {
      initData: {}
    });
    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => this.handlePost()));
    this.form.validateData();
    this.buttonOnClick = null;
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
          <div className="modal-header upload-header">
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
          <div className="modal-body upload-modal-body">
            {/* <LoadingInline /> */}
            <div className="spacer">
              <div className="upload-image" onClick={this.buttonOnClick}>
                <i className="fas fa-file-upload upload-icon" />
                <p className="upload-image-text">Drop image to upload or</p>
                {this.form.enhancedComponent(
                  "picture",
                  ({ error, onChange, value, ...other }) => (
                    <UploadButton
                      renderBtn={({ onClick }) => {
                        this.buttonOnClick = onClick;
                        return (
                          <button
                            className="btn btn-primary btn-bold-text"
                            onClick={onClick}
                          >
                            Choose file...
                          </button>
                        );
                      }}
                      onError={error => {
                        this.setState({
                          uploadError: error
                        });
                      }}
                      onChange={files => {
                        onChange(files);
                        console.log(files);
                      }}
                      value={value}
                      isUploadImage
                    />
                  )
                )}
              </div>
              <div className="other-source justify-content-center">
                <div className="upload-image-url">
                  <i class="fas fa-image" />
                  <p>Paste image URL</p>
                </div>
                <div className="upload-image-url">
                  <i class="fas fa-play-circle" />
                  <p>Paste Video URL</p>
                </div>
                <div className="upload-image-url">
                  <img src={trollface} alt="Trollface" />
                  <p>Make meme</p>
                </div>
              </div>
            </div>
          </div>
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
