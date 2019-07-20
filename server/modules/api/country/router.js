const express = require("express");
const countryController = require("./controller");
const router = express.Router();

router.get("/", countryController.getCountries);
router.get("/:countryId", countryController.getCountry);

module.exports = router;
