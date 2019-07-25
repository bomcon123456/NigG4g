import { axiosApi } from "../api";

export const postApi = {
  getPost(postId) {
    return axiosApi.get("/posts/" + postId);
  },
  getPosts(page = null) {
    return axiosApi
      .get("/posts" + (page != null ? "/?page=" + page : ""))
      .then(data => data.data)
      .catch(err => err);
  },
  postPost(data) {
    return axiosApi.post("/posts", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  putPost(postId, data) {
    return axiosApi.put("/posts/" + postId, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  deletePost(postId) {
    return axiosApi.delete("/posts/" + postId);
  },
  //Vote API
  updateVotePost(postId, upVote) {
    return axiosApi.put("/posts/" + postId + "/votes", {
      upvote: upVote
    });
  },
  updateVoteComment(postId, commentId, upVote) {
    return axiosApi.put(
      "/posts/" + postId + "/comments/" + commentId + "/votes",
      {
        upvote: upVote
      }
    );
  },
  updateVoteReply(postId, commentId, replyId, upVote) {
    return axiosApi.put(
      "/posts/" +
        postId +
        "/comments/" +
        commentId +
        "/subcomments/" +
        replyId +
        "/votes",
      {
        upvote: upVote
      }
    );
  },
  /// Comment API
  getComment(postId, commentId) {
    return axiosApi.get("/posts/" + postId + "/comments/" + commentId);
  },
  getComments(postId, queryType = "hot") {
    return axiosApi.get("/posts/" + postId + `/comments?query=${queryType}`);
  },
  postComment(postId, data) {
    return axiosApi.post("/posts/" + postId + "/comments", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  putComment(postId, commentId, data) {
    return axiosApi.put("/posts/" + postId + "/comments/" + commentId, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  deleteComment(postId, commentId) {
    return axiosApi.delete("/posts/" + postId + "/comments/" + commentId);
  },
  /// Subcomment API
  getSubcomments(postId, commentId) {
    return axiosApi.get(
      "/posts/" + postId + "/comments/" + commentId + "/subcomments"
    );
  },
  getSubcomment(postId, commentId, subId) {
    return axiosApi.get(
      "/posts/" + postId + "/comments/" + commentId + "/subcomments/" + subId
    );
  },
  postSubcomment(postId, commentId, data) {
    return axiosApi.post(
      "/posts/" + postId + "/comments/" + commentId + "/subcomments",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  putSubcomment(postId, commentId, subId, data) {
    return axiosApi.post(
      "/posts/" + postId + "/comments/" + commentId + "/subcomments/" + subId,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  deleteSubcomment(postId, commentId, subId) {
    return axiosApi.delete(
      "/posts/" + postId + "/comments/" + commentId + "/subcomments/" + subId
    );
  }
};
