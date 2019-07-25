const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const mongoose = require("mongoose");

const Post = require("./model");

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
        upVotes: "$subcomments.upVotes",
        downVotes: "$subcomments.downVotes",
        "createdBy.avatarURL": "$subcomments.createdBy.avatarURL",
        "createdBy.username": "$subcomments.createdBy.username",
        "createdBy.isPro": "$subcomments.createdBy.isPro",
        "createdBy.statusId": "$subcomments.createdBy.statusId",
        createdAt: "$subcomments.createdAt"
      }
    }
  ];
  return Post.aggregate(pipeline)
    .then(data => {
      data = data.map(subcomment => {
        let createdBy = { ...subcomment.createdBy };
        let keys = Object.keys(createdBy);
        keys.map(key => {
          createdBy[key] = createdBy[key][0];
        });
        subcomment.createdBy = createdBy;
        return subcomment;
      });
      res.status(200).json(data);
    })
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

module.exports = {
  addSubcomment,
  getSubcomment,
  getSubcomments,
  deleteSubcomment
};
