const mongoose = require("mongoose");
const User = require("./userModel");
const tourSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  package_name: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    required: false,
  },
  package_description: {
    type: String,
    required: true,
  },
  package_includes: {
    type: Array,
    required: true,
  },
  package_price: {
    type: Number,
    required: true,
  },
  total_space: {
    type: Number,
    required: true,
  },
  space_left: {
    type: Number,
    required: true,
  },
  rate: {
    value: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    rater_number: {
      type: Number,
      default: 0,
    },
  },
});
const Tours = new mongoose.model("Tour", tourSchema);
module.exports = Tours;
