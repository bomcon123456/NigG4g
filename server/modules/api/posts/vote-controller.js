const Post = require("./model");
const User = require("../users/model");

/**
 * upVote - boolean
 * postId - ObjectId (String)
 */
const updatePostVote = async (req, res, next) => {
  const postId = req.params.postId;
  const { upvote } = req.body;
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

const updateCommentVote = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { upvote } = req.body;
  const userId = req.userId;
  try {
    const postMongoose = await Post.findOne({ _id: postId, active: true });
    const post = postMongoose.toObject();
    if (!postMongoose) {
      const error = new Error("post_not_found");
      error.statusCode = 404;
      throw error;
    }
    const commentIndex = post.comments.findIndex(
      each => each._id.toString() === commentId
    );
    if (commentIndex === -1) {
      const error = new Error("comment_not_found");
      error.statusCode = 404;
      throw error;
    }
    let comment = { ...post.comments[commentIndex] };
    let upVotes = comment.upVotes;
    let downVotes = comment.downVotes;
    const userUpVoteIndex = upVotes.findIndex(
      each => each.toString() === userId
    );
    const userDownVoteIndex = downVotes.findIndex(
      each => each.toString() === userId
    );
    if (userUpVoteIndex !== -1 && upvote) {
      upVotes.splice(userUpVoteIndex, 1);
    } else if (userDownVoteIndex !== -1 && !upvote) {
      downVotes.splice(userUpVoteIndex, 1);
    } else if (userUpVoteIndex === -1 && upvote) {
      upVotes.push(userId);
      if (userDownVoteIndex !== -1) {
        downVotes.splice(userDownVoteIndex, 1);
      }
    } else if (userDownVoteIndex === -1 && !upvote) {
      downVotes.push(userId);
      if (userUpVoteIndex !== -1) {
        upVotes.splice(userUpVoteIndex, 1);
      }
    }
    comment.points = upVotes.length - downVotes.length;
    comment.upVotes = upVotes;
    comment.downVotes = downVotes;
    post.comments[commentIndex] = comment;
    postMongoose.comments = post.comments;
    await postMongoose.save();
    res.status(200).json({
      message: "update_vote_successfully",
      points: comment.points
    });
  } catch (error) {
    next(error);
  }
};

const updateSubcommentVote = async (req, res, next) => {
  const { postId, commentId, subcommentId } = req.params;
  const { upvote } = req.body;
  const userId = req.userId;
  try {
    const postMongoose = await Post.findOne({ _id: postId, active: true });
    const post = postMongoose.toObject();
    if (!postMongoose) {
      const error = new Error("post_not_found");
      error.statusCode = 404;
      throw error;
    }
    const commentIndex = post.comments.findIndex(
      each => each._id.toString() === commentId
    );
    if (commentIndex === -1) {
      const error = new Error("comment_not_found");
      error.statusCode = 404;
      throw error;
    }
    let comment = { ...post.comments[commentIndex] };
    const subCommentIndex = comment.subcomments.findIndex(
      each => each._id.toString() === subcommentId
    );
    if (subCommentIndex === -1) {
      const error = new Error("subcomment_not_found");
      error.statusCode = 404;
      throw error;
    }
    let subcomment = comment.subcomments[subCommentIndex];
    let upVotes = subcomment.upVotes;
    let downVotes = subcomment.downVotes;
    const userUpVoteIndex = upVotes.findIndex(
      each => each.toString() === userId
    );
    const userDownVoteIndex = downVotes.findIndex(
      each => each.toString() === userId
    );
    if (userUpVoteIndex !== -1 && upvote) {
      upVotes.splice(userUpVoteIndex, 1);
    } else if (userDownVoteIndex !== -1 && !upvote) {
      downVotes.splice(userUpVoteIndex, 1);
    } else if (userUpVoteIndex === -1 && upvote) {
      upVotes.push(userId);
      if (userDownVoteIndex !== -1) {
        downVotes.splice(userDownVoteIndex, 1);
      }
    } else if (userDownVoteIndex === -1 && !upvote) {
      downVotes.push(userId);
      if (userUpVoteIndex !== -1) {
        upVotes.splice(userUpVoteIndex, 1);
      }
    }
    subcomment.points = upVotes.length - downVotes.length;
    subcomment.upVotes = upVotes;
    subcomment.downVotes = downVotes;
    post.comments[commentIndex].subcomments[subCommentIndex] = subcomment;
    postMongoose.comments = post.comments;
    await postMongoose.save();
    res.status(200).json({
      message: "update_vote_successfully",
      points: subcomment.points
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updatePostVote,
  updateCommentVote,
  updateSubcommentVote
};
