const sharp = require("sharp");
const shortid = require("shortid");

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

module.exports = {
  saveImagesToMultipleSize
};
