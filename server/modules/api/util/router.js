const express = require("express");
const Controller = require("./controller");
const { body } = require("express-validator/check");

const router = express.Router();

/// Post API
router.post("/image-size", Controller.validateImage);

router.post("/comment-preview", Controller.getCommentPreview);

router.post(
  "/get-url",
  [
    body("url")
      .isURL()
      .withMessage("Please enter a valid URL")
  ],
  Controller.getUrl
);

module.exports = router;
