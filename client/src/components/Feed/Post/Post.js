import React from "react";
import { KComponent } from "../../KComponent";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { FacebookShareButton, PinterestShareButton } from "react-share";

import { userInfo } from "../../../common/states/user-info";
import { postApi } from "../../../common/api/common/post-api";
import { registerModal } from "../../../common/react/modals/register/register";
import { timeDifference } from "../../../common/utils/common-util";
import VideoPlayer from "../../../components/VideoPlayer/VideoPlayer";
import {
  FacebookSharingButton,
  PinterestSharingButton
} from "../../../common/react/social-buttons/social-button";

class Post extends KComponent {
  constructor(props) {
    super(props);

    const info = userInfo.getState();
    let currentVoteState = "";
    if (info) {
      const postId = this.props.post._id;
      let upIndex = info.upVotes.findIndex(each => each === postId);
      let downIndex = info.downVotes.findIndex(each => each === postId);
      if (upIndex !== -1) {
        currentVoteState = "UP";
      } else if (downIndex !== -1) {
        currentVoteState = "DOWN";
      }
    }

    this.state = {
      upVoteCount: this.props.post.upVoteCount,
      downVoteCount: this.props.post.downVoteCount,
      currentVote: currentVoteState,
      error: null,
      showMore: false
    };
    this.pictureStyle = {};
    this.videoStyle = {};
    this.videoContainerStyle = {};
    this.timeout = null;

    this.onUnmount(
      userInfo.onChange((newState, oldState) => {
        if (!newState) {
          this.setState({ currentVote: "" });
        } else if (!oldState) {
          const { upVotes, downVotes } = newState;
          const postId = this.props.post._id;
          let index = upVotes.findIndex(each => each === postId);
          if (index !== -1) {
            this.setState({ currentVote: "UP" });
          } else {
            index = downVotes.findIndex(each => each === postId);
            if (index !== -1) {
              this.setState({ currentVote: "DOWN" });
            }
          }
        }
      })
    );
  }

  handleVote = async upVote => {
    const info = userInfo.getState();
    if (!info) {
      registerModal.open(
        () => this.props.history.push("/"),
        () => {
          this.handleVote(upVote);
        }
      );
    } else {
      const { currentVote, upVoteCount, downVoteCount } = this.state;
      if (currentVote === "UP") {
        let upVoteC = upVoteCount - 1 < 0 ? 0 : upVoteCount - 1;
        if (upVote) {
          this.setState({ currentVote: "", upVoteCount: upVoteC });
        } else {
          let downVote = downVoteCount + 1;
          this.setState({
            currentVote: "DOWN",
            upVoteCount: upVoteC,
            downVoteCount: downVote
          });
        }
      } else if (currentVote === "DOWN") {
        let downVote = downVoteCount - 1 < 0 ? 0 : downVoteCount - 1;

        if (upVote) {
          let upVoteC = upVoteCount + 1;
          this.setState({
            currentVote: "UP",
            downVoteCount: downVote,
            upVoteCount: upVoteC
          });
        } else {
          this.setState({ currentVote: "", downVoteCount: downVote });
        }
      } else {
        if (upVote) {
          let upVoteC = upVoteCount + 1;
          this.setState({ currentVote: "UP", upVoteCount: upVoteC });
        } else {
          let downVote = downVoteCount + 1;
          this.setState({ currentVote: "DOWN", downVoteCount: downVote });
        }
      }
      let result = null;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        try {
          if (upVote) {
            result = await postApi.updateVotePost(this.props.post._id, 1);
          } else {
            result = await postApi.updateVotePost(this.props.post._id, 0);
          }
          let { upVoteCount, downVoteCount } = result.data;
          this.setState({
            upVoteCount: upVoteCount,
            downVoteCount: downVoteCount
          });
        } catch (err) {
          this.setState({ error: err });
        }
      }, 1000);
    }
  };

  componentWillMount() {
    const { post } = this.props;
    const { images, type } = post;
    const { image460, image460sv } = images;
    if (type === "Photo") {
      if (image460.width === image460.height) {
        this.pictureStyle = {
          minHeight: 500
        };
      } else {
        this.pictureStyle = {
          minHeight: (500 / image460.width) * image460.height
        };
      }
    } else if (type === "Animated") {
      if (image460sv.width === image460sv.height) {
        this.videoStyle = {
          minHeight: 500
        };
      } else if (image460sv.width > image460sv.height) {
        this.videoStyle = {
          minHeight: (500 / image460sv.width) * image460sv.height
        };
      } else {
        let realWidth = (500 / image460sv.height) * image460sv.width;
        this.videoStyle = {
          width: realWidth,
          height: 500,
          maxWidth: 500
        };
        this.videoContainerStyle = {
          paddingLeft: (500 - realWidth) / 2
        };
      }
    }
  }

  componentDidMount() {}

  render() {
    const { post, firstPost } = this.props;
    const { images, type, createdAt } = post;
    const { image460 } = images;
    const { downVoteCount, upVoteCount, showMore } = this.state;

    const time = timeDifference(new Date(createdAt));
    let media = (
      <picture style={this.pictureStyle}>
        {image460.webpUrl ? (
          <source srcSet={image460.webpUrl} type="image/webp" />
        ) : null}
        <img src={image460.url} alt={post.name} style={this.pictureStyle} />
      </picture>
    );
    if (type === "Animated") {
      media = (
        <VideoPlayer
          video={images}
          videoStyle={this.videoStyle}
          containerStyle={this.videoContainerStyle}
        />
      );
    }
    return (
      <article
        className={classnames("post", {
          "no-pd-t": firstPost
        })}
      >
        <header className="post-header">
          <div className="post-section">
            <img
              className="post-section__category-icon"
              src={post.categoryId.imageUrl}
              alt="category-icon"
            />
            <p className="post-section__message">
              <span>{post.categoryId.name}</span>
              {" · " + time}
            </p>
          </div>
          <h1
            className="linked-title"
            onClick={() => this.props.history.push(`/gag/${post._id}`)}
          >
            {post.title}
          </h1>
        </header>
        <div className="post-containter">{media}</div>
        <p className="post-meta">
          <Link to={`/gag/${post._id}`} className="post-meta__text">
            {upVoteCount - downVoteCount + " points"}
          </Link>
          {" · "}
          <Link to="/" className="post-meta__text">
            {post.comments.length + " comments"}
          </Link>
        </p>
        <div className="post-after-bar">
          <ul className="btn-vote left">
            <li>
              <div
                className={classnames("btn-border up", {
                  selected: this.state.currentVote === "UP"
                })}
                onClick={() => this.handleVote(true)}
              />
            </li>
            <li>
              <div
                className={classnames("btn-border down", {
                  selected: this.state.currentVote === "DOWN"
                })}
                onClick={() => this.handleVote(false)}
              />
            </li>
            <li>
              <div className="btn-border comment" />
            </li>
          </ul>
          <div>
            <ul className="btn-vote left">
              <li>
                <div
                  className="btn-border more"
                  onClick={() => {
                    this.setState((prevState, props) => ({
                      showMore: !prevState.showMore
                    }));
                  }}
                />
              </li>
            </ul>
            <div
              className={classnames("popup-viewshare", {
                hide: !showMore
              })}
            >
              <ul>
                <li>Twitter</li>
                <li>Email</li>
                <li>Report</li>
                <li>I just don't like it</li>
              </ul>
            </div>
          </div>
          <div className="btn-border share right">
            <ul>
              <li>
                <FacebookShareButton url={"https://github.com"}>
                  <FacebookSharingButton text={"Facebook"} />
                </FacebookShareButton>{" "}
              </li>
              <li>
                <PinterestShareButton
                  url={"https://github.com"}
                  media={post.images.image700.url}
                >
                  <PinterestSharingButton text={"Pinterest"} />
                </PinterestShareButton>
              </li>
            </ul>
          </div>
          <div className="clearfix" />
        </div>
      </article>
    );
  }
}

export default Post;
