const probe = require("probe-image-size");

const getImageSize = async (req, res, next) => {
  const { url } = req.query;
  let message = "";
  probe(url)
    .then(data => {
      const { width, height } = data;
      if (width >= 200 && height >= 100) {
        res.status(200).json({ message: "valid_picture" });
      } else {
        const error = new Error("invalid_picture");
        error.statusCode = 406;
        throw error;
      }
    })
    .catch(error => next(error));
};
module.exports = {
  getImageSize
};
