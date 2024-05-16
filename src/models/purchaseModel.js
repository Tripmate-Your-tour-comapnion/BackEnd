const mongoose = require("mongoose");
const Users = require("./userModel");
const Rooms = require("./hotelRoomModel");
const purchaseSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Rooms",
  },
  tx_ref: {
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
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
  },
});
const Purchase = new mongoose.model("purchase", purchaseSchema);
module.exports = Purchase;
