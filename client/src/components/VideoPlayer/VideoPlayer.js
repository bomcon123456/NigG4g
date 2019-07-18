import React, { Component } from "react";
import classnames from "classnames";
import { Waypoint } from "react-waypoint";

import { convertSecToMinSec } from "../../common/utils/common-util";

let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== "undefined") {
  // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

//@TODO: Video handle click: (show length, click to play when switch tab)
class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTime: true,
      showLength: true,
      playing: false,
      sound: false
    };
    this.videoElement = null;
    this.lengthTimeOut = null;
  }

  componentDidMount() {
    if (this.props.video.image460sv.hasAudio) {
      document.addEventListener(
        visibilityChange,
        this.handleVisibilityChange,
        false
      );
    }
  }

  handleVisibilityChange = () => {
    if (document[hidden]) {
      this.videoElement && this.videoElement.pause();
      this.setState({ showLength: true, firstTime: true, playing: false });
    }
  };

  componentWillUnmount() {
    clearTimeout(this.lengthTimeOut);
    if (this.props.video.image460sv.hasAudio) {
      document.removeEventListener(
        visibilityChange,
        this.handleVisibilityChange
      );
    }
  }

  handlePlay = () => {
    this.videoElement && this.videoElement.play();
    if (this.state.firstTime) {
      this.lengthTimeOut = setTimeout(() => {
        this.setState({ showLength: false });
      }, 2000);
    }
    this.setState({
      firstTime: false,
      playing: true
    });
  };

  handlePause = () => {
    this.videoElement && this.videoElement.pause();
    this.setState({ playing: false });
  };

  togglePlay = (hasAudio, playing) => {
    if (hasAudio && !this.state.firstTime) {
      this.toggleSound(this.state.sound);
    } else {
      if (playing) {
        this.handlePause();
      } else {
        this.handlePlay();
      }
    }
  };

  toggleSound = sound => {
    if (sound) {
      this.setState({ sound: false });
      this.videoElement.muted = true;
    } else {
      this.setState({ sound: true });
      this.videoElement.muted = false;
    }
  };

  render() {
    const { video, videoStyle, containerStyle } = this.props;
    const { hasAudio, duration } = video.image460sv;
    let length = convertSecToMinSec(duration);
    const { playing, sound } = this.state;

    return (
      <Waypoint
        onEnter={this.handlePlay}
        onLeave={this.handlePause}
        topOffset={"40%"}
        bottomOffset={"50%"}
      >
        <div style={containerStyle} className="video-player">
          <div className="video-container" style={videoStyle}>
            <video
              preload="auto"
              poster={video.image460.url ? video.image460.url : ""}
              loop="loop"
              style={videoStyle}
              autoPlay={playing === true}
              ref={element => (this.videoElement = element)}
              onClick={() => this.togglePlay(hasAudio, playing)}
              muted
            >
              {video.image460sv.vp9Url ? (
                <source src={video.image460sv.vp9Url} type="video/webm" />
              ) : null}
              {video.image460svwm && video.image460svwm.url ? (
                <source src={video.image460svwm.url} type="video/webm" />
              ) : null}
              {video.image460sv.h265Url ? (
                <source src={video.image460sv.h265Url} type="video/mp4" />
              ) : null}
              {video.image460sv.url ? (
                <source src={video.image460sv.url} type="video/mp4" />
              ) : null}
            </video>
            {hasAudio ? (
              <div
                className="sound-toggle"
                onClick={() => this.toggleSound(sound)}
              >
                <span
                  className={classnames({
                    on: sound === true,
                    off: sound === false
                  })}
                />
              </div>
            ) : null}
            {hasAudio ? (
              <p
                className={classnames("length", {
                  hide: !this.state.showLength
                })}
              >
                {length}
              </p>
            ) : null}
            <div
              className={classnames({
                hide: playing === true,
                presenting: playing === false
              })}
            >
              {!hasAudio ? (
                <span
                  className="play"
                  onClick={() => this.togglePlay(hasAudio, playing)}
                >
                  GIF
                </span>
              ) : null}
              {hasAudio ? (
                <span
                  className="playVideo"
                  onClick={() => this.togglePlay(hasAudio, playing)}
                >
                  Play
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Waypoint>
    );
  }
}

export default VideoPlayer;
