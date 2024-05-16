const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  shop_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  product_name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    required: true,
  },
  product_description: {
    type: String,
    required: true,
  },
  product_images: {
    type: Array,
    required: true,
  },
  product_price: {
    type: Number,
    min: 0,
    required: true,
  },
  product_quantity: {
    type: Number,
    min: 0,
    required: true,
  },
  product_available: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
