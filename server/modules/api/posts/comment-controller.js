const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const mongoose = require("mongoose");

const Post = require("./model");

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
      saveUrl = `${process.env.COMMENT_ASSETS_DIR}/${id}_700.gif`;
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
        upVotes: "$comments.upVotes",
        downVotes: "$comments.downVotes",
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

module.exports = {
  addComment,
  getComments,
  getComment,
  deleteComment
};
