const probe = require("probe-image-size");
const sharp = require("sharp");

const validateImage = async (req, res, next) => {
  const { url, file } = req.body;
  let message = "";
  if (url) {
    probe(url)
      .then(data => {
        const { width, height } = data;
        if (width >= 200 && height >= 100) {
          if (
            (width <= 600 && height <= 600) ||
            (width >= 600 && width * height <= 600000)
          ) {
            res.status(200).json({ message: "valid_picture" });
          }
        } else {
          const error = new Error("invalid_picture");
          error.statusCode = 406;
          throw error;
        }
      })
      .catch(error => next(error));
  } else if (file) {
    console.log(file.file);
    res.status(200).json({ message: "valid_picture" });

    // sharp(file)
    //   .metadata()
    //   .then(metadata => {
    //     console.log(metadata.width, metadata.height);
    //   });
  }
};
module.exports = {
  validateImage
};
