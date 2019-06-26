const express = require("express");
const postController = require("./controller");
const isAuth = require("../../common/middleware/is-auth");
const router = express.Router();

router.post(
  "/",
  isAuth,
  postController.createPost
);

router.get("/", postController.getAllPosts);

router.get("/:postId", postController.getPost);

router.put("/:postId", postController.updatePost);

router.delete(
  "/:postId",
  isAuth,
  postController.deletePost
)

router.post(
  "/:postId/comments",
  isAuth,
  postController.addComment
)

router.delete(
  "/:postId/comments/:commentId",
  isAuth,
  postController.deleteComment
)

router.put(
  "/:postId/comments/:commentId",
  isAuth,
  postController.updateComment
)

module.exports = router;
