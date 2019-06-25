const express = require("express");
const { body } = require("express-validator/check");

const User = require("./model");
const userController = require("./controller");

const router = express.Router();

router.get("/:userId", userController.getUser);

router.post(
  "/",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("Email has been used already");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
  ],
  userController.createUser
);

router.delete("/users/:userId", userController.deleteUser);
router.put(
  "/:userId",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user && user._id.toString() !== req.params.userId.toString()) {
            return Promise.reject("Email has been used already");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
  ],
  userController.updateUserInformation
);

module.exports = router;
