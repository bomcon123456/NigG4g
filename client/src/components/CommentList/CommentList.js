import React, { Component } from "react";
import FullComment from "./FullComment/FullComment";

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: [],
      loading: false,
      error: null
    };
  }

  render() {
    return (
      <div>
        <FullComment />
      </div>
    );
  }
}

export default CommentList;
