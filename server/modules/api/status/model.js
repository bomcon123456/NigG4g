const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
  alt: {
    type: String,
    required: false
  },
  src: {
    type: String,
    required: false
  },
  name: {
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
