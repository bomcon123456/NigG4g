const { validationResult } = require("express-validator/check");
const ResetPasswordToken = require("./ResetPasswordToken/model");
const crypto = require("crypto");
const { sendEmail } = require("../../common/util/email/email");

const User = require("./model");

exports.checkEmailValid = (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("user_validation_faied");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  return User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error("account_not_found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "account_found"
      });
    })
    .catch(err => next(err));
};

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
  return User.findOne({ email: email })
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
      if (!user) {
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
