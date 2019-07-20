const { validationResult } = require("express-validator/check");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const omit = require("lodash/omit");

const User = require("./model");
const ResetPasswordToken = require("./ResetPasswordToken/model");
const VerifyToken = require("./VerifyToken/model");

const { sendEmail } = require("../../common/util/email/email");

const bcrypt = require("bcryptjs");

exports.checkEmailExisted = (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("user_validation_faied");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  return User.findOne({ email: email, active: 1 })
    .then(user => {
      if (!user) {
        return res.status(200).json({
          message: "account_not_found"
        });
      }
      return res.status(200).json({
        message: "account_found"
      });
    })
    .catch(err => next(err));
};

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  return User.findById(userId)
    .then(user => {
      if (!user || (user && !user.active)) {
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
  let resUser = null;
  let token = null;
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const avatarURL = req.body.avatarURL;
  const birthday = req.body.birthday;
  let username = null;
  let atIndex = email.indexOf("@");
  username = email.substring(0, atIndex);

  const user = new User({
    name: name,
    username: username,
    password: password,
    email: email,
    avatarURL: avatarURL,
    birthday: birthday
  });
  return user
    .save()
    .then(result => {
      const loadedUser = result.toObject();
      token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );
      resUser = omit(loadedUser, [
        "password",
        "createdAt",
        "updatedAt",
        "active"
      ]);
      const myToken = crypto.randomBytes(16).toString("hex");
      let verifyToken = new VerifyToken({
        _userId: resUser._id,
        token: myToken
      });
      return verifyToken.save();
    })
    .then(token => {
      return sendEmail("gmail", {
        from: "Nigg4g | Where the fun begins",
        to: email,
        subject: "Email verification",
        template: "email-verification",
        context: {
          appUrl: "https://localhost:3000/",
          redirect: `https://localhost:3000/verify-user?token=${token.token}`,
          name: resUser.username
        }
      });
    })
    .then(() => {
      res.status(200).json({
        message: "user_created",
        user: resUser,
        token: token
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

exports.verifyUser = (req, res, next) => {
  const { myToken } = req.params;
  let resUser = null;
  let token = null;
  return VerifyToken.findOne({ token: myToken })
    .then(token => {
      if (!token) {
        const error = new Error("token_expired");
        error.statusCode = 404;
        throw error;
      }
      return User.findById(token._userId);
    })
    .then(user => {
      if (!user) {
        const error = new Error("account_not_found");
        error.statusCode = 404;
        throw error;
      }
      user.verified = true;
      return user.save();
    })
    .then(user => {
      const loadedUser = user.toObject();
      token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );
      resUser = omit(loadedUser, [
        "password",
        "createdAt",
        "updatedAt",
        "active"
      ]);
      return VerifyToken.deleteMany({ _userId: resUser._id });
    })
    .then(() => {
      res.status(200).json({
        message: "user_verified",
        user: resUser,
        token: token
      });
    })
    .catch(error => {
      next(error);
    });
};

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  return User.findById(userId)
    .then(user => {
      if (!user || (user && !user.active)) {
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
      if (!user || (user && !user.active)) {
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

exports.requireResetPassword = (req, res, next) => {
  const { email } = req.body;
  let myUser = null;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("user_validation_faied");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  return User.findOne({ email: email, active: 1 })
    .lean()
    .then(user => {
      if (!user) {
        const error = new Error("account_not_found");
        error.statusCode = 400;
        throw error;
      }
      myUser = user;
      return ResetPasswordToken.deleteMany({ _userId: user._id });
    })
    .then(result => {
      const myToken = crypto.randomBytes(16).toString("hex");
      let token = new ResetPasswordToken({
        _userId: myUser._id,
        token: myToken
      });
      return token.save();
    })
    .then(token => {
      return sendEmail("gmail", {
        from: "Nigg4g | Where the fun begins",
        to: email,
        subject: "Account Password Reset",
        template: "reset-password",
        context: {
          appUrl: "https://localhost:3000/",
          redirect: `https://localhost:3000/confirm-reset-password?token=${
            token.token
          }`,
          name: myUser.username
        }
      });
    })
    .then(() => {
      res.status(200).json({
        message: "reset_email_sent"
      });
    })
    .catch(err => next(err));
};

exports.updatePassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("user_validation_faied");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const password = req.body.password;
  const token = req.body.token;
  let userID = null;
  return ResetPasswordToken.findOne({ token: token })
    .then(resTok => {
      if (!resTok) {
        const error = new Error("token_expired");
        error.statusCode = 404;
        throw error;
      }
      return resTok._userId;
    })
    .then(userId => {
      userID = userId;
      return User.findById(userId);
    })
    .then(user => {
      if (!user || (user && !user.active)) {
        const error = new Error("account_not_found");
        error.statusCode = 400;
        throw error;
      }
      user.password = password;
      return user.save();
    })
    .then(result => {
      return ResetPasswordToken.deleteMany({ _userId: userID });
    })
    .then(result => {
      res.status(200).json({
        message: "change_password_successfully",
        userId: userID
      });
    })
    .catch(err => next(err));
};

exports.changePassword = (req, res, next) => {
  const userId = req.userId;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  return User.findById(userId)
    .then(user => {
      if (!user || (user && !user.active)) {
        const error = new Error("User not found");
        error.statusCode = 400;
        throw error;
      }

      bcrypt
        .compare(currentPassword, user.password)
        .then(result => {
          if (!result) {
            const error = new Error("Incorrect password");
            error.statusCode = 400;
            throw error;
          }
          user.password = newPassword;

          res.status(200).json({
            message: "changed password successfully",
            userId: userId
          });
          return user.save();
        })
        .catch(err => {
          console.log(err);
          next(err);
        });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

// bcrypt.compare(currentPassword, user.password)
//         .then(result => {
//           if (result) {
//             console.log(true);
//           } else {
//             res.status(501).send({
//               "huhu": "huhu",
//               "user": user.password,
//               "currentPass": currentPassword
//             })
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           next(err);
//         })
