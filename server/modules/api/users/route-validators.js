const { body } = require("express-validator/check");

const User = require("./model");

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
    .isLength({ min: 6 })
];

const emailValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail()
];

const newPasswordValidator = [
  body("newPassword")
    .trim()
    .isLength({ min: 6 })
];

const usernameValidator = [
  body("username")
    .trim()
    .isLength({ max: 15, min: 4 })
    .isAscii()
];

const updateAccountValidator = [
  body("newUsername")
    .trim()
    .isLength({ max: 15, min: 4 })
    .isAscii()
    .custom((value, { req }) => {
      return User.findOne({ username: value }).then(user => {
        if (user) {
          if (user._id.toString() !== req.userId.toString())
            return Promise.reject("account_existed");
        }
      });
    }),
  body("newEmail")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          if (user._id.toString() !== req.userId.toString()) {
            console.log(req.userId, user._id);
            return Promise.reject("account_existed");
          }
        }
      });
    }),
  body("newShowNSFW").isBoolean(),
  body("newMaskNSFW").isBoolean()
];

module.exports = {
  createUserBodyValidator,
  emailValidator,
  newPasswordValidator,
  usernameValidator,
  updateAccountValidator
};
