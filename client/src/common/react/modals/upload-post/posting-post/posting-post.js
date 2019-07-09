import React, { Fragment } from "react";
import classnames from "classnames";
import * as yup from "yup";

import { KComponent } from "../../../../../components/KComponent";
import { modals } from "../../modals";
import { createFormWithValidator } from "../../../form-validator/form-validator";
import { InputBase } from "../../../input-base/input-base";
import { uploadPostModal } from "../upload-post";
import { getMetaTags } from "../../../../utils/common-util";
import { utilApi } from "../../../../api/common/util-api";

import { LoadingInline } from "../../../loading-inline/loading-inline";

export class PostingPostModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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

  handleBackClicked = () => {};

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errMatcher = {
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
      <div className={classnames("posting-post-modal")}>
        <Fragment>
          <div className="modal-header posting-post-modal-header no-border">
            <div className="modal-title ">
              <h4 className="modal-title-text">Give your post a title</h4>
              <p className="modal-subtitle-text">
                An accurate, descriptive title can help people discover your
                post.
              </p>
            </div>
            <i
              className="fas fa-times close-modal register-close-button"
              onClick={() => onClose()}
            />
          </div>
          <div className="modal-body posting-post-modal-body">
            {loading ? <LoadingInline /> : null}
            <div className="spacer">
              <div className="field post-info" />
            </div>

            {this.state.error && (
              <div className="server-error">{this.handleServerError()}</div>
            )}
          </div>
          <div className="modal-footer posting-post-modal-footer no-border">
            <button
              className="btn btn-secondary"
              onClick={this.handleBackClicked}
            >
              Back
            </button>
            <button className="btn btn-primary" disabled={!false}>
              {loading ? "Loading" : "Next"}
            </button>
          </div>
        </Fragment>
      </div>
    );
  }
}

export const postingPostModal = {
  open(handlePost, url) {
    const modal = modals.openModal({
      content: (
        <PostingPostModal
          onClose={() => modal.close()}
          onPostSuccess={() => {
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
