import React, { Component } from "react";

import classnames from "classnames";

class FocusedImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      width: props.width
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const { onDismiss, type, src } = this.props;
    return (
      <div
        className={classnames(
          "focused-image",
          this.props.hidden ? "focused-image-hidden" : ""
        )}
        onClick={onDismiss}
      >
        <div className="image-overlay" onClick={onDismiss}>
          <div className="close-button">
            <i className="fas fa-times close-modal" onClick={onDismiss} />
          </div>

          <div className="image-content" onClick={onDismiss}>
            {type === "Photo" ? (
              <img
                className={classnames(
                  this.state.width < 780 ? "img-hidden" : null
                )}
                src={src ? src : "https://i.imgur.com/Piw0UWw.jpg?fb"}
                alt="Focused One"
                onClick={onDismiss}
              />
            ) : (
              <video
                className={classnames(
                  this.state.width < 780 ? "img-hidden" : null
                )}
                src={src ? src : "https://i.imgur.com/miLScZY.mp4"}
                alt="Focused One"
                autoPlay
                loop
                muted
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FocusedImage;
