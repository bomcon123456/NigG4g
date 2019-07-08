import React, { Fragment } from "react";
import mql from "@microlink/mql";
import classnames from "classnames";
import * as yup from "yup";

import { KComponent } from "../../../../../components/KComponent";
import { modals } from "../../modals";
import { createFormWithValidator } from "../../../form-validator/form-validator";
import { InputBase } from "../../../input-base/input-base";
import { uploadPostModal } from "../upload-post";
// import { LoadingInline } from "../../../loading-inline/loading-inline";
// import { checkUrlImg } from "../../../../utils/common-util";

// import { authenCache } from "../../../../cache/authen-cache";
// import { userInfo } from "../../../../states/user-info";
// import UploadButton from "../../../upload-btn/upload-btn";

export class UploadFromUrlModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      validUrl: false,
      error: null
    };

    const schema = yup.object().shape({
      url: yup.string().url("This must be a valid links")
    });

    this.form = createFormWithValidator(schema, {
      initData: {
        url: this.props.url ? this.props.url : ""
      }
    });
    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => this.handlePost()));
    this.form.validateData();
  }

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errMatcher = {
      invalid_url: "Invalid URL.",
      network_error: "Database is ded."
    };
    return errMatcher.hasOwnProperty(message)
      ? errMatcher[message]
      : "Something bad happened.";
  };

  handleFileChanged = () => {
    const url = this.form.getData("url");
    console.log(url.url);
    mql(url.url)
      .then(data => {
        console.log(data);
      })
      .catch(err => console.log(err));
  };

  // handleLoadSuccess = () => {
  //   this.setState({ loading: false, error: null, validUrl: true });
  // };
  // handleLoadFailed = e => {
  //   // console.log(e);
  //   this.setState({
  //     loading: false,
  //     error: { message: "invalid_url" },
  //     validUrl: false
  //   });
  // };
  handleBackClicked = () => {
    uploadPostModal.open(
      this.props.onUploadSuccess,
      this.state.validUrl ? this.form.getPathData("url") : ""
    );
    this.props.onClose();
  };

  render() {
    let { onClose, onUploadSuccess } = this.props;
    const formValid = this.form.isValid();
    let { url } = this.form.getData();
    let { loading, validUrl, error } = this.state;
    const isSubmittable = !loading && validUrl && error === null;
    return (
      <div className={classnames("uploadurl-modal")}>
        <Fragment>
          <div className="modal-header uploadurl-modal-header no-border">
            <div className="modal-title ">
              <h4 className="modal-title-text">Upload from URL</h4>
              <p className="modal-subtitle-text">Type or paste Image URL</p>
            </div>
            <i
              className="fas fa-times close-modal register-close-button"
              onClick={() => onClose()}
            />
          </div>
          <div className="modal-body uploadurl-modal-body">
            {/* <LoadingInline /> */}
            {this.form.enhancedComponent(
              "url",
              ({ error, onChange, onEnter, ...other }) => (
                <InputBase
                  className="uploadurl-modal-input"
                  error={error}
                  id={"url"}
                  placeholder="http://"
                  onChange={e => {
                    onChange(e);
                    this.handleFileChanged();
                  }}
                  type={"url"}
                  {...other}
                />
              ),
              true
            )}{" "}
            {this.state.error && (
              <div className="server-error">{this.handleServerError()}</div>
            )}
          </div>
          <div className="modal-footer uploadurl-modal-footer no-border">
            <button
              className="btn btn-secondary"
              onClick={this.handleBackClicked}
            >
              Back
            </button>
            <button className="btn btn-primary" disabled={!isSubmittable}>
              Next
            </button>
          </div>
        </Fragment>
      </div>
    );
  }
}

export const uploadFromUrlModal = {
  open(handlePost, url) {
    const modal = modals.openModal({
      content: (
        <UploadFromUrlModal
          onClose={() => modal.close()}
          onUploadSuccess={() => {
            modal.close();
            handlePost();
          }}
          url={url}
        />
      )
    });
    return modal.result;
  }
};
