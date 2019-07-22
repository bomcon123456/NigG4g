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
          {this.form.enhancedComponent(
            "content",
            ({ error, onChange, onEnter, ...others }) => (
              <InputBase
                className="ci-input"
                inputType="text-area"
                error={error}
                id={"content"}
                type={"text"}
                placeholder={
                  isPostMemeful ? "Paste URL here" : "Write comments..."
                }
                onChange={e => {
                  onChange(e);
                }}
                maxLength="1000"
                {...others}
              />
            ),
            true
          )}
        </div>
        <div className="ci-action">
          <div className="action-left">
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
          </div>
          <div className="action-right">
            <p className="word-count">{1000 - text.length}</p>
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
