import React, { Component } from "react";
import Avatar from "../../Avatar/Avatar";
import CommentInfo from "./CommentInfo/CommentInfo";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      points: 15
    };
    this.avatarStyle = null;
    if (this.props.isSubComment) {
      this.avatarStyle = { width: "30px", height: "30px", overflow: "hidden" };
    }
  }

  render() {
    const { comment, isSubComment } = this.props;
    const { points } = this.state;
    const user = comment.createdBy;
    let media = null;
    let content = null;
    if (comment.imageUrl) {
      media = (
        <div className="media">
          <img src={comment.imageUrl} alt="comment-embed" />
        </div>
      );
    }
    if (comment.content) {
      content = <div className="content">{comment.content}</div>;
    }
    return (
      <div className="comment">
        <div className="avatar" style={this.avatarStyle}>
          <Avatar
            redirect={`${process.env.REACT_APP_APP_URL}/u/${user.username}`}
            src={user.avatarURL}
          />
        </div>
        <div className="comment-content">
          <div className="info">
            <CommentInfo
              user={user}
              points={points}
              createdAt={comment.createdAt}
            />
          </div>
          {content}
          {media}
          <div className="action">
            <span
              className="action-text"
              onClick={() => {
                if (!isSubComment) {
                  this.props.handleReplyClicked(user.username, comment._id);
                } else {
                  this.props.handleReplyClicked(user.username);
                }
              }}
            >
              Reply
            </span>
            <div className="vote-btn">
              <span className="vote">
                <i className="fas fa-arrow-up" />
              </span>
              <span className="vote">
                <i className="fas fa-arrow-down" />
              </span>
            </div>
          </div>
        </div>
        <div className="extra-menu">
          <i className="fas fa-chevron-down extra-arrow" />
        </div>
      </div>
    );
  }
}

export default Comment;
