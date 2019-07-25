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
      taggedUser: "",
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
      console.log(response);
    } catch (err) {
      this.setState({ error: err, loading: false });
    }
  };

  render() {
    const { comment } = this.props;
    const {
      showReplyInput,
      taggedUser,
      subcommentsLength,
      subcomments
    } = this.state;
    const hasMore = subcommentsLength - subcomments.length > 0;
    return (
      <Fragment>
        <Comment
          comment={comment}
          handleReplyClicked={this.props.handleReplyClicked}
        />
        {/* SubCommentArray here */}
        {subcomments.length !== 0
          ? subcomments.map(subcomment => (
              <div
                style={{ marginLeft: "20px" }}
                key={subcomment._id.toString()}
              >
                <Comment
                  comment={subcomment}
                  isSubComment
                  handleReplyClicked={username => {
                    this.props.handleReplyClicked(username, comment._id);
                  }}
                />
              </div>
            ))
          : null}
        {subcommentsLength !== 0 && hasMore ? (
          <div className="collasped-comment" onClick={this.handleLoadReply}>
            {subcommentsLength - subcomments.length === subcommentsLength
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
            />
          </div>
        ) : null}
      </Fragment>
    );
  }
}

export default FullComment;
