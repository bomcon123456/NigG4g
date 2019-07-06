const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verifySchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 1800 }
});
module.exports = mongoose.model("VerifyToken", verifySchema);
