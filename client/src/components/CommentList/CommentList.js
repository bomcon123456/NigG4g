import React, { Component } from "react";
import Comment from "./Comment/Comment";

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <Comment />
      </div>
    );
  }
}

export default CommentList;
