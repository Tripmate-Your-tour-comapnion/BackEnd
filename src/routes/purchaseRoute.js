const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const { chapaPayment, confirmPayment } = require("../controller/paymentController");
const {
  getAllPurchases,
  getMyPurchases,
  purchaseProduct,
} = require("../controller/purchaseController");

const router = express.Router();

router.get("/get-all", auth_mw, getAllPurchases);
router.get("/get-my-purchases", auth_mw, getMyPurchases);
router.post("/purchase-product/:pid?", auth_mw, purchaseProduct, chapaPayment);
router.post("/confirm-payment",confirmPayment);
module.exports = router;
