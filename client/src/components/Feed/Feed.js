import React, { Component } from "react";
import classnames from "classnames";

import { postApi } from "../../common/api/common/post-api";
import ProfileTag from "./ProfileTag/ProfileTag";
import Post from "./Post/post";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTag: "Hot",
      loading: false,
      error: null,
      posts: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    postApi
      .getPosts()
      .then(data => {
        this.setState({ posts: data, loading: false, error: null });
        console.log(data);
      })
      .catch(err => {
        this.setState({ loading: false, error: null });
        console.log(err);
      });
  }

  render() {
    const { className, hasProfile } = this.props;
    const { posts } = this.state;
    return (
      <div className={classnames("feed", className)}>
        {hasProfile ? <ProfileTag title="Area 51" /> : null}
        {posts.map(each => (
          <Post key={each._id} post={each} />
        ))}
      </div>
    );
  }
}

export default Feed;
