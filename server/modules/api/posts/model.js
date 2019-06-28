const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: false, default: "" },
    imageURL: { type: String, required: false, default: "" },
    subcomments: {
      type: [
        {
          createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
          },
          content: { type: String, required: false, default: "" },
          imageURL: { type: String, required: false, default: "" },
          point: { type: Number, default: 0 }
        }
      ],
      required: false,
      default: []
    },
    points: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: "createdAt" } }
);

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    points: { type: Number, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    comments: { type: [commentSchema], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Post", postSchema);
