const express = require("express");
const { body } = require("express-validator/check");

const isAuth = require("../../common/middleware/is-auth");
const userController = require("./controller");

const router = express.Router();

const {
  createUserBodyValidator,
  emailValidator,
  newPasswordValidator,
  usernameValidator,
  updateAccountValidator
} = require("./route-validators");

router.get("/", userController.getUserNames);

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
router.put("/update-profile", isAuth, userController.updateProfile);
router.delete("/:userId", isAuth, userController.deleteUser);
router.put("/:userId", isAuth, userController.updateUserInformation);

router.post(
  "/check-username",
  usernameValidator,
  userController.checkUsernameExisted
);
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
