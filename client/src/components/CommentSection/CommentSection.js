import React, { Component, Fragment } from "react";
import CommentList from "../CommentList/CommentList";
import CommentInputWithAvatar from "../CommentInputWithAvatar/CommentInputWithAvatar";

class CommentSection extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <CommentInputWithAvatar postId={this.props.postId} />
        <div style={{ marginTop: "20px" }}>
          <CommentList postId={this.props.postId}/>
        </div>
      </Fragment>
    );
  }
}

export default CommentSection;
