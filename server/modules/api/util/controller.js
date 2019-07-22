const probe = require("probe-image-size");
const sharp = require("sharp");
const ogs = require("open-graph-scraper");

const checkImageSize = (width, height) => {
  if (width >= 200 && height >= 100) {
    if (
      (width <= 600 && height <= 600) ||
      (width >= 600 && width * height <= 600000)
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const validateImage = async (req, res, next) => {
  const { url } = req.body;
  const file = req.file;
  if (url) {
    probe(url)
      .then(data => {
        const { width, height } = data;
        if (checkImageSize(width, height)) {
          res.status(200).json({ message: "valid_picture" });
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
      .catch(err => next(err));
  } else if (!file) {
    const error = new Error("file_not_valid");
    error.statusCode = 406;
    next(error);
  }
};

const getCommentPreview = (req, res, next) => {
  const file = req.file;
  const image = sharp(file.buffer);
  let format = "";
  if (!file) {
    const error = new Error("file_not_valid");
    error.statusCode = 406;
    next(error);
  } else {
    image
      .metadata()
      .then(metadata => {
        console.log(metadata);
        if (
          metadata.width >= 700 &&
          metadata.width * metadata.height >= 600000
        ) {
          format = metadata.format;
          return image.resize(700).toBuffer();
        } else if (metadata.width <= 200 && metadata.height <= 100) {
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
      .catch(err => next(err));
  }
};

//@TODO: Self-scraper
// const getURL = (req, res, next) => {
//   let http = require("https");

//   let options = {
//     host: "imgur.com",
//     path: "/gallery/08o4WMu"
//   };
//   let data = "";
//   let request = http.request(options, function(res) {
//     res.on("data", function(chunk) {
//       data += chunk;
//     });
//     res.on("end", function() {
//       console.log("ended");
//       // Handle getting <meta> here:
//       const str = data.toString();
//       console.log(str);
//     });
//   });
//   request.on("error", function(e) {
//     console.log(e.message);
//   });
//   request.end();
// };

const getUrl = (req, res, next) => {
  var options = { url: req.body.url };
  let sendData = {};
  ogs(options)
    .then(result => {
      if (result.success && result.data && result.data.ogUrl) {
        const { ogImage, ogVideo, ogType } = result.data;
        let message = "scrapped_successfully";
        if (ogImage && !ogVideo) {
          const { width, height } = ogImage;
          if (width && height) {
            message = checkImageSize(width, height)
              ? "valid_picture"
              : "invalid_picture";
          } else {
            sendData = {
              image: ogImage,
              video: ogVideo,
              type: ogType
            };
            return probe(ogImage.url);
          }
        } else if (ogVideo) {
          message = "valid_video";
        }
        res.status(200).json({
          message: message,
          image: ogImage,
          video: ogVideo,
          type: ogType
        });
      }
    })
    .then(data => {
      if (data) {
        const { width, height } = data;
        if (width && height) {
          if (checkImageSize(width, height)) {
            res.status(200).json({
              message: "valid_picture",
              ...sendData
            });
          } else {
            const error = new Error("invalid_picture");
            error.statusCode = 406;
            throw error;
          }
        }
      }
    })
    .catch(err => {
      console.log("[Scrapper Error]", err);
      next(err);
    });
};

module.exports = {
  validateImage,
  getCommentPreview,
  getUrl
};
