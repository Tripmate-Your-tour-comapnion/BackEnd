const mongoose = require("mongoose");
const User = require("./userModel");
const Rooms = require("./hotelRoomModel");
const reservationSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Rooms",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tx_ref: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
  },
});

const Reservations = mongoose.model("reservation", reservationSchema);
module.exports = Reservations;
