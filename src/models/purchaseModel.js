const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./productModel");
const purchaseSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
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
