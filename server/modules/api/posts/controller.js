const Post = require("./model");
const User = require("../users/model");
const axios = require("axios");
const sharp = require("sharp");
const streamifier = require("streamifier");
const fs = require("fs");
const mongoose = require("mongoose");
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

  let options = {
    active: true
  };
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

/**
 * upVote - boolean
 * postId - ObjectId (String)
 */
const updatePostVote = async (req, res, next) => {
  const postId = req.params.postId;
  const { upvote } = req.query;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("post_not_found");
      error.statusCode = 400;
      throw error;
    }
    if (!user) {
      const error = new Error("not_authenticated");
      error.statusCode = 401;
      throw error;
    }
    let downVotes = [...user.downVotes];
    let upVotes = [...user.upVotes];
    let downIndex = downVotes.findIndex(each => each === postId);
    let upIndex = upVotes.findIndex(each => each === postId);

    // If user is up-voting this post
    if (+upvote === 1) {
      // If user down-voted this post before
      if (downIndex !== -1) {
        post.downVoteCount -= 1;
        downVotes.splice(downIndex, 1);
      }
      // up-vote
      if (upIndex === -1) {
        upVotes.push(postId);
        post.upVoteCount += 1;
      } else if (upIndex !== -1) {
        post.upVoteCount -= 1;
        upVotes.splice(upIndex, 1);
      }
    }
    // down-voting
    else {
      if (upIndex !== -1) {
        post.upVoteCount -= 1;
        upVotes.splice(upIndex, 1);
      }
      if (downIndex === -1) {
        downVotes.push(postId);
        post.downVoteCount += 1;
      } else if (downIndex !== -1) {
        post.downVoteCount -= 1;

        downVotes.splice(downIndex, 1);
      }
    }
    if (post.downVoteCount < 0) {
      post.downVoteCount = 0;
    }
    if (post.upVoteCount < 0) {
      post.upVoteCount = 0;
    }
    user.upVotes = upVotes;
    user.downVotes = downVotes;

    let result = await post.save();
    await user.save();
    res.status(200).json({
      message: "update_vote_successfully",
      upVoteCount: result.upVoteCount,
      downVoteCount: result.downVoteCount
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
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

// @TODO: Process Image
const addComment = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;
  const file = req.file;
  const id = mongoose.Types.ObjectId();
  let saveUrl = imageUrl;
  let buffer = null;
  try {
    const post = await Post.findById({
      _id: postId
    });
    if (!post) {
      const error = new Error("post_not_found");
      error.statusCode = 404;
      throw error;
    }
    if (file) {
      const image = sharp(file.buffer);
      const metadata = await image.metadata();
      if (metadata.format !== "gif") {
        if (metadata.width >= 700) {
          await image
            .resize(700, null, {
              kernel: sharp.kernel.cubic
            })
            .jpeg({
              quality: 100
            })
            .toFile(`./uploads/comments-images/${id}_700.jpg`);
        } else {
          await image
            .jpeg({
              quality: 100
            })
            .toFile(`./uploads/comments-images/${id}_700.jpg`);
        }
        saveUrl = `${process.env.COMMENT_ASSETS_DIR}/${id}_700.jpg`;
      }
    } else if (imageUrl) {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });
      buffer = Buffer.from(response.data, "binary");
      saveUrl = `./uploads/comments-images/${id}_700.gif`;
      fs.writeFileSync(saveUrl, buffer, "binary");
    }
    const newComment = {
      _id: id,
      createdBy: userId,
      content: content,
      imageUrl: saveUrl
    };
    console.log(newComment);
    post.comments.push(newComment);
    await post.save();
    res.status(200).json({
      message: "add_comment_successfully",
      postId: post._id,
      commentId: id
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getComments = (req, res, next) => {
  const postId = req.params.postId;
  const page = req.query.page || 1;
  const query = req.query.query;
  let sortQuery = {
    $sort: {
      points: -1
    }
  };
  if (query === "fresh") {
    sortQuery = {
      $sort: {
        createdAt: -1
      }
    };
  }
  const take = 10;
  const skip = (page - 1) * take;
  let pipeline = [
    {
      $match: {
        _id: postId
      }
    },
    {
      $skip: skip
    },
    {
      $limit: take
    },
    {
      $project: {
        comments: 1,
        _id: 1
      }
    },
    {
      $unwind: "$comments"
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.createdBy",
        foreignField: "_id",
        as: "comments.createdBy"
      }
    },
    {
      $unwind: "$comments.createdBy"
    },
    {
      $project: {
        _id: "$comments._id",
        content: "$comments.content",
        imageUrl: "$comments.imageUrl",
        points: "$comments.points",
        subcommentsLength: {
          $size: "$comments.subcomments"
        },
        "createdBy.avatarURL": "$comments.createdBy.avatarURL",
        "createdBy.username": "$comments.createdBy.username",
        "createdBy.isPro": "$comments.createdBy.isPro",
        "createdBy.statusId": "$comments.createdBy.statusId",
        createdAt: "$comments.createdAt"
      }
    },
    sortQuery
  ];
  return Post.aggregate(pipeline)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

const getComment = (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  return Post.findOne({
    _id: postId,
    active: true
  })
    .then(data => {
      if (!data) {
        const error = new Error("post_not_found");
        error.statusCode = 400;
        throw error;
      }
      const comment = data.comments.find(comment => {
        return comment._id.toString() === commentId.toString();
      });
      if (!comment) {
        const error = new Error("comment_not_found");
        error.statusCode = 400;
        throw error;
      }
      res.status(200).json({
        message: "fetch_comment_successfully",
        comment: comment
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const commentId = req.params.commentId;

  return Post.findById(postId)
    .then(data => {
      if (!data) {
        const error = new Error("post_not_found");
        error.statusCode = 404;
        throw error;
      }
      const comment = data.comments.find(comment => {
        return comment._id.toString() === commentId.toString();
      });
      if (!comment) {
        const error = new Error("comment_not_found");
        error.statusCode = 404;
        throw error;
      }
      if (
        comment.createdBy.toString() !== userId.toString() &&
        post.createdBy.toString() !== userId.toString()
      ) {
        const error = new Error("action_not_authorized");
        error.statusCode = 401;
        throw error;
      }
      post.comments = post.comments.filter(
        each => each._id.toString() !== comment._id.toString()
      );
      return post.save();
    })
    .then(post => {
      res.status(200).json({
        message: "delete_comment_successfully",
        commentId: commentId
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

const updateComment = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const commentId = req.params.commentId;
  const content = req.body.content;
  const imageURL = req.body.imageURL;

  return Post.findOne({
    _id: postId,
    active: true
  })
    .then(data => {
      if (!data) {
        const error = new Error("post_not_found");
        error.statusCode = 404;
        throw error;
      }
      const comment = data.comments.find(comment => {
        return comment._id.toString() === commentId.toString();
      });
      if (!comment) {
        const error = new Error("comment_not_found");
        error.statusCode = 404;
        throw error;
      }
      if (
        comment.createdBy.toString() !== userId.toString() &&
        data.createdBy.toString() !== userId.toString()
      ) {
        const error = new Error("action_not_authorized");
        error.statusCode = 401;
        throw error;
      }

      comment.content = content ? content : comment.content;
      comment.imageURL = imageURL ? imageURL : comment.imageURL;
      return data.save();
    })
    .then(result => {
      res.status(200).json({
        message: "update_comment_successfully",
        commentId: commentId
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

const addSubcomment = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const commentId = req.params.commentId;
  const file = req.file;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;
  const id = mongoose.Types.ObjectId();
  let saveUrl = imageUrl;
  let buffer = null;

  try {
    const post = await Post.findOne({
      _id: postId,
      active: true
    });
    if (!post) {
      const error = new Error("post_not_found");
      error.statusCode = 406;
      throw error;
    }
    const comment = post.comments.find(comment => {
      return comment._id.toString() === commentId.toString();
    });
    if (!comment) {
      const error = new Error("comment_not_found");
      error.statusCode = 406;
      throw error;
    }

    if (file) {
      const image = sharp(file.buffer);
      const metadata = await image.metadata();
      if (metadata.format !== "gif") {
        if (metadata.width >= 700) {
          await image
            .resize(700, null, {
              kernel: sharp.kernel.cubic
            })
            .jpeg({
              quality: 100
            })
            .toFile(`./uploads/comments-images/${id}_700.jpg`);
        } else {
          await image
            .jpeg({
              quality: 100
            })
            .toFile(`./uploads/comments-images/${id}_700.jpg`);
        }
        saveUrl = `${process.env.COMMENT_ASSETS_DIR}/${id}_700.jpg`;
      }
    } else if (imageUrl) {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });
      buffer = Buffer.from(response.data, "binary");
      saveUrl = `./uploads/comments-images/${id}_700.gif`;
      fs.writeFileSync(saveUrl, buffer, "binary");
    }

    const subcomment = {
      createdBy: userId,
      content: content,
      imageURL: saveUrl,
      _id: id
    };
    comment.subcomments.push(subcomment);
    await post.save();

    res.status(200).json({
      message: "subcomment_created_successfully",
      postId: postId,
      commentId: comment._id,
      subcommentId: id
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getSubcomment = (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const subcommentId = req.params.subcommentId;

  return Post.findOne({
    _id: postId,
    active: true
  })
    .then(result => {
      console.log(result);
      if (!result) {
        const error = new Error("post_not_found");
        error.statusCode = 404;
        throw error;
      }
      const comment = result.comments.find(
        each => each._id.toString() === commentId
      );
      if (!comment) {
        const error = new Error("comment_not_found");
        error.statusCode = 404;
        throw error;
      }

      const subcomment = comment.subcomments.find(subcomment => {
        return subcomment._id.toString() === subcommentId.toString();
      });

      if (!subcomment) {
        const error = new Error("subcomment_not_found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "fetch_subcomment_successfully",
        Subcomment: subcomment
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

const getSubcomments = (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  console.log(commentId);
  const page = req.query.page || 1;
  let pipeline = [
    {
      $match: {
        _id: postId
      }
    },
    {
      $project: {
        _id: 0,
        comments: 1
      }
    },
    {
      $unwind: "$comments"
    },
    {
      $match: {
        "comments._id": mongoose.Types.ObjectId(commentId)
      }
    },
    {
      $project: {
        subcomments: "$comments.subcomments"
      }
    },
    {
      $unwind: "$subcomments"
    },
    {
      $lookup: {
        from: "users",
        localField: "subcomments.createdBy",
        foreignField: "_id",
        as: "subcomments.createdBy"
      }
    },
    {
      $project: {
        _id: "$subcomments._id",
        content: "$subcomments.content",
        imageUrl: "$subcomments.imageUrl",
        points: "$subcomments.points",
        "createdBy.avatarURL": "$subcomments.createdBy.avatarURL",
        "createdBy.username": "$subcomments.createdBy.username",
        "createdBy.isPro": "$subcomments.createdBy.isPro",
        "createdBy.statusId": "$subcomments.createdBy.statusId",
        createdAt: "$subcomments.createdAt"
      }
    }
  ];
  return Post.aggregate(pipeline)
    .then(data => res.status(200).json(data))
    .catch(err => {
      next(err);
    });
};

const deleteSubcomment = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const commentId = req.params.commentId;
  const subcommentId = req.params.subcommentId;

  return Post.findOne({
    _id: postId,
    active: true
  })
    .then(result => {
      console.log(result);
      if (!result) {
        const error = new Error("post_not_found");
        error.statusCode = 404;
        throw error;
      }
      const commentIndex = result.comments.findIndex(
        each => each._id.toString() === commentId
      );
      if (commentIndex === -1) {
        const error = new Error("comment_not_found");
        error.statusCode = 404;
        throw error;
      }
      const comment = result.comments[commentIndex];
      const newSubcomment = comment.subcomments.filter(subcomment => {
        return subcomment._id.toString() !== subcommentId.toString();
      });

      if (newSubcomment.length === comment.subcomments.length) {
        const error = new Error("subcomment_not_found");
        error.statusCode = 404;
        throw error;
      }

      if (
        newSubcomment.createdBy.toString() !== userId.toString() &&
        result.createdBy.toString() !== userId.toString()
      ) {
        const error = new Error("action_not_authorized");
        error.statusCode = 400;
        throw error;
      }

      result.comments[commentIndex].subcomments = newSubcomment;
      return result.save();
    })
    .then(result => {
      res.status(200).json({
        message: "delete_subcomment_successfully",
        commentId: commentId
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

const updateSubcomment = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const commentId = req.params.commentId;
  const content = req.body.content;
  const imageURL = req.body.imageURL;
  const subcommentId = req.params.subcommentId;

  return Post.findOne({
    _id: postId,
    active: true
  })
    .then(result => {
      console.log(result);
      if (!result) {
        const error = new Error("post_not_found");
        error.statusCode = 404;
        throw error;
      }
      const comment = result.comments.find(
        each => each._id.toString() === commentId
      );
      if (!comment) {
        const error = new Error("comment_not_found");
        error.statusCode = 404;
        throw error;
      }

      const subcomment = comment.subcomments.find(subcomment => {
        return subcomment._id.toString() === subcommentId.toString();
      });

      if (!subcomment) {
        const error = new Error("subcomment_not_found");
        error.statusCode = 404;
        throw error;
      }

      if (
        newSubcomment.createdBy.toString() !== userId.toString() &&
        result.createdBy.toString() !== userId.toString()
      ) {
        const error = new Error("action_not_authorized");
        error.statusCode = 400;
        throw error;
      }

      subcomment.content = content ? content : subcomment.content;
      subcomment.imageURL = imageURL ? imageURL : subcomment.imageURL;

      return result.save();
    })
    .then(result => {
      res.status(200).json({
        message: "update_subcomment_successfully",
        commentId: commentId
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  updatePostVote,
  addComment,
  getComments,
  getComment,
  deleteComment,
  updateComment,
  addSubcomment,
  getSubcomment,
  getSubcomments,
  deleteSubcomment,
  updateSubcomment
};
