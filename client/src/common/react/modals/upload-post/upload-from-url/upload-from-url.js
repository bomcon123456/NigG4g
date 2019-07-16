import React, { Fragment } from "react";
import classnames from "classnames";
import * as yup from "yup";
import debounce from "lodash/debounce";

import { KComponent } from "../../../../../components/KComponent";
import { modals } from "../../modals";
import { createFormWithValidator } from "../../../form-validator/form-validator";
import { InputBase } from "../../../input-base/input-base";
import { uploadPostModal } from "../upload-post";
import { getMetaTags } from "../../../../utils/scrapper-util";
// import { getMetaTags } from "../../../../utils/common-util";
// import { utilApi } from "../../../../api/common/util-api";
import { postingPostModal } from "../posting-post/posting-post";

import { LoadingInline } from "../../../loading-inline/loading-inline";

export class UploadFromUrlModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      validUrl: false,
      validPic: false,
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
      scrapper_failed: "Cannot extract image from this url.",
      invalid_picture: "Unsupported image",
      network_error: "Database is ded."
    };
    return errMatcher.hasOwnProperty(message)
      ? errMatcher[message]
      : "Something bad happened.";
  };

  // Go to older commit like (23d0384021277a62add16122f1fd1e979b8d5f99) to see LinkPreview Logic
  handleFileChanged = () => {
    if (this.form.isValid()) {
      const url = this.form.getData("url");
      console.log(url);
      var pattern = new RegExp(
        "^(https?:\\/\\/)?" +
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
          "((\\d{1,3}\\.){3}\\d{1,3}))" +
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
          "(\\?[;&a-z\\d%_.~+=-]*)?" +
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );
      if (pattern.test(url.url)) {
        this.setState({
          loading: true
        });
        getMetaTags(url.url)
          .then(data => {
            console.log(data);
            if (data.error) {
              const error = new Error("invalid_url");
              throw error;
            }
            const { video, image, message } = data;
            let sendData = {
              type: "",
              src: ""
            };
            if (message === "valid_picture") {
              sendData = { type: "Photo", src: image.url };
              this.handleLoadSuccess(sendData);
            } else if (message === "valid_video") {
              sendData = {
                type: "Animated",
                src: video.url
              };
              this.handleLoadSuccess(sendData);
            } else {
              const error = new Error("bad_error");
              this.handleLoadFailed(error);
            }
          })
          .catch(err => {
            this.handleLoadFailed(err);
          });
      }
    }
  };

  debounceCheckFileChanged = debounce(this.handleFileChanged, 1000);

  handleLoadSuccess = data => {
    this.setState({
      loading: false,
      error: null,
      validUrl: true,
      validPic: true
    });
    this.props.onClose();
    postingPostModal.open(this.props.onUploadSuccess, data, null, true);
  };

  handleLoadFailed = e => {
    // console.log(e);
    this.setState({
      loading: false,
      error: { message: "invalid_url" },
      validUrl: false,
      validPic: false
    });
  };

  handleBackClicked = () => {
    this.props.onClose();
    uploadPostModal.open(
      this.props.onUploadSuccess,
      this.state.validUrl ? this.form.getPathData("url") : ""
    );
  };

  render() {
    let { onClose } = this.props;
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
                    this.setState({ error: null });
                    this.debounceCheckFileChanged();
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

export const uploadFromUrlModal = {
  open(handlePost, url) {
    const modal = modals.openModal({
      content: (
        <UploadFromUrlModal
          onClose={() => modal.close()}
          onUploadSuccess={redirect => {
            modal.close();
            handlePost(redirect);
          }}
          url={url}
        />
      )
    });
    return modal.result;
  }
};
