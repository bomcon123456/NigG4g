import React, { Component } from "react";
import { Link } from "react-router-dom";

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { post } = this.props;
    const { images, type } = post;
    const { image460, image460sv } = images;
    let media = (
      <picture>
        {image460.webpUrl ? (
          <source srcset={image460.webpUrl} type="image/webp" />
        ) : null}
        <img src={image460.url} alt={post.name} />
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
              src={post.category.imageUrl}
              alt="category-icon"
            />
            <p className="post-section__message">
              <span>{post.category.name}</span>
              {" . " + post.createdAt}
            </p>
          </div>
          <h1>{post.title}</h1>
        </header>
        <div className="post-containter">{media}</div>
        <p className="post-meta">
          <Link to="/">{post.upVoteCount + post.downVoteCount}</Link>
          <Link to="/">{post.comments.length() + " comments"}</Link>
        </p>
        <div className="post-after-bar">
          <ul className="btn-vote left" />
          <ul className="btn-vote left" />
        </div>
      </article>
    );
  }
}
