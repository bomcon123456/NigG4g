import React, { Component, Fragment } from "react";
import Comment from "../Comment/Comment";
import CommentInputWithAvatar from "../../CommentInputWithAvatar/CommentInputWithAvatar";

class FullComment extends Component {
  constructor(props) {
    super(props);

    const { comment } = this.props;

    this.state = {
      showReplyInput: false,
      taggedUser: "",
      subcomments: [],
      subcommentsLength: comment.subcommentsLength
    };
  }

  handleReplyClicked = username => {
    this.setState({
      showReplyInput: true,
      taggedUser: username
    });
  };

  render() {
    const { comment } = this.props;
    const { showReplyInput, taggedUser, subcommentsLength } = this.state;
    return (
      <Fragment>
        <Comment
          comment={comment}
          handleReplyClicked={this.handleReplyClicked}
        />
        {/* SubCommentArray here */}
        {/* <div style={{ marginLeft: "20px" }}>
          <Comment
            comment={comment}
            isSubComment
            handleReplyClicked={this.handleReplyClicked}
          />
        </div> */}
        {subcommentsLength !== 0 ? (
          <div className="collasped-comment">
            View {subcommentsLength} replies
          </div>
        ) : null}
        <div style={{ marginLeft: "20px", marginTop: "5px" }}>
          {showReplyInput ? (
            <CommentInputWithAvatar
              postId={this.props.postId}
              commentId={comment._id}
              taggedUser={taggedUser}
            />
          ) : null}
        </div>
      </Fragment>
    );
  }
}

export default FullComment;
