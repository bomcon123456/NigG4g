const express = require("express");
const statusController = require("./controller");
const router = express.Router();

router.get("/", statusController.getAll);
router.get("/:statusId", statusController.get);

module.exports = router;
