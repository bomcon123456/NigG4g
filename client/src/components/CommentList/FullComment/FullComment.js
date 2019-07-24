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

  componentDidUpdate() {
    if (this.props.showReplyInput !== this.state.showReplyInput) {
      this.setState({ showReplyInput: this.props.showReplyInput });
    }
  }

  render() {
    const { comment } = this.props;
    const { showReplyInput, taggedUser, subcommentsLength } = this.state;
    return (
      <Fragment>
        <Comment
          comment={comment}
          handleReplyClicked={this.props.handleReplyClicked}
        />
        {/* SubCommentArray here */}
        {/* <div style={{ marginLeft: "20px" }}>
          <Comment
            comment={subcomment}
            isSubComment
            handleReplyClicked={(username) => this.handleReplyClicked(username, comment._id)}
          />
        </div> */}
        {subcommentsLength !== 0 ? (
          <div className="collasped-comment">
            View {subcommentsLength} replies
          </div>
        ) : null}
        {showReplyInput ? (
          <div
            style={{
              marginLeft: "20px",
              marginTop: "5px",
              marginBottom: "20px"
            }}
          >
            <CommentInputWithAvatar
              postId={this.props.postId}
              commentId={comment._id}
              taggedUser={taggedUser}
            />
          </div>
        ) : null}
      </Fragment>
    );
  }
}

export default FullComment;
