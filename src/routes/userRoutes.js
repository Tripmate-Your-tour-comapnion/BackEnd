const path = require("path");
const express = require("express");
const {
  signup,
  Login,
  changePassword,
  logStatus,
  userInfo,
} = require("../controller/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", Login);
router.post("/change-password", changePassword);
router.get("/get-log-status", logStatus);
router.get("/get-user-info", userInfo);

module.exports = router;
