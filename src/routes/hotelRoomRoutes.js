const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const {
  getAllRooms,
  getMyRooms,
  createRooms,
  updateRoom,
  deleteRoom,
  searchRoom,
  getSingleRoom,
  rateRoom,
  getAllRoomsOfOneHotel,
  getTopRatedHotels,
} = require("../controller/hotelRoomController");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.get("/get-all", auth_mw, getAllRooms);
router.get("/get-top-rated-hotels", auth_mw, getTopRatedHotels);
router.get("/get-single/:id?", getSingleRoom);
router.get("/get-all-rooms/:id", getAllRoomsOfOneHotel);
router.get("/search/:key?", auth_mw, searchRoom);
router.get("/get-my-rooms", auth_mw, getMyRooms);

router.post(
  "/create-new",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  auth_mw,
  createRooms
);

router.put(
  "/update/:id?",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  auth_mw,
  updateRoom
);

router.post("/rate-room/:id?", auth_mw, rateRoom);
router.delete("/delete/:id?", auth_mw, deleteRoom);

module.exports = router;
