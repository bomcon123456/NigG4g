const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    require: false,
    default: true
  }
});

module.exports = mongoose.model("Category", categorySchema);
