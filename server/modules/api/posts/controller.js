const Post = require("./model");

const createPost = (req, res, next) => {
  req.body.userId = req.userId;
  // req.body.content = !req.file ? "nourl" : "localhost:6969/images/" + file.filename

  const title = req.body.title;
  const content = req.body.content;
  const userId = req.body.userId;
  const category = req.body.category;
  console.log(req.file)
  const post = new Post({
    title: title,
    content: content,
    createdBy: userId,
    category: category
  });
  return post
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Post created",
        postId: result._id
      })
    }).catch((err) => {
      console.log(err);
      next(err);
    });
};

const getAllPosts = (req, res, next) => {
  const page = req.query.page || 1;
  return Post
    .find({
      active: true
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * 20)
    .limit(20)
    .select("_id title content createdAt point comment category")
    .populate("createdBy", "username avatarURL")
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}

const getPost = (req, res, next) => {
  const postId = req.params.postId;
  return Post.findOne({
    active: true,
    _id: postId
  })
    .then(post => {
      if (!post) {
        const error = new Error("Post is not existed.");
        error.statusCode = 400;
        throw error;
      }
      res.status(200).json({
        message: "Post information retreived",
        post: post
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}

const updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;

  return Post.findOne({
    active: true,
    _id: postId
  })
    .then(post => {
      if (!post) {
        const error = new Error("Post is not existed.");
        error.statusCode = 400;
        throw error;
      }
      post.title = title ? title : post.title;
      post.content = content ? content : post.content;
      post.category = category ? category : post.category;
      return post.save().then(result => {
        res.status(200).json({
          message: "Update post successfully",
          postId: postId
        });
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}

const deletePost = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;

  return Post.update(
    {
      _id: postId,
      createdBy: userId
    },
    { active: false }
  )
    .then(result => {
      res.status(200).json({
        message: "Post has been deleted",
        postId: postId
      })
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}

const addComment = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const content = req.body.content;
  const imageURL = req.body.imageURL;
  console.log(imageURL)

  return Post.update(
    {
      _id: postId
    },
    {
      $push: { comment: { createdBy: userId, content: content, imageURL: imageURL } }
    }
  )
    .then(data => {
      res.status(200).json({
        message: "User comments on post",
        content: content,
        imageURL: imageURL,
        userId: userId
      })
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}

const deleteComment = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const commentId = req.params.commentId;

  return Post.update(
    {
      _id: postId
    },
    {
      $pull: {
        comment: {
          _id: commentId,
          createdBy: userId
        }
      }
    }
  )
    .then(data => {
      res.status(200).json({
        message: "Comment has been deleted",
        commentId: commentId
      })
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}

// const updateComment = (req, res, next) => {
//   const postId = req.params.postId;
//   const userId = req.userId;
//   const commentId = req.params.commentId;
//   const content = req.body.content;
//   const imageURL = req.body.imageURL;

//   return Post.update(
//     {
//       '_id': postId,
//       'comment._id': commentId
//     },
//     {
//       "$set": {
//         "comment.$.content": content,
//         "comment.$.imageURL": imageURL,
//         "comment.$.createdBy": userId
//       }
//     }
//   )
//     .then(result => {
//       res.status(200).json({
//         message: "Update comment successfully",
//         commentId: commentId
//       })
//     })
//     .catch(err => {
//       console.log(err);
//       next(err)
//     })
// }

const updateComment = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  const commentId = req.params.commentId;
  const content = req.body.content;
  const imageURL = req.body.imageURL;

  return Post.findOne({
    '_id': postId,
  })
    .then(data => {
      const comment = data.comment.find((comment) => {
        return comment._id === commentId.toString();
      })
      if (!comment) {
        const error = new Error("Comment is not existed.");
        error.statusCode = 400;
        throw error;
      }
      comment.createdBy = userId;
      comment.content = content ? content : comment.content;
      comment.imageURL = imageURL ? imageURL : comment.imageURL;
      return data.save().then(result => {
        res.status(200).json({
          message: "Update comment successfully",
          commentId: commentId
        })
      })
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  updateComment
}