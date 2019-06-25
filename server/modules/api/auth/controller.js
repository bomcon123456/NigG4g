const User = require("../users/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator/check");

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  return User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error("User is not existed.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Wrong password.");
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
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString()
      });
    })
    .catch(error => {
      next(error);
    });
};
