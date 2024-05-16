const path = require("path");
const express = require("express");
const {
  signup,
  Login,
  changePassword,
  userInfo,
  verifyUser,
  banUser,
  forgotPassword,
  resetPassword,
  searchHotel,
} = require("../controller/userController");
const auth_mw = require("../middleware/auth_mw");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", Login);
router.post("/change-password", auth_mw, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password:resetToken", resetPassword);
router.get("/search-hotel/:key?", searchHotel);
router.get("/get-user-info", auth_mw, userInfo);
router.put("/verify-user/:id", auth_mw, verifyUser);
router.put("/ban-user/:id", auth_mw, banUser);

module.exports = router;
