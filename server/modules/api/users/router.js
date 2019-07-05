const express = require("express");
const { body } = require("express-validator/check");

const isAuth = require("../../common/middleware/is-auth");
const User = require("./model");
const userController = require("./controller");

const router = express.Router();
const createUserBodyValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject("account_existed");
        }
      });
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 5 })
];

const emailValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail()
];

router.get("/:userId", userController.getUser);

router.post("/", createUserBodyValidator, userController.createUser);

router.delete("/:userId", isAuth, userController.deleteUser);
router.put("/:userId", isAuth, userController.updateUserInformation);

router.post("/check-email", emailValidator, userController.checkEmailValid);

router.post(
  "/forgot-password",
  emailValidator,
  userController.requireResetPassword
);

router.post(
  "/update-password",
  [
    body("password")
      .trim()
      .isLength({ min: 5 })
  ],
  userController.updatePassword
);

module.exports = router;
