import React, { Component, Fragment } from "react";
import { getBase64 } from "../../utils/common-util";

class UploadButton extends Component {
  constructor(props) {
    super(props);
    // isMultiple = 0: upload single file
    // isMultiple = 1: upload multiple file
    this.isMultiple = this.props.isMultiple;
    this.isUploadImage = this.props.isUploadImage;
    this.state = {};
    this.inputElement = null;
  }

  handleImageUpload = e => {
    e.preventDefault();
    const files = [...e.target.files];
    e.target.value = "";
    if (this.isMultiple) {
      let { value: currentImages, onChange, onError, limit = 2 } = this.props;
      if (files.length + currentImages.length >= limit) {
        onError("Reach maximum amount of images (" + limit + " files)!");
        return;
      }
      let promises = [];
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file && file.type.indexOf("image") > -1) {
          promises.push(
            getBase64(file).then(base64File => {
              if (
                !currentImages.find(
                  each => each.file.name === base64File.file.name
                )
              ) {
                return base64File;
              } else {
                onError(
                  <span>
                    Skip file{" "}
                    <span style={{ color: "#189eff" }}>
                      {base64File.file.namme}
                    </span>{" "}
                    because it has been uploaded.
                  </span>
                );
                return null;
              }
            })
          );
        }
      }
      Promise.all(promises).then(data => {
        onChange(currentImages.concat(data.filter(each => each !== null)));
      });
    } else {
      const file = files[0];
      if (file && file.type.indexOf("image") > -1) {
        let { value: currentImage, onChange, onError } = this.props;
        getBase64(file)
          .then(base64File => {
            if (
              !currentImage ||
              (currentImage && currentImage.file.name !== base64File.file.name)
            ) {
              return base64File;
            } else {
              onError(
                <span>
                  File{" "}
                  <span style={{ color: "#189eff" }}>
                    {base64File.file.namme}
                  </span>{" "}
                  is the same as the one you uploaded.
                </span>
              );
              return null;
            }
          })
          .then(data => {
            if (data) {
              onChange(data);
            }
          });
      }
    }
  };

  handleVideoUpload = e => {};

  render() {
    let { renderBtn, onError } = this.props;
    return (
      <Fragment>
        {renderBtn({
          onClick: () => {
            this.inputElement.click();
            onError(null);
          }
        })}
        <input
          className="upload-input"
          type="file"
          onChange={
            this.isUploadImage ? this.handleImageUpload : this.handleVideoUpload
          }
          accept={this.isUploadImage ? "image/*" : "video/*"}
          style={{ width: 0, height: 0 }}
          ref={element => (this.inputElement = element)}
          multiple={this.isMultiple}
          name={this.isUploadImage ? "uploadImg" : "uploadVid"}
        />
      </Fragment>
    );
  }
}

export default UploadButton;