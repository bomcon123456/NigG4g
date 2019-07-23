import React, { Component } from "react";
import Avatar from "../../Avatar/Avatar";
import CommentInfo from "./CommentInfo/CommentInfo";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      points: 15
    };
  }

  render() {
    // const { comment } = this.props;
    const comment = {
      content: "This shit is not normal man",
      imageUrl:
        "https://localhost:6969/comment-images/5d3679ea521a6e0884e4b98d_700.jpg",
      type: "Photo",
      points: 0,
      _id: "5d3679ea521a6e0884e4b98d",
      createdBy: {
        username: "bomcon123",
        statusId: "5d368a0cfcb82a10b27d53ea",
        isPro: true,
        avatarURL:
          "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2593714977403208&height=50&width=50&ext=1566449169&hash=AeTm9_YV3ws_sIR_"
      },
      subcomments: [],
      createdAt: "2019-07-23T03:07:22.284+00:00",
      updatedAt: "2019-07-23T03:07:22.284+00:00"
    };
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
        <div className="avatar">
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
            <span className="action-text">Reply</span>
            <div className="vote-btn">
              <span className="vote">
                <i className="fas fa-arrow-up" />
              </span>
              <span className="vote">
                <i className="fas fa-arrow-down" />
              </span>
            </div>
          </div>
          <div className="collasped-comment">View 9 replies</div>
        </div>
        <div className="extra-menu">
          <i className="fas fa-chevron-down extra-arrow" />
        </div>
      </div>
    );
  }
}

export default Comment;
