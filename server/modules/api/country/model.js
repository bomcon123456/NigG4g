const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema = new Schema({
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

module.exports = mongoose.model("Country", countrySchema);
