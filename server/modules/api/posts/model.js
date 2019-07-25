const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");

const commentSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: false, default: "" },
    imageUrl: { type: String, required: false, default: "" },
    subcomments: {
      type: [
        {
          createdAt: {
            type: Date,
            default: Date.now()
          },
          createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
          },
          content: { type: String, required: false, default: "" },
          imageURL: { type: String, required: false, default: "" },
          points: { type: Number, default: 0 },
          upVotes: {
            type: [
              {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
              }
            ],
            required: true,
            default: []
          },
          downVotes: {
            type: [
              {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
              }
            ],
            required: true,
            default: []
          }
        }
      ],
      required: false,
      default: []
    },
    points: { type: Number, default: 0 },
    upVotes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      ],
      required: true,
      default: []
    },
    downVotes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      ],
      required: true,
      default: []
    }
  },
  { timestamps: { createdAt: "createdAt" } }
);

const postSchema = new Schema(
  {
    _id: {
      type: String,
      default: shortid.generate
    },
    title: { type: String, required: true },
    images: {
      type: {
        // Image/ Video poster has width <=460px, height is calculated so that the ratio will be the same
        image460: {
          type: {
            height: { type: Number },
            width: { type: Number },
            url: { type: String },
            webpUrl: { type: String }
          },
          require: true
        },
        // Video has width <=460px, height is calculated so that the ratio will be the same
        // hasAudio = 0: GIF, hasAudio = 1: Video
        image460sv: {
          type: {
            duration: { type: Number },
            hasAudio: { type: Boolean },
            width: { type: Number },
            height: { type: Number },
            url: { type: String },
            h265Url: { type: String },
            vp9Url: { type: String }
          },
          require: false
        },
        // Video WebM-format has width <=460px, height is calculated so that the ratio will be the same
        // hasAudio = 0: GIF, hasAudio = 1: Video
        image460svwm: {
          type: {
            duration: { type: Number },
            hasAudio: { type: Boolean },
            width: { type: Number },
            height: { type: Number },
            url: { type: String }
          },
          require: false
        },
        // Image/ Video poster has width <=700px, height is calculated so that the ratio will be the same
        image700: {
          type: {
            height: { type: Number },
            width: { type: Number },
            url: { type: String },
            webpUrl: { type: String }
          },
          require: true
        }
      },
      require: true
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    upVoteCount: { type: Number, default: 0 },
    downVoteCount: { type: Number, default: 0 },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    comments: { type: [commentSchema], default: [] },
    active: { type: Boolean, default: true },
    tags: {
      type: [String],
      default: []
    },
    type: {
      type: String,
      enum: ["Photo", "Animated", "Article"]
    },
    nsfw: {
      type: Boolean,
      default: false
    },
    hasLongPostCover: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Post", postSchema);
