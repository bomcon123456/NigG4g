const probe = require("probe-image-size");
const sharp = require("sharp");

const validateImage = async (req, res, next) => {
  const { url } = req.body;
  const file = req.file;
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
    const image = sharp(file.buffer);
    let format = "";
    image
      .metadata()
      .then(metadata => {
        if (
          metadata.width >= 600 &&
          metadata.width * metadata.height >= 600000
        ) {
          console.log(format);
          return image.resize(600, 600).toBuffer();
        } else if (metadata.width < 200 && metadata.height < 100) {
          const error = new Error("invalid_picture");
          error.statusCode = 406;
          throw error;
        }
        return req.file.buffer;
      })
      .then(data => {
        let base64 = data.toString("base64");
        base64 = `data:image/${format};base64,` + base64;
        res.status(200).json({ message: "valid_picture", data: base64 });
      })
      .catch(err => console.log(err));
  }
};
module.exports = {
  validateImage
};
