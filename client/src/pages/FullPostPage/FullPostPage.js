import React, { Component } from "react";
// import classnames from "classnames";

import Layout from "../../hoc/Layout/Layout";
import FullPost from "../../components/FullPost/FullPost";
import { postApi } from "../../common/api/common/post-api";
// import { userInfo } from "../../common/states/user-info";

class FullPostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    const { postId } = this.props.match.params;
    postApi
      .getPost(postId)
      .then(data => {
        this.setState({ post: data.data.post });
      })
      .catch(err => this.props.history.push("/not-found"));
  }

  render() {
    const { post } = this.state;
    return (
      <Layout>
        {post ? <FullPost post={post} history={this.props.history} /> : null}
      </Layout>
    );
  }
}
export default FullPostPage;
