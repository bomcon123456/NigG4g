const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
  alt: {
    type: String,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    require: false,
    default: true
  }
});

module.exports = mongoose.model("Status", statusSchema);
