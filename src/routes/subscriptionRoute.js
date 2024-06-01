const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const { chapaPayment, confirmPayment } = require("../controller/paymentController");
const { getAllSubscriptions, getMySubscriptions, subscribePackage,  } = require("../controller/subscriptionController");

const router = express.Router();

router.get("/get-all", auth_mw, getAllSubscriptions);
router.get("/get-my-subscription", auth_mw, getMySubscriptions);
router.post("/subscribe-tour/:tid?", auth_mw, subscribePackage, chapaPayment);
router.post("/confirm-payment",confirmPayment);

module.exports = router;
