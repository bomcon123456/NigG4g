import React, { Component } from "react";
import { userInfo } from "../../common/states/user-info";
import Avatar from "../Avatar/Avatar";
import CommentInput from "../CommentInput/CommentInput";

class CommentInputWithAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.avatarStyle = null;
    if (this.props.isReply) {
      this.avatarStyle = {
        width: "30px",
        height: "30px",
        overflow: "hidden"
      };
    }
  }

  render() {
    const info = userInfo.getState();
    const { handlePostComment, handlePostReply } = this.props;
    return (
      <div className="comment-section">
        <div className="avatar" style={this.avatarStyle}>
          <Avatar
            redirect={
              info ? `${process.env.REACT_APP_APP_URL}/u/${info.username}` : "/"
            }
            src={
              info
                ? info.avatarURL
                : `${process.env.REACT_APP_ASSETS_URL}/1_0_100_v0.jpg`
            }
          />
        </div>
        <div className="comment-full">
          <CommentInput
            postId={this.props.postId}
            commentId={this.props.commentId}
            taggedUser={this.props.taggedUser}
            handlePostComment={handlePostComment}
            handlePostReply={handlePostReply}
          />
        </div>
      </div>
    );
  }
}

export default CommentInputWithAvatar;
