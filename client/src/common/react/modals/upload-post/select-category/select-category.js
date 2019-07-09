import React, { Fragment } from "react";
import classnames from "classnames";
import * as yup from "yup";

import { KComponent } from "../../../../../components/KComponent";
import { modals } from "../../modals";
import { InputBase } from "../../../input-base/input-base";
import { uploadPostModal } from "../upload-post";

import { LoadingInline } from "../../../loading-inline/loading-inline";

export class SelectCategoryModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    };
  }

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errMatcher = {
      invalid_url: "Invalid URL.",
      invalid_picture: "Unsupported image",
      network_error: "Database is ded."
    };
    return errMatcher.hasOwnProperty(message)
      ? errMatcher[message]
      : "Something bad happened.";
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
            {loading ? <LoadingInline /> : null}
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
              {loading ? "Loading" : "Next"}
            </button>
          </div>
        </Fragment>
      </div>
    );
  }
}

export const selectCategoryModal = {
  open(handlePost, data) {
    const modal = modals.openModal({
      content: (
        <SelectCategoryModal
          onClose={() => modal.close()}
          onUploadSuccess={() => {
            modal.close();
            handlePost();
          }}
          data={data}
        />
      )
    });
    return modal.result;
  }
};
