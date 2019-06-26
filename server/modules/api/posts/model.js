const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentModel = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imageURL: { type: String, required: false },
    subcomment: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: "commentModel"
      }],
      required: false,
      default: []
    },
    point: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: "createdAt" } }
);

const postModel = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    point: { type: Number, default: 0 },
    category: { type: String, required: true },
    comment: { type: [commentModel], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Post", postModel);
