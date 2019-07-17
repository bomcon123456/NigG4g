import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { userInfo } from "../../../common/states/user-info";
import { postApi } from "../../../common/api/common/post-api";
import { registerModal } from "../../../common/react/modals/register/register";
import { timeDifference } from "../../../common/utils/common-util";
import VideoPlayer from "../../../components/VideoPlayer/VideoPlayer";

//@TODO: Render in client first
class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      upVoteCount: this.props.post.upVoteCount,
      downVoteCount: this.props.post.downVoteCount,
      error: null
    };
    this.pictureStyle = {};
    this.videoStyle = {};
    this.videoContainerStyle = {};
    this.timeout = null;
  }

  handleVote = async upVote => {
    console.log("lol");
    const info = userInfo.getState();
    if (!info) {
      registerModal.open(() => this.props.history.push("/"));
    } else {
      let result = null;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        try {
          if (upVote) {
            result = await postApi.updateVotePost(this.props.post._id, 1);
          } else {
            result = await postApi.updateVotePost(this.props.post._id, 0);
          }
          console.log(result);
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

  render() {
    const { post, firstPost } = this.props;
    const { images, type, createdAt } = post;
    const { image460 } = images;
    const { downVoteCount, upVoteCount } = this.state;

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
        <header>
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
        </header>
        <div className="post-containter">{media}</div>
        <p className="post-meta">
          <Link to="/" className="post-meta__text">
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
              <div className="up" onClick={() => this.handleVote(true)} />
            </li>
            <li>
              <div className="down" onClick={() => this.handleVote(false)} />
            </li>
            <li>
              <div className="comment" />
            </li>
          </ul>
          <div>
            <ul className="btn-vote left">
              <li>
                <div className="more" />
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
          <div className="clearfix" />
        </div>
      </article>
    );
  }
}

export default Post;
