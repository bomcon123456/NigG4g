import React, { Fragment } from "react";
import * as yup from "yup";

import { KComponent } from "../KComponent";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";
import UploadButton from "../../common/react/upload-btn/upload-btn";
import ImagePreview from "../ImagePreview/ImagePreview";
import { utilApi } from "../../common/api/common/util-api";
import { postApi } from "../../common/api/common/post-api";

class CommentInput extends KComponent {
  constructor(props) {
    super(props);

    this.state = {
      uploadError: null,
      isPostMemeful: false,
      imagePreviewSrc: "",
      loadingPreview: false
    };

    const schema = yup.object().shape({
      content: yup
        .string()
        .min(5, "Comment should be at least 5-char long.")
        .max(1000, "Comment should not longer than 1000 characters."),
      url: yup
        .string()
        .notRequired()
        .url("This should be a Freaking memeful URL.")
        .matches(/memeful\.com/),
      picture: yup.mixed().notRequired()
    });
    this.form = createFormWithValidator(schema, {
      initData: {
        content: "",
        picture: null,
        url: ""
      }
    });

    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => null));
    this.form.validateData();
  }

  handleServerError = () => {
    const { uploadError } = this.state;
    const message = uploadError.message;
    let errMatcher = {
      invalid_picture: "Unsupported dimension",
      network_error: "Database is ded."
    };
    return errMatcher.hasOwnProperty(message)
      ? errMatcher[message]
      : "Something bad happened.";
  };

  handlePostComment = () => {
    let sendData = new FormData();
    let { content, picture, url } = this.form.getData();
    console.log(url);
    sendData.append("content", content);
    sendData.append("file", picture ? picture.file : null);
    sendData.append("imageUrl", url ? url : "");
    postApi
      .postComment(this.props.postId, sendData)
      .then(response => {
        console.log(response);
        this.form.resetData();
        this.setState({
          uploadError: null,
          isPostMemeful: false,
          imagePreviewSrc: "",
          loadingPreview: false
        });
      })
      .catch(err => this.setState({ error: err }));
  };

  handleFileChange = async (file, defaultOnChange) => {
    this.setState({ loadingPreview: true, uploadError: null });
    let sendData = new FormData();
    sendData.append("file", file.file);
    try {
      const response = await utilApi.getCommentPreview(sendData);
      if (response) {
        const { data } = response;
        this.setState({ imagePreviewSrc: data.data, loadingPreview: false });
        defaultOnChange(file);
      }
    } catch (err) {
      this.setState({
        uploadError: err,
        imagePreviewSrc: "",
        loadingPreview: false
      });
    }
  };

  render() {
    let text = this.form.getPathData("content");
    const {
      isPostMemeful,
      imagePreviewSrc,
      loadingPreview,
      uploadError
    } = this.state;
    let invalidForms = this.form.getInvalidPaths();
    let isFormInvalid = false;
    if (isPostMemeful) {
      isFormInvalid = invalidForms.findIndex(each => each === "url") !== -1;
    } else {
      isFormInvalid = invalidForms.findIndex(each => each === "content") !== -1;
    }
    let isDisable = loadingPreview || uploadError !== null || isFormInvalid;
    return (
      <Fragment>
        {uploadError && (
          <div className="error-notice-message">
            <p>{this.handleServerError()}</p>
            <i
              className="fas fa-times"
              onClick={() => this.setState({ uploadError: "" })}
            />
          </div>
        )}
        <div className="ci-textarea-container">
          {!isPostMemeful
            ? this.form.enhancedComponent(
                "content",
                ({ error, onChange, onEnter, ...others }) => (
                  <InputBase
                    className="ci-input"
                    inputType="text-area"
                    error={error}
                    id={"content"}
                    type={"text"}
                    placeholder={"Write comments..."}
                    onChange={e => {
                      onChange(e);
                    }}
                    maxLength="1000"
                    {...others}
                  />
                ),
                true
              )
            : this.form.enhancedComponent(
                "url",
                ({ error, onChange, onEnter, ...others }) => (
                  <InputBase
                    className="ci-input"
                    error={error}
                    id={"url"}
                    type={"url"}
                    placeholder={"Paste URL here"}
                    onChange={e => {
                      onChange(e);
                    }}
                    {...others}
                  />
                ),
                true
              )}
        </div>
        {loadingPreview || imagePreviewSrc ? (
          <div className="ci-image-container">
            <div className="image-prev-container">
              <ImagePreview
                src={imagePreviewSrc}
                onClose={() => {
                  this.setState({ imagePreviewSrc: "" });
                }}
              />
            </div>
          </div>
        ) : null}
        <div className="ci-action">
          <div className="action-left">
            {!isPostMemeful ? (
              <Fragment>
                <a
                  href="https://memeful.com/"
                  className="icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    this.form.resetData();
                    this.setState({ isPostMemeful: true });
                  }}
                >
                  <i className="far fa-grin" />
                </a>
                {this.form.enhancedComponent(
                  "picture",
                  ({ error, onChange, value, ...other }) => (
                    <UploadButton
                      renderBtn={({ onClick }) => {
                        return (
                          <i className="fas fa-camera icon" onClick={onClick} />
                        );
                      }}
                      onError={error => {
                        this.setState({
                          uploadError: error
                        });
                      }}
                      onChange={files => {
                        this.handleFileChange(files, () => onChange(files));
                        // this.handlePost(files);
                      }}
                      uploadImageOnly
                      value={value}
                    />
                  )
                )}
              </Fragment>
            ) : (
              <div
                className="cancel-text"
                onClick={() => {
                  this.form.resetData();
                  this.setState({ isPostMemeful: false });
                }}
              >
                Cancel
              </div>
            )}
          </div>
          <div className="action-right">
            {!isPostMemeful ? (
              <p className="word-count">{1000 - text.length}</p>
            ) : null}
            <button
              className="btn btn-primary post-btn"
              onClick={this.handlePostComment}
              disabled={isDisable}
            >
              Post
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CommentInput;
