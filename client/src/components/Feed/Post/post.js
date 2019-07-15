import React, { Component } from "react";
import { Link } from "react-router-dom";

import { timeDifference } from "../../../common/utils/common-util";

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.pictureStyle = {};
  }

  componentWillMount() {
    const { post } = this.props;
    const { images, type } = post;
    const { image460, image460sv } = images;
    if (type === "Photo") {
      if (image460.width === image460.height) {
        console.log("imere");
        this.pictureStyle = {
          minHeight: 500
        };
      } else if (image460.width > image460.height) {
        this.pictureStyle = {
          minHeight: (500 / image460.width) * image460.height
        };
      } else {
        this.pictureStyle = {
          width: image460.width * (500 / image460.height),
          height: 500,
          maxWidth: 500
        };
      }
    }
  }

  render() {
    const { post } = this.props;
    const { images, type, createdAt } = post;
    const { image460, image460sv } = images;
    console.log(this.pictureStyle);
    const time = timeDifference(new Date(createdAt));
    let media = (
      <picture style={this.pictureStyle}>
        {image460.webpUrl ? (
          <source srcset={image460.webpUrl} type="image/webp" />
        ) : null}
        <img src={image460.url} alt={post.name} style={this.pictureStyle} />
      </picture>
    );
    if (type === "Animated") {
      media = <video />;
    }
    return (
      <article className="post">
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
        {/* <div className="post-after-bar">
          <ul className="btn-vote left" />
          <ul className="btn-vote left" />
          <ul className="btn-vote left" />
          <ul className="btn-vote left" />
        </div> */}
      </article>
    );
  }
}

export default Post;
