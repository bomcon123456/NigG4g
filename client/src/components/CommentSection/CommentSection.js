import React, { Component, Fragment } from "react";
import Avatar from "../Avatar/Avatar";
import { userInfo } from "../../common/states/user-info";
import CommentInput from "../CommentInput/CommentInput";
import CommentList from "../CommentList/CommentList";
import Comment from "../CommentList/Comment/Comment";

class CommentSection extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const info = userInfo.getState();

    return (
      <Fragment>
        <div className="comment-section">
          <div className="avatar">
            <Avatar
              redirect={
                info
                  ? `${process.env.REACT_APP_APP_URL}/u/${info.username}`
                  : "/"
              }
              src={
                info
                  ? info.avatarURL
                  : `${process.env.REACT_APP_ASSETS_URL}/1_0_100_v0.jpg`
              }
            />
          </div>
          <div className="comment-full">
            <CommentInput postId={this.props.postId} />
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <CommentList />
        </div>
      </Fragment>
    );
  }
}

export default CommentSection;
