const User = require("./userModel");
const mongoose = require("mongoose");
const touristProfileSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  passport_id: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  profile_image: {
    type: String,
    required: true,
  },
});
const TouristProfile = mongoose.model("touristProfile", touristProfileSchema);
module.exports = TouristProfile;
