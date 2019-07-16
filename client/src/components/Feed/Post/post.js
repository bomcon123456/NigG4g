import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { timeDifference } from "../../../common/utils/common-util";

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.pictureStyle = {};
    this.videoStyle = {};
    this.videoContainerStyle = {};
  }

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
    const { image460, image460sv } = images;
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
        <div style={this.videoContainerStyle}>
          <video
            preload="auto"
            poster={image460.url ? image460.url : ""}
            loop="loop"
            style={this.videoStyle}
          >
            {image460sv.vp9Url ? (
              <source src={image460sv.vp9Url} type="video/webm" />
            ) : null}
            {image460sv.h265Url ? (
              <source src={image460sv.h265Url} type="video/mp4" />
            ) : null}
            {image460sv.url ? (
              <source src={image460sv.url} type="video/mp4" />
            ) : null}
          </video>
        </div>
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
            {post.upVoteCount + post.downVoteCount + " points"}
          </Link>
          {" · "}
          <Link to="/" className="post-meta__text">
            {post.comments.length + " comments"}
          </Link>
        </p>
        <div className="post-after-bar">
          <ul className="btn-vote left">
            <li>
              <div className="up" />
            </li>
            <li>
              <div className="down" />
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
