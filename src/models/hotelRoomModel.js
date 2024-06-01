const mongoose = require("mongoose");
const Users = require("./userModel");
const roomSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  room_name: {
    type: String,
    required: true,
  },
  room_image: {
    type: Array,
    required: false,
  },
  room_description: {
    type: String,
    required: true,
  },
  room_price: {
    type: Number,
    required: true,
  },
  room_amount: {
    type: Number,
    required: true,
  },
  room_available: {
    type: Number,
    required: true,
  },
  room_rate: {
    value: {
      type: Number,
      default: 0.0,
    },
    total: {
      type: Number,
      default: 0.0,
    },
    rater_number: {
      type: Number,
      default: 0,
    },
  },
});
const Rooms = new mongoose.model("Rooms", roomSchema);
module.exports = Rooms;
