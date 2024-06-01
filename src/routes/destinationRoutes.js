const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const {
  getAllDestinations,
  searchDestinations,
  addDestination,
  updateDestination,
  deleteDestination,
  getSingleDestination,
} = require("../controller/destinationController");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.get("/get-all", getAllDestinations);
router.get("/get-single/:id?", getSingleDestination);
router.get("/search/:key?", searchDestinations);
// router.post("/add", upload.single("dest_image"), addDestination);
// router.put("/update/:id?", upload.single("dest_image"), updateDestination);
router.post("/add", upload.single("dest_image"), auth_mw, addDestination);
router.put(
  "/update/:id?",
  upload.single("dest_image"),
  auth_mw,
  updateDestination
);
router.delete("/delete/:id?", auth_mw, deleteDestination);
// router.delete("/delete/:id?", deleteDestination);

module.exports = router;
