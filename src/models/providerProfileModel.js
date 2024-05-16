const User = require("./userModel");
const mongoose = require("mongoose");
const userProfieSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  company_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  profile_image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  bussiness_license: {
    type: String,
    required: true,
  },
  payment_info: {
    acc_name: {
      type: String,
    },
    acc_number: {
      type: String,
    },
    bank: {
      type: String,
    },
    subaccount_id: {
      type: String,
    },
  },
});
const ProviderProfile = mongoose.model("providerProfile", userProfieSchema);
module.exports = ProviderProfile;
