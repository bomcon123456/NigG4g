const probe = require("probe-image-size");
const sharp = require("sharp");
const FfmpegCommand = require("fluent-ffmpeg");
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
};

const validateImage = async (req, res, next) => {
  const { url } = req.body;
  const file = req.file;
  if (url) {
    probe(url)
      .then(data => {
        const { width, height } = data;
        if (width >= 200 && height >= 100) {
          if (checkImageSize(width, height)) {
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

const validateVideo = async (req, res, next) => {
  // if nb_stream =1 => no audio
  const command = FfmpegCommand.ffprobe("./uploads/images/porno.mp4", function(
    err,
    metadata
  ) {
    console.log(metadata);
  });
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
  ogs(options)
    .then(result => {
      if (result.success && result.data && result.data.ogUrl) {
        const { ogImage, ogVideo, ogType } = result.data;
        let message = "scrapped_successfully";
        if (ogImage && !ogVideo) {
          const { width, height } = ogImage;
          if (width && height) {
            message = checkImageSize(width, height)
              ? "valid_url"
              : "invalid_url";
          }
        }
        res.status(200).json({
          message: message,
          image: ogImage,
          video: ogVideo,
          type: ogType
        });
      }
    })
    .catch(err => {
      console.log("[Scrapper Error]", error);
      next(err);
    });
};

module.exports = {
  validateImage,
  getUrl,
  validateVideo
};
