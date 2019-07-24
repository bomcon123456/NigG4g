import React, { Component, Fragment } from "react";
import Comment from "../Comment/Comment";
import CommentInputWithAvatar from "../../CommentInputWithAvatar/CommentInputWithAvatar";

class FullComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReplyInput: false,
      taggedUser: "",
      subcomments: [],
      subcommentsLength: 0
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
    const { showReplyInput, taggedUser } = this.state;
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
        <div className="collasped-comment">View 9 replies</div>
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
