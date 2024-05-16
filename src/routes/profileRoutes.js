const {
  providerCredential,
  touristCredential,
  updateProviderCredential,
  updateTouristCredential,
} = require("../controller/profileController");
const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.post(
  "/provider-credential",
  auth_mw,
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "bussiness_license", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  providerCredential
);

router.post(
  "/tourist-credential",
  auth_mw,
  upload.single("profile_image"),
  touristCredential
);

router.put(
  "/update-provider-credential",
  auth_mw,
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  updateProviderCredential
);

router.put(
  "/update-tourist-credential",
  auth_mw,
  upload.single("profile_image"),
  updateTouristCredential
);

module.exports = router;
