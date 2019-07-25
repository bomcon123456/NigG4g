import React from "react";
import { KComponent } from "../KComponent";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { FacebookShareButton, PinterestShareButton } from "react-share";

import {
  FacebookSharingButton,
  PinterestSharingButton
} from "../../common/react/social-buttons/social-button";

import { userInfo } from "../../common/states/user-info";
import { postApi } from "../../common/api/common/post-api";
import { registerModal } from "../../common/react/modals/register/register";
import { timeDifference } from "../../common/utils/common-util";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { reportModal } from "../../common/react/modals/report/report";
import CommentSection from "../CommentSection/CommentSection";

class FullPost extends KComponent {
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
      error: null
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
    const { image460sv, image700 } = images;
    if (type === "Photo") {
      if (image700.width === image700.height) {
        this.pictureStyle = {
          width: 600,
          minHeight: 600
        };
      } else {
        this.pictureStyle = {
          width: 600,
          minHeight: (600 / image700.width) * image700.height
        };
      }
    } else if (type === "Animated") {
      if (image460sv.width === image460sv.height) {
        this.videoStyle = {
          minHeight: 600
        };
      } else if (image460sv.width > image460sv.height) {
        this.videoStyle = {
          minHeight: (600 / image460sv.width) * image460sv.height
        };
      } else {
        let realWidth = (640 / image460sv.height) * image460sv.width;
        this.videoStyle = {
          width: realWidth,
          minHeight: 640
        };
        this.videoContainerStyle = {
          paddingLeft: (600 - realWidth) / 2
        };
      }
    }
  }

  render() {
    const { post } = this.props;
    const { images, type, createdAt } = post;
    const { image700 } = images;
    const { downVoteCount, upVoteCount } = this.state;
    console.log(post);
    const time = timeDifference(new Date(createdAt));
    let media = (
      <div
        style={{
          margin: "0 auto",
          width: "600px"
        }}
      >
        <picture style={this.pictureStyle}>
          {image700.webpUrl ? (
            <source srcSet={image700.webpUrl} type="image/webp" />
          ) : null}
          <img src={image700.url} alt={post.name} style={this.pictureStyle} />
        </picture>
      </div>
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
      <article className={classnames("full-post")}>
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
          <h1>{post.title}</h1>
          <p className="post-meta">
            <Link to="/" className="post-meta__text">
              {upVoteCount - downVoteCount + " points"}
            </Link>
            {" · "}
            <Link to="/" className="post-meta__text">
              {post.comments.length + " comments"}
            </Link>
          </p>
        </header>
        <div className="full-post-after-bar">
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
          </ul>
          <div>
            <ul className="btn-vote left">
              <li>
                <FacebookShareButton url={"https://github.com"}>
                  <FacebookSharingButton text={"Facebook"} />
                </FacebookShareButton>
              </li>
              <li>
                <PinterestShareButton
                  url={"https://github.com"}
                  media={post.images.image700.url}
                >
                  <PinterestSharingButton text={"Pinterest"} />
                </PinterestShareButton>
              </li>
              <li>
                <div className="btn-border more" />
              </li>
            </ul>
            <div className="popup-viewshare hide">
              <ul>
                <li>Twitter</li>
                <li>Email</li>
                <li>Report</li>
                <li>I just don't like it</li>
              </ul>
            </div>
          </div>
          <div className="btn-next right">
            <span className="btn-next-body">Next Post</span>
            <span className="btn-next-arrow" />
          </div>
          <div className="clearfix" />
        </div>
        <div className="full-post-container">{media}</div>
        <div style={{ display: "flex", marginTop: "16px" }}>
          <FacebookShareButton
            url={"https://github.com"}
            style={{ flexGrow: "2", display: "flex" }}
          >
            <FacebookSharingButton
              text={"Share on Facebook"}
              height={44}
              fontSize={15}
              marginRight={8}
            />
          </FacebookShareButton>{" "}
          <PinterestShareButton
            url={"https://github.com"}
            media={post.images.image700.url}
            style={{ flexGrow: "2", display: "flex" }}
          >
            <PinterestSharingButton
              text={"Share on Pinterest"}
              height={44}
              fontSize={15}
            />
          </PinterestShareButton>
        </div>
        <div style={{ marginTop: "8px" }}>
          <p
            className="full-post-report-text"
            onClick={() => {
              const info = userInfo.getState();
              if (!info) {
                registerModal.open();
              } else {
                reportModal.open();
              }
            }}
          >
            REPORT
          </p>
        </div>

        <div className="full-post-comments">
          <div className="full-post-comments__top-bar">
            <div className="full-post-comments__cmts">{`${
              post.comments.length
            } Comments`}</div>
            <div className="full-post-comments__filter">
              <ul>
                <li
                  className={classnames({
                    active: true
                  })}
                >
                  Hot
                </li>
                <li
                  className={classnames({
                    active: false
                  })}
                >
                  Fresh
                </li>
              </ul>
            </div>
          </div>
          <div className="full-post-comments__content">
            <CommentSection
              postId={post._id}
              createdBy={post.createdBy.username}
            />
          </div>
        </div>
      </article>
    );
  }
}

export default FullPost;
