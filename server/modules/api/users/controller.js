const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./model");

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  return User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error("account_not_found");
        error.statusCode = 400;
        throw error;
      }
      res.status(200).json({
        message: "user_info_retrieved",
        user: user
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("user_validation_faied");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const avatarURL = req.body.avatarURL;
  const birthday = req.body.birthday;
  const user = new User({
    username: username,
    password: password,
    email: email,
    avatarURL: avatarURL,
    birthday: birthday
  });
  return user
    .save()
    .then(result => {
      res.status(200).json({
        message: "user_created",
        userId: result._id
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};
exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  return User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error("account_not_found");
        error.statusCode = 400;
        throw error;
      }
      user.active = false;
      return user.save();
    })
    .then(result => {
      res.status(200).json({
        message: "user_deleted",
        userId: userId
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};
exports.updateUserInformation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("user_validation_faied");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const userId = req.params.userId;
  const email = req.body.email;
  const password = req.body.password;
  const avatarURL = req.body.avatarURL;
  const birthday = req.body.birthday;
  return User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error("account_not_found");
        error.statusCode = 400;
        throw error;
      }
      user.email = email ? email : user.email;
      user.password = password ? password : user.password;
      user.avatarURL = avatarURL ? avatarURL : user.avatarURL;
      user.birthday = birthday ? birthday : user.birthday;
      return user.save();
    })
    .then(result => {
      res.status(200).json({
        message: "user_updated_successfully",
        userId: userId
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};
