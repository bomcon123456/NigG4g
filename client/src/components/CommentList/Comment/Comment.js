import React, { Component } from "react";
import classnames from "classnames";
import debounce from "lodash/debounce";

import Avatar from "../../Avatar/Avatar";
import CommentInfo from "./CommentInfo/CommentInfo";
import { postApi } from "../../../common/api/common/post-api";
import { userInfo } from "../../../common/states/user-info";
import { registerModal } from "../../../common/react/modals/register/register";

class Comment extends Component {
  constructor(props) {
    super(props);

    let currentVote = "";
    this.info = userInfo.getState();
    const info = this.info;
    const { upVotes, downVotes, points } = this.props.comment;
    console.log(this.props.comment)
    const upVoteFind = upVotes.find(each => {
      return each.toString() === info._id.toString();
    });
    const downVoteFind = downVotes.find(each => {
      return each.toString() === info._id.toString();
    });
    if (upVoteFind) {
      currentVote = "UP";
    } else if (downVoteFind) {
      currentVote = "DOWN";
    }
    this.state = {
      points: points,
      currentVote: currentVote
    };
    this.avatarStyle = null;
    if (this.props.isSubComment) {
      this.avatarStyle = { width: "30px", height: "30px", overflow: "hidden" };
    }
  }

  requestVoteApi = async isUpvote => {
    const { isSubComment, postId, comment, parentComment } = this.props;

    if (isSubComment) {
      await postApi.updateVoteReply(
        postId,
        parentComment,
        comment._id,
        isUpvote
      );
    } else {
      await postApi.updateVoteComment(postId, comment._id, isUpvote);
    }
  };

  requestVoteApi = debounce(this.requestVoteApi, 1000);

  handleVoteClicked = async isUpvote => {
    let points = this.state.points;
    let currentVote = this.state.currentVote;
    if (isUpvote && currentVote === "UP") {
      points -= 1;
      currentVote = "";
    } else if (!isUpvote && currentVote === "DOWN") {
      points += 1;
      currentVote = "";
    } else if (isUpvote && currentVote === "DOWN") {
      points += 2;
      currentVote = "UP";
    } else if (!isUpvote && currentVote === "UP") {
      points -= 2;
      currentVote = "DOWN";
    } else if (isUpvote) {
      points += 1;
      currentVote = "UP";
    } else if (!isUpvote) {
      points -= 1;
      currentVote = "DOWN";
    }
    this.setState({ points: points, currentVote: currentVote });
    this.requestVoteApi(isUpvote);
  };

  render() {
    const { comment, isSubComment } = this.props;
    const { points, currentVote } = this.state;
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
              postCreatedBy={this.props.postCreatedBy}
            />
          </div>
          {content}
          {media}
          <div className="action">
            <span
              className="action-text"
              onClick={() => {
                if (!this.info) {
                  registerModal.open();
                } else {
                  if (!isSubComment) {
                    this.props.handleReplyClicked(user.username, comment._id);
                  } else {
                    this.props.handleReplyClicked(user.username);
                  }
                }
              }}
            >
              Reply
            </span>
            <div className="vote-btn">
              <span
                className={classnames("vote", {
                  active: currentVote === "UP"
                })}
                onClick={() => {
                  if (!this.info) {
                    registerModal.open();
                  } else {
                    this.handleVoteClicked(true);
                  }
                }}
              >
                <i className="fas fa-arrow-up" />
              </span>
              <span
                className={classnames("vote", {
                  active: currentVote === "DOWN"
                })}
                onClick={() => {
                  if (!this.info) {
                    registerModal.open();
                  } else {
                    this.handleVoteClicked(false);
                  }
                }}
              >
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
