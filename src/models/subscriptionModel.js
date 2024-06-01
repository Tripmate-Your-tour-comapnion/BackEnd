const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tour",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
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
  status: {
    type: String,
  },
});
const Subscriptions = new mongoose.model("subscription", subscriptionSchema);
module.exports = Subscriptions;
