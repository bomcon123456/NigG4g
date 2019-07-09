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
      description: yup.string().max(280, "Description should not be too long")
    });

    this.charLeft = 280;
    this.tagArrays = [];
    this.tagInputRef = null;
    this.attributeRef = null;

    this.form = createFormWithValidator(schema, {
      initData: {
        description: ""
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
      network_error: "Database is ded.",
      invalid_tag:
        "Oops! Tags can contain alphanumerics, numbers and spaces only!"
    };
    return errMatcher.hasOwnProperty(message)
      ? errMatcher[message]
      : "Something bad happened.";
  };

  handleTagInput = () => {
    // console.log(e.key);
    const text = this.tagInputRef.value;
    if (this.tagArrays.length <= 2) {
      const tag = text.slice(0, text.length);
      if (tag.length >= 1) {
        if (/^[a-zA-Z0-9]+$/.test(tag)) {
          console.log(text);
          this.tagArrays.push(tag);
          this.tagInputRef.value = "";
          this.forceUpdate();
        } else {
          this.setState({ error: { message: "invalid_tag" } });
        }
      }
    }
  };

  handleSpecialKey = e => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      this.handleTagInput();
    }
  };

  render() {
    let { onClose, onPostSuccess } = this.props;
    let { loading } = this.state;
    return (
      <div
        className={classnames("posting-post-modal", {
          longer: !!this.state.error
        })}
      >
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
            {this.state.error && (
              <div className="server-error pb-2">
                {this.handleServerError()}
              </div>
            )}
            <div className="spacer">
              <div className="field post-info">
                <div className="preview">
                  <img src={this.props.url} alt="Preview" />
                </div>
                <textarea
                  type="text"
                  className="description"
                  placeholder="Describe your post..."
                  minLength="5"
                  maxLength="280"
                  onChange={e => {
                    this.charLeft = 280 - +e.target.value.length;
                    this.forceUpdate();
                  }}
                />
                <p className="count">{this.charLeft}</p>
              </div>
              <div className="field tag">
                <label>Tag</label>
                <div className="scroll-container">
                  <div className="tag-list">
                    {this.tagArrays.map((each, i) => (
                      <span
                        key={each.toString() + i.toString()}
                        className="tag-item"
                      >
                        {each}
                        <i
                          className="fas fa-times close-modal"
                          onClick={() => {
                            this.tagArrays.splice(i, 1);
                            this.forceUpdate();
                          }}
                        />
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder={
                      this.tagArrays.length <= 0 ? "tag1, tag2, tag3" : null
                    }
                    onChange={() => this.setState({ error: "" })}
                    onKeyDown={this.handleSpecialKey}
                    disabled={this.tagArrays.length >= 3}
                    ref={element => (this.tagInputRef = element)}
                  />
                </div>
              </div>
              <div className="field checkbox">
                <label>
                  <p>This is sensitive</p>
                  <input type="checkbox" />
                </label>
              </div>
              <div
                className={classnames("field checkbox", {
                  last: !(this.attributeRef && this.attributeRef.checked)
                })}
              >
                <label>
                  <p>Attribute original poster</p>
                  <input
                    type="checkbox"
                    onChange={() => {
                      console.log(this.attributeRef.checked);
                      this.forceUpdate();
                    }}
                    ref={element => (this.attributeRef = element)}
                  />
                </label>
              </div>
              {this.attributeRef && this.attributeRef.checked ? (
                <div className="field textbox last">
                  <input type="url" placeholder="http://" />
                </div>
              ) : null}
            </div>
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
