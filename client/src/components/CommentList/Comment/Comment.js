import React, { Component } from "react";
import Avatar from "../../Avatar/Avatar";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { post } = this.props;
    const user = post.createdBy;
    return (
      <div className="comment">
        <div className="avatar">
          <Avatar
            redirect={`${process.env.REACT_APP_APP_URL}/u/${user.username}`}
            src={user.avatarURL}
          />
        </div>
        <div className="comment-content">
          <div className="info" />
        </div>
      </div>
    );
  }
}
