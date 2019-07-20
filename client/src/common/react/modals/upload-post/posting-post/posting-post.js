import React, { Fragment } from "react";
import classnames from "classnames";

import { KComponent } from "../../../../../components/KComponent";

import { modals } from "../../modals";
import { uploadPostModal } from "../upload-post";
import FocusedImage from "../../../../react/focused-image/focused-image";
import { selectCategoryModal } from "../select-category/select-category";

export class PostingPostModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      focusingImage: false,
      error: null
    };

    this.charLeft = 280;
    this.tagArrays = this.props.savedData ? this.props.savedData.tags : [];
    this.descriptionRef = null;
    this.tagInputRef = null;
    this.sensitiveRef = null;
    this.attributeRef = null;
    this.attributeLinkRef = null;
    this.savedData = { ...this.props.savedData };
  }

  handleBackClicked = () => {
    this.props.onClose();
    uploadPostModal.open(this.props.onPostSuccess);
  };

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errMatcher = {
      network_error: "Database is ded.",
      invalid_tag:
        "Oops! Tags can contain alphanumerics, numbers and spaces only!",
      invalid_description:
        "Boost your post with a funny, creative and descriptive title!"
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
        if (/^[a-zA-Z0-9 ]+$/.test(tag)) {
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

  validateBeforePost() {
    if (!this.descriptionRef) {
      return false;
    }
    const description = this.descriptionRef.value;
    if (description.length <= 3) {
      this.setState({ error: { message: "invalid_description" } });
      return false;
    }
    if (this.tagInputRef.value.length >= 1) {
      this.handleTagInput();
      return false;
    }
    if (!this.state.error) {
      return true;
    }
    return false;
  }

  handleNextButton() {
    const length = this.tagArrays ? this.tagArrays.length : 0;
    const isValidated = this.validateBeforePost();
    if (isValidated || (!isValidated && this.tagArrays.length > length)) {
      const data = {
        title: this.descriptionRef.value,
        url: this.props.fromUrl
          ? this.props.dataFromPreviousModal.src
          : this.props.file.src,
        type: this.props.dataFromPreviousModal.type,
        file: this.props.file,
        tags: this.tagArrays,
        nsfw: this.sensitiveRef.checked,
        attributeLink: this.attributeRef.checked
          ? this.attributeLinkRef.value
          : "",
        category: this.props.savedData ? this.props.savedData.category : null
      };
      console.log(data);
      this.props.onClose();
      selectCategoryModal.open(this.props.onPostSuccess, data);
    }
  }

  render() {
    let { onClose, dataFromPreviousModal } = this.props;
    let { focusingImage } = this.state;
    return (
      <div
        className={classnames("posting-post-modal", {
          "posting-post-modal-longer":
            !!this.state.error ||
            (this.attributeRef && this.attributeRef.checked) ||
            (!this.attributeRef &&
              this.savedData &&
              this.savedData.attributeLink)
        })}
      >
        <FocusedImage
          hidden={!focusingImage}
          onDismiss={() => this.setState({ focusingImage: false })}
          type={dataFromPreviousModal.type}
          src={dataFromPreviousModal.src}
        />
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
            {this.state.error && (
              <div className="server-error pb-2">
                {this.handleServerError()}
              </div>
            )}
            <div className="spacer">
              <div className="field post-info">
                <div
                  className="preview"
                  onClick={() => this.setState({ focusingImage: true })}
                >
                  {dataFromPreviousModal.type === "Photo" ? (
                    <img src={dataFromPreviousModal.src} alt="Preview" />
                  ) : (
                    <video src={dataFromPreviousModal.src} muted />
                  )}
                </div>
                <textarea
                  type="text"
                  className="description"
                  placeholder="Describe your post..."
                  minLength="5"
                  maxLength="280"
                  onChange={e => {
                    this.charLeft = 280 - +e.target.value.length;
                    this.setState({ error: null });
                  }}
                  ref={element => (this.descriptionRef = element)}
                  defaultValue={this.savedData ? this.savedData.title : ""}
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
                    onChange={() => {
                      this.setState({ error: null });
                    }}
                    onKeyDown={this.handleSpecialKey}
                    disabled={this.tagArrays.length >= 3}
                    ref={element => (this.tagInputRef = element)}
                  />
                </div>
              </div>
              <div className="field checkbox">
                <label>
                  <p>This is sensitive</p>
                  <input
                    type="checkbox"
                    ref={element => (this.sensitiveRef = element)}
                    defaultChecked={
                      this.savedData ? this.savedData.nsfw : false
                    }
                  />
                </label>
              </div>
              <div
                className={classnames("field checkbox", {
                  last: !(
                    (this.attributeRef === null &&
                      this.savedData &&
                      this.savedData.attributeLink) ||
                    (this.attributeRef && this.attributeRef.checked)
                  )
                })}
              >
                <label>
                  <p>Attribute original poster</p>
                  <input
                    type="checkbox"
                    onChange={() => {
                      this.forceUpdate();
                    }}
                    ref={element => (this.attributeRef = element)}
                    defaultChecked={
                      this.savedData ? !!this.savedData.attributeLink : false
                    }
                  />
                </label>
              </div>
              {(this.attributeRef === null &&
                this.savedData &&
                this.savedData.attributeLink) ||
              (this.attributeRef && this.attributeRef.checked) ? (
                <div className="field textbox last">
                  <input
                    type="url"
                    placeholder="http://"
                    ref={element => (this.attributeLinkRef = element)}
                    defaultValue={
                      this.savedData ? this.savedData.attributeLink : ""
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="modal-footer posting-post-modal-footer no-border">
            <button
              className="btn btn-secondary"
              onClick={() => this.handleBackClicked()}
            >
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => this.handleNextButton()}
            >
              Next
            </button>
          </div>
        </Fragment>
      </div>
    );
  }
}

export const postingPostModal = {
  open(
    handlePost,
    dataFromPreviousModal,
    file = null,
    fromUrl = false,
    savedData = null
  ) {
    const modal = modals.openModal({
      content: (
        <PostingPostModal
          onClose={() => modal.close()}
          onPostSuccess={redirect => {
            modal.close();
            handlePost(redirect);
          }}
          file={file}
          fromUrl={fromUrl}
          dataFromPreviousModal={dataFromPreviousModal}
          savedData={savedData}
        />
      )
    });
    return modal.result;
  }
};
