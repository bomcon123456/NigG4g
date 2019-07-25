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
    .isLength({ min: 6 }),
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
]

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
            console.log(req.userId, user._id)
            return Promise.reject("account_existed");
          }
        }
      });
    }),
  body("newShowNSFW")
    .isBoolean()
  ,
  body("newMaskNSFW")
    .isBoolean()
]



router.get("/:userId", userController.getUser);

router.post("/", createUserBodyValidator, userController.createUser);
router.put(
  "/update-account",
  isAuth,
  updateAccountValidator,
  userController.updateAccount
);
router.put(
  "/change-password",
  newPasswordValidator,
  isAuth,
  userController.changePassword
);
router.delete("/:userId", isAuth, userController.deleteUser);
router.put("/:userId", isAuth, userController.updateUserInformation);

router.post("/check-username", usernameValidator, userController.checkUsernameExisted);
router.post("/check-email", emailValidator, userController.checkEmailExisted);

router.get("/verify/:myToken", userController.verifyUser);

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
      .isLength({ min: 6 })
  ],
  userController.updatePassword
);




module.exports = router;
