const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentModel = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    content: { type: String, required: true },
    subcomment: { type: [commentModel] },
    point: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: "createdAt" } }
);

const postModel = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    point: { type: Number, default: 0 },
    category: { type: String, required: true },
    comment: { type: [commentModel], default: [] }
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Post", postModel);
