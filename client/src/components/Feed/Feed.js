import React, { Component } from "react";
import classnames from "classnames";
import InfiniteScroll from "react-infinite-scroller";

import { postApi } from "../../common/api/common/post-api";
import ProfileTag from "./ProfileTag/ProfileTag";
import Post from "./Post/Post";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTag: "Hot",
      loading: false,
      error: null,
      posts: [],
      nextLink: 0,
      hasMoreItems: true
    };
  }

  loadItems(page) {
    if (this.state.nextLink !== null) {
      postApi.getPosts(page).then(data => {
        console.log(data);
        let newPosts = [...this.state.posts, ...data.post];
        if (data.nextLink !== null) {
          this.setState({
            posts: newPosts,
            loading: false,
            error: null,
            nextLink: data.nextLink,
            hasMoreItems: data.hasMoreItems
          });
        }
      });
    }
  }

  // componentDidMount() {
  //   this.setState({ loading: true });
  //   postApi
  //     .getPosts()
  //     .then(data => {
  //       this.setState({ posts: data, loading: false, error: null });
  //       console.log(data);
  //     })
  //     .catch(err => {
  //       this.setState({ loading: false, error: null });
  //       console.log(err);
  //     });
  // }

  render() {
    const { className, hasProfile } = this.props;
    const { posts } = this.state;
    let items = [];
    items = posts.map((each, i) => {
      return (
        <Post
          firstPost={i === 0}
          key={each._id}
          post={each}
          history={this.props.history}
        />
      );
    });
    return (
      <div className={classnames("feed", className)}>
        {hasProfile ? <ProfileTag title="Area 51" /> : null}
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadItems.bind(this)}
          hasMore={this.state.hasMoreItems}
          loader={
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}
              key={"0"}
            >
              <div className="lds-ripple">
                <div />
                <div />
              </div>
            </div>
          }
        >
          {items}
        </InfiniteScroll>
      </div>
    );
  }
}

export default Feed;
