import React, { Component, Fragment } from "react";
import CommentList from "../CommentList/CommentList";
import CommentInputWithAvatar from "../CommentInputWithAvatar/CommentInputWithAvatar";
import { postApi } from "../../common/api/common/post-api";

class CommentSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      loading: false,
      error: null
    };
    this.postId = this.props.postId;
  }
  componentDidMount() {
    this.setState({ loading: true, error: null });
    postApi
      .getComments(this.postId)
      .then(res => {
        const { data } = res;
        // console.log(data);
        this.setState({ loading: true, error: null, comments: data });
      })
      .catch(err => this.setState({ loading: false, error: err }));
  }
  handlePostComment = comment => {
    let newArray = [...this.state.comments];
    newArray.unshift(comment);
    this.setState({ comments: newArray });
  };

  render() {
    const { comments } = this.state;
    return (
      <Fragment>
        <CommentInputWithAvatar
          postId={this.props.postId}
          handlePostComment={this.handlePostComment}
        />
        <div style={{ marginTop: "20px" }}>
          <CommentList
            postId={this.props.postId}
            postCreatedBy={this.props.createdBy}
            comments={comments}
          />
        </div>
      </Fragment>
    );
  }
}

export default CommentSection;
