const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  verification_status: {
    type: String,
    default: "pending",
  },
});
const User = mongoose.model("user", userSchema);
module.exports = User;
