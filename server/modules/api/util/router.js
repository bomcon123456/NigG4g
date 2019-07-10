const express = require("express");
const Controller = require("./controller");
const router = express.Router();

/// Post API
router.post("/image-size", Controller.validateImage);

module.exports = router;
