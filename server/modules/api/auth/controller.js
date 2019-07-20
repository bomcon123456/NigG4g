const User = require("../users/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const omit = require("lodash/omit");
const crypto = require("crypto");

const { validationResult } = require("express-validator/check");

exports.getAuthenUser = (req, res, next) => {
  const userId = req.userId;
  return User.findById(userId)
    .populate("homeCountry", "name")
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
  const email = req.body.email;
  const name = req.body.name;
  const password = process.env.DEFAULT_PASSWORD;
  const avatarURL = req.body.avatarURL;
  const birthday = req.body.birthday;
  const social = req.body.social;
  return User.findOne({ email: email })
    .then(user => {
      if (!user) {
        let username = null;
        let atIndex = email.indexOf("@");
        username = email.substring(0, atIndex);

        const user = new User({
          username: username,
          name: name,
          password: password,
          email: email,
          avatarURL: avatarURL,
          birthday: birthday,
          social: [social],
          verified: true
        });
        return user.save();
      } else {
        let socialUser = user.social;
        let isLinked = false;
        user.social.map(each => {
          if (each.type === social.type) {
            isLinked = true;
          }
        });
        if (isLinked) {
          return Promise.resolve(user);
        } else {
          socialUser.push(social);
          return user.save();
        }
      }
    })
    .then(result => {
      result = result.toObject();
      const token = jwt.sign(
        {
          email: result.email,
          userId: result._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
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
      if (errmsg && errmsg.includes("email")) {
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
        process.env.JWT_SECRET,
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
