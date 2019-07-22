import React, { Fragment } from "react";
import * as yup from "yup";

import { KComponent } from "../KComponent";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";
import UploadButton from "../../common/react/upload-btn/upload-btn";

class CommentInput extends KComponent {
  constructor(props) {
    super(props);

    this.state = {
      uploadError: "",
      isPostMemeful: false,
      textError: "",
      loading: false
    };

    const schema = yup.object().shape({
      content: yup
        .string()
        .min(10, "Comment should be at least 10-char long.")
        .max(1000, "Comment should not "),
      url: yup.string().url("This should be a Freaking memeful URL"),
      picture: yup.mixed().notRequired()
    });
    this.form = createFormWithValidator(schema, {
      initData: {
        content: "",
        picture: null
      }
    });

    this.onUnmount(this.form.on("change", () => this.forceUpdate()));
    this.onUnmount(this.form.on("enter", () => null));
    this.form.validateData();
  }

  handlePostComment = () => {
    console.log("lol");
  };

  render() {
    let text = this.form.getPathData("content");
    const { isPostMemeful } = this.state;
    return (
      <Fragment>
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
        <div className="ci-action">
          <div className="action-left">
            {!isPostMemeful ? (
              <Fragment>
                <a
                  href="https://memeful.com/"
                  className="icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => this.setState({ isPostMemeful: true })}
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
                        onChange(files);
                        // this.handlePost(files);
                      }}
                      value={value}
                    />
                  )
                )}
              </Fragment>
            ) : (
              <div
                className="cancel-text"
                onClick={() => this.setState({ isPostMemeful: false })}
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
