const express = require("express");
const Controller = require("./controller");
const router = express.Router();

/// Post API
router.get("/image-size", Controller.getImageSize);

module.exports = router;
