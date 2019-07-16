const sharp = require("sharp");
const shortid = require("shortid");
const FfmpegCommand = require("fluent-ffmpeg");
const fs = require("fs");

//Resize then save to folder
/**
 * 1. image460: if the image's width is >= 460px -> resize, if not, stay the same
 * 2. image700:
 ******* if the image's width is <= 700px && >= 460px: use that image
 ******* if the image's width is >= 700px : resize to 700px
 ******* if the image's width is <= 460px: use image460
 */
const saveImagesToMultipleSize = buffer => {
  const image = sharp(buffer);
  const _id = shortid.generate();
  let width, height;
  let width460, width700, height460, height700;
  return image
    .metadata()
    .then(metadata => {
      width = metadata.width;
      height = metadata.height;
      return;
    })
    .then(() => {
      if (width >= 460) {
        return image
          .resize(460, null, {
            kernel: sharp.kernel.cubic
          })
          .jpeg({
            quality: 100
          })
          .toFile(`./uploads/images/${_id}_460.jpg`)
          .then(() =>
            image
              .webp({
                quality: 100,
                lossless: true
              })
              .toFile(`./uploads/images/${_id}_460.webp`)
          );
      } else {
        return image
          .jpeg({
            quality: 100
          })
          .toFile(`./uploads/images/${_id}_460.jpg`)
          .then(() =>
            image
              .webp({
                quality: 100,
                lossless: true
              })
              .toFile(`./uploads/images/${_id}_460.webp`)
          );
      }
    })
    .then(response => {
      width460 = response.width;
      height460 = response.height;
      if (width <= 700 && width >= 460) {
        return image
          .jpeg({
            quality: 100
          })
          .toFile(`./uploads/images/${_id}_700.jpg`)
          .then(() =>
            image
              .webp({
                quality: 100,
                lossless: true
              })
              .toFile(`./uploads/images/${_id}_700.webp`)
          );
      } else if (width <= 460) {
        return image
          .resize(460, null, {
            kernel: sharp.kernel.cubic
          })
          .jpeg({
            quality: 100
          })
          .toFile(`./uploads/images/${_id}_700.jpg`)
          .then(() =>
            image
              .webp({
                quality: 100,
                lossless: true
              })
              .toFile(`./uploads/images/${_id}_700.webp`)
          );
      } else {
        return image
          .resize(700, null, {
            kernel: sharp.kernel.cubic
          })
          .jpeg({
            quality: 100
          })
          .toFile(`./uploads/images/${_id}_700.jpg`)
          .then(() =>
            image
              .webp({
                quality: 100,
                lossless: true
              })
              .toFile(`./uploads/images/${_id}_700.webp`)
          );
      }
    })
    .then(response => {
      width700 = response.width;
      height700 = response.height;
      return { _id, width460, height460, width700, height700 };
    })
    .catch(err => {
      throw err;
    });
};

const getVideoInfoFromStreams = dir => {
  return new Promise((resolve, reject) => {
    const command = FfmpegCommand.ffprobe(dir, function(err, metadata) {
      if (metadata && metadata.streams) {
        let result = {
          hasAudio: metadata.streams.length >= 2 ? true : false,
          duration: metadata.streams[0].duration,
          width: metadata.streams[0].width,
          height: metadata.streams[0].height
        };
        resolve(result);
      } else {
        reject(new Error("get_meta_file_not_found"));
      }
    });
  });
};

const saveStreamToTempVid = (videoStream, _id) => {
  return new Promise((resolve, reject) => {
    console.log(`[PROCESSING_TEMP_VID]${_id}`);
    let command = new FfmpegCommand(videoStream)
      .output(`./uploads/images/${_id}_processing.mp4`)
      .on("error", function(err, stdout, stderr) {
        reject(new Error("[video_processing_failed]save_stream_to_temp_vid"));
      })
      .on("end", function() {
        resolve({
          dir: `./uploads/images/${_id}_processing.mp4`
        });
      })
      .run();
  });
};

const takeOneFrameOfVid = (dir, _id) => {
  return new Promise((resolve, reject) => {
    let command = new FfmpegCommand(dir)
      .takeFrames(1)
      .output(`./uploads/images/${_id}_460.jpg`)
      .on("error", function(err, stdout, stderr) {
        reject(new Error("video_processing_faled"));
      })
      .on("end", function() {
        resolve({
          dir: `./uploads/images/${_id}_460.jpg`
        });
      })
      .run();
  });
};

const resizeAndEncodeVideo = (dir, _id) => {
  return new Promise((resolve, reject) => {
    console.log(`[START_PROCESSING_RESIZE_ENCODE]${_id}`);
    let command = new FfmpegCommand(dir)

      .takeFrames(1)
      .output(`./uploads/images/${_id}_460s.jpg`)

      .output(`./uploads/images/${_id}_460sv.mp4`)
      .videoCodec("libx264")
      .size("460x?")

      // .output(`./uploads/images/${_id}_460svh265.mp4`)
      // .videoCodec("libx265")
      // .size("460x?")

      // .output(`./uploads/images/${_id}_460svvp9.webm`)
      // .videoCodec("libvpx-vp9")
      // .size("460x?")

      .on("error", function(err, stdout, stderr) {
        console.log(err);
        reject(new Error("[video_converting_failed]resize_encode"));
      })
      .on("end", function() {
        fs.unlink(`./uploads/images/${_id}_processing.mp4`, () => {
          console.log(`[PROCESSING_RESIZE_ENCODE_COMPLETE]${_id}`);
        });
        resolve({
          dir: [`${_id}_460sv.mp4`, `${_id}_460s.jpg`],
          width: 460
        });
      })
      .run();
  });
};

const encodeVideo = (dir, _id, metadata) => {
  return new Promise((resolve, reject) => {
    console.log(`[START_ENCODE_PROCESSING]${_id}`);
    let command = new FfmpegCommand(dir)
      .takeFrames(1)
      .output(`./uploads/images/${_id}_460s.jpg`)

      // .output(`./uploads/images/${_id}_460svh265.mp4`)
      // .videoCodec("libx265")

      // .output(`./uploads/images/${_id}_460svvp9.webm`)
      // .videoCodec("libvpx-vp9")

      .on("error", function(err, stdout, stderr) {
        console.log(err);
        reject(new Error("[video_converting_failed]encode"));
      })
      .on("end", function() {
        fs.rename(
          `./uploads/images/${_id}_processing.mp4`,
          `./uploads/images/${_id}_460sv.mp4`,
          () => {
            console.log(`[ENCODE_PROCESSING_COMPLETE]${_id}`);
          }
        );
        resolve({
          dir: [`${_id}_460sv.mp4`, `${_id}_460s.jpg`],
          width: metadata.width,
          height: metadata.height
        });
      })
      .run();
  });
};

const saveVideoToMultipleType = _id => {
  return new Promise((resolve, reject) => {
    console.log(`[START_MULTIPLE_PROCESSING]${_id}`);
    let command = new FfmpegCommand(`./uploads/images/${_id}_460sv.mp4`)

      // .output(`./uploads/images/${_id}_460svh265.mp4`)
      // .videoCodec("libx265")

      .output(`./uploads/images/${_id}_460svvp9.webm`)
      .videoCodec("libvpx-vp9")

      .output(`./uploads/images/${_id}_460svwm.webm`)
      .videoCodec("libvpx")

      .on("error", function(err, stdout, stderr) {
        console.log(err);
        reject(new Error("[video_converting_failed]lazy_convert"));
      })
      .on("end", function() {
        console.log(`[MULTIPLE_PROCESSING_COMPLETE]${_id}`);
        resolve({
          dir: [
            `${_id}_460svh265.mp4`,
            `${_id}_460svvp9.webm`,
            `${_id}_460svwm.webm`
          ]
        });
      })
      .run();
  });
};

const saveVideoToStorage = videoStream => {
  const _id = shortid.generate();
  let directory = null;
  let metadata = null;

  return saveStreamToTempVid(videoStream, _id)
    .then(({ dir }) => {
      console.log(dir);
      directory = dir;
      return getVideoInfoFromStreams(dir);
    })
    .then(data => {
      metadata = data;
      console.log(metadata);
      if (metadata.width > 460) {
        return resizeAndEncodeVideo(directory, _id);
      } else {
        return encodeVideo(directory, _id, metadata);
      }
    })
    .then(result => {
      const height = result.height
        ? result.height
        : (460 / metadata.width) * metadata.height;
      return {
        _id: _id,
        images: {
          image460: {
            width: result.width,
            height: height,
            url: `${process.env.IMAGE_DIR}/${result.dir[1]}`
          },
          image460sv: {
            duration: metadata.duration,
            hasAudio: metadata.hasAudio,
            width: result.width,
            height: height,
            url: `${process.env.IMAGE_DIR}/${result.dir[0]}`
          },
          image700: {
            width: result.width,
            height: height,
            url: `${process.env.IMAGE_DIR}/${result.dir[1]}`
          }
        }
      };
    })
    .catch(err => {
      throw err;
    });

  // return
};

module.exports = {
  saveImagesToMultipleSize,
  saveVideoToStorage,
  saveVideoToMultipleType
};
