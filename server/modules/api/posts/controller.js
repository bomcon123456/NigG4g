const {
  createPost,
  deletePost,
  getPosts,
  getPost
} = require("./post-controller");
const {
  addComment,
  getComments,
  getComment,
  deleteComment
} = require("./comment-controller");

const {
  addSubcomment,
  getSubcomment,
  getSubcomments,
  deleteSubcomment
} = require("./subcomment-controller");

const {
  updatePostVote,
  updateCommentVote,
  updateSubcommentVote
} = require("./vote-controller");

module.exports = {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePostVote,
  addComment,
  getComments,
  getComment,
  deleteComment,
  addSubcomment,
  getSubcomment,
  getSubcomments,
  deleteSubcomment,
  updateCommentVote,
  updateSubcommentVote
};
