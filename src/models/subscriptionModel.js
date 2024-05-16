const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tx_ref: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
  },
});
const Subscriptions = new mongoose.model("subscription", subscriptionSchema);
module.exports = Subscriptions;
