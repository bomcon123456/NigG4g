import React, { Component } from "react";
import classnames from "classnames";
import { Waypoint } from "react-waypoint";

//@TODO: Video handle click: (show length, click to play when switch tab)
class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      sound: false
    };
    this.videoElement = null;
  }

  handlePlay = () => {
    this.videoElement && this.videoElement.play();
    this.setState({
      playing: true
    });
  };

  handlePause = () => {
    this.videoElement && this.videoElement.pause();
    this.setState({ playing: false });
  };

  togglePlay = (hasAudio, playing) => {
    if (playing) {
      this.handlePause();
    } else {
      this.handlePlay();
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
    const { hasAudio } = video.image460sv;

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
              {video.image460sv.h265Url ? (
                <source src={video.image460sv.h265Url} type="video/mp4" />
              ) : null}
              {video.image460sv.url ? (
                <source src={video.image460sv.url} type="video/mp4" />
              ) : null}
            </video>
            {hasAudio && (
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
            )}
            {hasAudio && <p className="length">0:30</p>}
            <div
              className={classnames({
                hide: playing === true,
                presenting: playing === false
              })}
            >
              {!hasAudio && <span className="play">GIF</span>}
              {hasAudio && (
                <span
                  className="playVideo"
                  onClick={() => this.togglePlay(hasAudio, playing)}
                >
                  Play
                </span>
              )}
            </div>
          </div>
        </div>
      </Waypoint>
    );
  }
}

export default VideoPlayer;
