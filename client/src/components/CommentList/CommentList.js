import React, { Component } from "react";

import FullComment from "./FullComment/FullComment";
import { postApi } from "../../common/api/common/post-api";

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      loading: false,
      error: null
    };
    this.postId = this.props.postId;
    console.log(this.postId);
  }

  componentDidMount() {
    this.setState({ loading: true, error: null });
    postApi
      .getComments(this.postId)
      .then(res => {
        const { data } = res;
        this.setState({ loading: true, error: null, comments: data.comments });
      })
      .catch(err => this.setState({ loading: false, error: err }));
  }

  render() {
    const { comments } = this.state;
    return (
      <div>
        {comments.map(comment => (
          <FullComment key={comment._id} comment={comment} />
        ))}
      </div>
    );
  }
}

export default CommentList;
