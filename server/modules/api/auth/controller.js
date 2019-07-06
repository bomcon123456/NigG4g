const User = require("../users/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const omit = require("lodash/omit");
const crypto = require("crypto");

const { validationResult } = require("express-validator/check");

exports.getAuthenUser = (req, res, next) => {
  const userId = req.userId;
  return User.findById(userId)
    .then(user => {
      if (!user || (user && !user.active)) {
        const error = new Error("account_not_found");
        error.statusCode = 401;
        throw error;
      }
      res.status(200).json(user);
    })
    .catch(error => {
      next(error);
    });
};

exports.loginSocialUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("user_validation_faied");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const social = req.body.social;
  return User.findOne({ "social.id": social.id })
    .lean()
    .then(user => {
      if (!user) {
        const email = req.body.email;
        const username = req.body.username;
        const password = crypto.randomBytes(16).toString("hex");
        const avatarURL = req.body.avatarURL;
        const birthday = req.body.birthday;
        const user = new User({
          username: username,
          password: password,
          email: email,
          avatarURL: avatarURL,
          birthday: birthday,
          social: social,
          verified: true
        });
        return user.save();
      } else {
        return Promise.resolve(user);
      }
    })
    .then(result => {
      const token = jwt.sign(
        {
          email: result.email,
          userId: result._id.toString()
        },
        "TopSecretWebTokenKey",
        { expiresIn: "12h" }
      );
      let resUser = omit(result, [
        "password",
        "createdAt",
        "updatedAt",
        "active"
      ]);

      res.status(200).json({
        message: "login_social_succeed",
        token: token,
        user: resUser
      });
    })
    .catch(error => {
      const { errmsg } = error;
      if (errmsg.includes("email")) {
        error = new Error(social.type === "GOOGLE" ? "fb_taken" : "gg_taken");
        error.statusCode = 401;
      }
      next(error);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  return User.findOne({ email: email, active: 1 })
    .lean()
    .then(user => {
      if (!user) {
        const error = new Error("account_not_found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("wrong_password");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        "TopSecretWebTokenKey",
        { expiresIn: "12h" }
      );
      let resUser = omit(loadedUser, [
        "password",
        "createdAt",
        "updatedAt",
        "active"
      ]);
      console.log(resUser);
      res.status(200).json({
        message: "login_succeed",
        token: token,
        user: resUser
      });
    })
    .catch(error => {
      next(error);
    });
};
