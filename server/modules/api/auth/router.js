const express = require("express");
const authController = require("./controller");
const isAuth = require("../../common/middleware/is-auth");

const router = express.Router();

router.post("/", authController.login);

router.get("/", isAuth, authController.getAuthenUser);

module.exports = router;
