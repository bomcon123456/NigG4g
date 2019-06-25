const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./model");

exports.getUser = (req, res, next) => {};
exports.createUser = (req, res, next) => {};
exports.deleteUser = (req, res, next) => {};
exports.updateUserInformation = (req, res, next) => {};
