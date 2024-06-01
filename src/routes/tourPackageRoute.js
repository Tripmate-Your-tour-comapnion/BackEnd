const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");

const {
  getAllPackages,
  getSinglePackage,
  searchPackage,
  getMyPackages,
  createPackage,
  updatePackage,
  deletePackage,
  ratePackage,
  getAllToursOfOneAgent,
} = require("../controller/tourPackageacontroller");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.get("/get-all", auth_mw, getAllPackages);
router.get("/get-single/:id?", getSinglePackage);
router.get("/get-all-packages/:id", getAllToursOfOneAgent);
router.get("/search/:key?", auth_mw, searchPackage);
router.get("/get-my-tours", auth_mw, getMyPackages);
router.post(
  "/create-new",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  auth_mw,
  createPackage
);
router.put(
  "/update/:id?",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  auth_mw,
  updatePackage
);
router.post("/rate-tours/:id?", auth_mw, ratePackage);
router.delete("/delete/:id?", auth_mw, deletePackage);

module.exports = router;
