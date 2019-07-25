import React, { Component } from "react";

import FullComment from "./FullComment/FullComment";

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: this.props.comments,
      loading: false,
      error: null,
      focusedReply: {
        username: null,
        commentId: null
      }
    };
    this.postId = this.props.postId;
  }

  handleReplyClicked = (username, commentId) => {
    this.setState({
      focusedReply: {
        username: username,
        commentId: commentId
      }
    });
  };

  componentDidUpdate() {
    if (this.props.comments !== this.state.comments) {
      this.setState({ comments: this.props.comments });
    }
  }

  render() {
    const { comments, focusedReply } = this.state;
    return (
      <div>
        {comments.map(comment => (
          <FullComment
            key={comment._id}
            postCreatedBy={this.props.postCreatedBy}
            comment={comment}
            postId={this.postId}
            showReplyInput={comment._id === focusedReply.commentId}
            handleReplyClicked={this.handleReplyClicked}
            taggedUser={focusedReply.username}
            handlePostComment={this.handlePostComment}
          />
        ))}
      </div>
    );
  }
}

export default CommentList;
