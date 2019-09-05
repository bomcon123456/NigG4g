const axios = require("axios");
const streamifier = require("streamifier");

const Post = require("./model");
const User = require("../users/model");

const {
  saveImagesToMultipleSize,
  saveVideoToStorage,
  saveVideoToMultipleType
} = require("./util-function");

//@TODO: Add API for change comments's votes

const createPost = async (req, res, next) => {
  const { title, tags, url, nsfw, category, type, attributeLink } = req.body;
  let savedTags = JSON.parse(tags);
  savedTags = savedTags.map(each => {
    let lowercase = each.toLowerCase();
    lowercase = lowercase.replace(/\s+/g, "-");
    return lowercase;
  });
  let buffer = null;
  let result = null;
  let file = req.file;
  try {
    if (url) {
      const index = url.indexOf("?");
      let newUrl = url;
      if (index !== -1) {
        newUrl = url.slice(0, index);
        console.log(newUrl);
      }
      const response = await axios.get(newUrl, {
        responseType: "arraybuffer"
      });
      buffer = Buffer.from(response.data, "binary");
    } else if (file) {
      buffer = file.buffer;
    }
    if (type === "Photo") {
      const data = await saveImagesToMultipleSize(buffer);
      const post = new Post({
        _id: data._id,
        title: title,
        images: {
          image460: {
            height: data.height460,
            width: data.width460,
            url: `${process.env.IMAGE_DIR}/${data._id}_460.jpg`,
            webpUrl: `${process.env.IMAGE_DIR}/${data._id}_460.webp`
          },
          image700: {
            height: data.height700,
            width: data.width700,
            url: `${process.env.IMAGE_DIR}/${data._id}_700.jpg`,
            webpUrl: `${process.env.IMAGE_DIR}/${data._id}_700.webp`
          }
        },
        createdBy: req.userId,
        categoryId: category,
        tags: tags,
        type: "Photo",
        nsfw: nsfw
      });
      result = await post.save();
    } else if (type === "Animated") {
      const videoStream = streamifier.createReadStream(buffer);
      const data = await saveVideoToStorage(videoStream);
      const post = new Post({
        ...data,
        title: title,
        createdBy: req.userId,
        categoryId: category,
        tags: savedTags,
        type: "Animated",
        nsfw: nsfw
      });
      result = await post.save();
    }
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        posts: result._id
      }
    });
    res.status(200).json({
      message: "Hail Hydra",
      data: {
        _id: result._id,
        redirect: `/gag/${result._id}`
      }
    });
    if (type === "Animated") {
      try {
        const { dir } = await saveVideoToMultipleType(result._id);
        let post = await Post.findById(result._id);
        let newImages = {
          ...post.images
        };
        newImages.image460svwm = {
          ...post.images.image460sv
        };
        newImages.image460svwm.url = `${process.env.IMAGE_DIR}/${dir[2]}`;
        newImages.image460sv = {
          ...post.images.image460sv,
          vp9Url: `${process.env.IMAGE_DIR}/${dir[1]}`
          // h265Url: `${process.env.IMAGE_DIR}/${dir[0]}` -> @NOTE: Commented because convert takes longer
        };
        post.images = newImages;
        await post.save();
        console.log("[LAZY_CONVERTING_VIDEO_FINISHED]");
      } catch (err) {
        console.log("[LAZY_CONVERTING_VIDEO]", err);
      }
    }
  } catch (err) {
    console.log("[CREATE_POST_ERROR]", err);
    next(err);
  }
};

//@TODO: reduce the data that we get.
const getPosts = (req, res, next) => {
  const page = req.query.page || 1;
  const tag = req.query.tag || null;
  const catId = req.query.catId || null;

  let options = {
    active: true
  };
  if (catId !== null) {
    options = {
      ...options,
      categoryId: catId
    };
  }
  if (tag !== null) {
    let lowercaseTag = tag.toLowerCase();
    lowercaseTag = lowercaseTag.replace(/\s+/g, "-");
    options = {
      ...options,
      tags: {
        $all: lowercaseTag
      }
    };
  }
  return Post.find(options)
    .sort({
      createdAt: -1
    })
    .skip((page - 1) * 20)
    .limit(20)
    .populate("createdBy", "username avatarURL")
    .populate("categoryId")
    .exec()
    .then(data => {
      let nextPage = page ? +page + 1 : 2;
      let hasMoreItems = true;
      if (data.length < 20) {
        hasMoreItems = false;
      }
      let nextLink = hasMoreItems ? nextPage : null;
      res.status(200).json({
        message: "fetch_posts_successfully",
        post: data,
        nextLink,
        hasMoreItems
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

// @TODO: Populate subcomment
const getPost = (req, res, next) => {
  const postId = req.params.postId;
  return Post.findOne({
    active: true,
    _id: postId
  })
    .populate("comments.createdBy", "username avatarURL")
    .populate("categoryId")
    .populate("createdBy", "username avatarURL")
    .exec()
    .then(post => {
      if (!post) {
        const error = new Error("post_not_found");
        error.statusCode = 400;
        throw error;
      }
      res.status(200).json({
        message: "fetch_post_successfully",
        post: post
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

// @TODO: NEED VERY BIG REWORK!
const updatePost = (req, res, next) => {};

const deletePost = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;

  return Post.updateOne(
    {
      _id: postId,
      createdBy: userId,
      active: true
    },
    {
      active: false
    }
  )
    .then(result => {
      if (!result.nModified) {
        const error = new Error("post_not_found");
        error.statusCode = 400;
        throw error;
      }
      res.status(200).json({
        message: "post_deleted_successfully",
        postId: postId
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  deletePost
};
