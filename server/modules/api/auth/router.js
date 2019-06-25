const express = require("express");
const authController = require("./controller");

const router = express.Router();

router.post("/", authController.login);

module.exports = router;
