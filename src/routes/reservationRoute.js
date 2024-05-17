const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const { chapaPayment, confirmPayment } = require("../controller/paymentController");
const {
  reserveRoom,
  getAllReservations,
  getMyReservations,
} = require("../controller/reservationController");

const router = express.Router();

router.get("/get-all", auth_mw, getAllReservations);
router.get("/get-my-reservation", auth_mw, getMyReservations);
// router.post("/reserve-room", auth_mw,request,chapaPayment,verify);
// router.post("/reserve-room/:rid?", auth_mw, reserveRoom, chapaPayment);
router.post("/reserve-room/:rid?", reserveRoom, chapaPayment);
router.post("/confirm-payment",confirmPayment);

module.exports = router;
