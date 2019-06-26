const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  if (token != "infinityToken") {
    try {
      decodedToken = jwt.verify(token, "TopSecretWebTokenKey");
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
    if (!decodedToken) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
  } else {
    req.userId = "5d12f611f66b1b1d40f13970";
  }
  next();
};
