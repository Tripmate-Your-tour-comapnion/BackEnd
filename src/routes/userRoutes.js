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
  getSingleProvider,
  getAllUsers,
  getSingleUser,
  logout,
  getLoginStatus,
  getCounts,
  searchAgent,
  searchShop,
  verifyEmail,
  getConfirmStatus,
  getMyActivity,
  userInfoWithToken,
} = require("../controller/userController");
const auth_mw = require("../middleware/auth_mw");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", Login);
router.get("/logout", logout);
router.get("/count-all", getCounts);
router.post("/change-password", auth_mw, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.get("/search-hotel/:key?", searchHotel);
router.get("/search-shop/:key?", searchShop);
router.get("/search-agent/:key?", searchAgent);
router.get("/get-user-status", getLoginStatus);
router.get("/get-confirm-status", getConfirmStatus);
router.get("/get-single-provider/:id?", getSingleProvider);
router.get("/get-all-users/", auth_mw, getAllUsers);
router.get("/get-single-user", auth_mw, getSingleUser);
router.get("/get-user-info", auth_mw, userInfo);
router.get("/get-user-with-token/:token", userInfoWithToken);
router.put("/verify-user/", auth_mw, verifyUser);
router.put("/ban-user", auth_mw, banUser);
router.put("/verify-email/:verifyToken", verifyEmail);
router.get("/get-my-activity", auth_mw, getMyActivity);

module.exports = router;
