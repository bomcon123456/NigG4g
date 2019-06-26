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

module.exports = router;
