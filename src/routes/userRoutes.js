const path = require("path");
const express = require("express");
const {
  signup,
  Login,
  changePassword,
  logStatus,
  userInfo,
  verifyUser,
  banUser,
} = require("../controller/userController");
const auth_mw = require("../middleware/auth_mw");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", Login);
router.post("/change-password", auth_mw, changePassword);
router.get("/get-log-status", logStatus);
router.get("/get-user-info", auth_mw, userInfo);
router.put("/verify-user", auth_mw, verifyUser);
router.put("/ban-user", auth_mw, banUser);

module.exports = router;
