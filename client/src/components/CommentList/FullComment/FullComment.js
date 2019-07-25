import React, { Component, Fragment } from "react";
import Comment from "../Comment/Comment";
import CommentInputWithAvatar from "../../CommentInputWithAvatar/CommentInputWithAvatar";
import { postApi } from "../../../common/api/common/post-api";

class FullComment extends Component {
  constructor(props) {
    super(props);

    const { comment } = this.props;

    this.state = {
      showReplyInput: false,
      subcomments: [],
      subcommentsLength: comment.subcommentsLength,
      error: null,
      loading: false
    };
  }

  componentDidUpdate() {
    if (this.props.showReplyInput !== this.state.showReplyInput) {
      this.setState({ showReplyInput: this.props.showReplyInput });
    }
  }

  handleLoadReply = async () => {
    this.setState({ error: null, loading: true });
    try {
      const response = await postApi.getSubcomments(
        this.props.postId,
        this.props.comment._id
      );
      const { data } = response;
      this.setState({ error: null, loading: false, subcomments: data });
    } catch (err) {
      this.setState({ error: err, loading: false });
    }
  };

  handlePostReply = reply => {
    let newSub = [...this.state.subcomments];
    newSub.unshift(reply);
    this.setState((prevState, props) => ({
      subcommentsLength: prevState.subcommentsLength + 1,
      subcomments: newSub
    }));
  };

  render() {
    const { comment, handleReplyClicked } = this.props;
    const {
      showReplyInput,
      subcommentsLength,
      subcomments,
      loading
    } = this.state;
    const hasMore = subcommentsLength - subcomments.length > 0;
    return (
      <Fragment>
        <Comment
          postId={this.props.postId}
          comment={comment}
          postCreatedBy={this.props.postCreatedBy}
          handleReplyClicked={handleReplyClicked}
        />
        {/* SubCommentArray here */}
        {subcomments.length !== 0
          ? subcomments.map(subcomment => (
              <div
                style={{ marginLeft: "20px" }}
                key={subcomment._id.toString()}
              >
                <Comment
                  postId={this.props.postId}
                  parentComment={comment._id}
                  comment={subcomment}
                  postCreatedBy={this.props.postCreatedBy}
                  isSubComment
                  handleReplyClicked={username => {
                    handleReplyClicked(username, comment._id);
                  }}
                />
              </div>
            ))
          : null}
        {subcommentsLength !== 0 && hasMore ? (
          <div className="collasped-comment" onClick={this.handleLoadReply}>
            {loading
              ? "Loading..."
              : subcomments.length === 0
              ? `View ${subcommentsLength} replies`
              : "Load more replies"}
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
              taggedUser={this.props.taggedUser}
              handlePostReply={this.handlePostReply}
            />
          </div>
        ) : null}
      </Fragment>
    );
  }
}

export default FullComment;
