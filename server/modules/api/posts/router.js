const express = require("express");
const postController = require("./controller");
const isAuth = require("../../common/middleware/is-auth");
const router = express.Router();

/// Post API
router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPost);

router.post("/", isAuth, postController.createPost);

router.put("/:postId", isAuth, postController.updatePost);

router.delete("/:postId", isAuth, postController.deletePost);

/// Comment API
router.post("/:postId/comments", isAuth, postController.addComment);

router.put(
  "/:postId/comments/:commentId",
  isAuth,
  postController.updateComment
);

router.delete(
  "/:postId/comments/:commentId",
  isAuth,
  postController.deleteComment
);

/// Subcomment API
router.post(
  "/:postId/comments/:commentId/subcomments",
  isAuth,
  postController.addSubcomment
);

router.put(
  "/:postId/comments/:commentId/subcomments/:subcommentId",
  isAuth,
  postController.updateSubcomment
);

router.delete(
  "/:postId/comments/:commentId/subcomments/:subcommentId",
  isAuth,
  postController.deleteSubcomment
);

module.exports = router;
