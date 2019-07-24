import React, { Component, Fragment } from "react";
import Comment from "../Comment/Comment";

class FullComment extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
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
    return (
      <Fragment>
        <Comment comment={comment} />
        <div style={{ marginLeft: "20px" }}>
          <Comment comment={comment} isSubComment />
        </div>
        <div className="collasped-comment">View 9 replies</div>
      </Fragment>
    );
  }
}

export default FullComment;
