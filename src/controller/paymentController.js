const crypto = require("crypto");
const axios = require("axios");
const Users = require("../models/userModel");
const dotenv = require("dotenv");
const Provider = require("../models/providerProfileModel");
const Subscriptions = require("../models/subscriptionModel");
const Tours = require("../models/tourPackageModel");
const Reservations = require("../models/reservationModel");
const Rooms = require("../models/hotelRoomModel");
const Purchase = require("../models/purchaseModel");
const Product = require("../models/productModel");

module.exports.chapaPayment = async (req, res, next) => {
  try {
    const { id, amount, owner, item, tx_ref, type } = req.info;
    // const { amount, owner, item, tx_ref, type } = req.info;
    const user = await Users.findById(id);
    const email = user.email;
    const full_name = user.full_name;
    const provider = await Provider.find({ _id: owner });
    const sub_id = provider[0].payment_info.subaccount_id;
    let chapaRequestData = {
      first_name: full_name,
      last_name: item,
      email: email,
      amount: amount,
      customization: { title: type },
      tx_ref: tx_ref,
      currency: "ETB",
      callback_url:
        "https://web-tourism-management-backend-final.onrender.com/reservation/confirm-payment",
      return_url: "http://localhost:5173/thanks",
      "subaccounts[id]": sub_id,
    };
    const response = await axios.post(
      `https://api.chapa.co/v1/transaction/mobile-initialize`,
      chapaRequestData,
      {
        headers: {
          Authorization: "Bearer " + process.env.CHAPA_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data["status"] == "success") {
      return res.json({
        msg: "Order created successfully. Perform payment.",
        paymentUrl: response.data["data"]["checkout_url"],
      });
    } else {
      return res.status(500).json({
        msg: "Something went wrong",
      });
    }
  } catch (error) {
    if (error.response) {
      return res.status(500).json({
        msg: error.response.data,
      });
    } else {
      return res.status(500).json({
        msg: error,
      });
    }
  }
};

module.exports.confirmPayment = async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-chapa-signature"]) {
      const event = req.body;
      console.log("event:" + event);
      const { tx_ref, status, last_name, customization } = event;

      if (status == "success" && tx_ref) {
        if (customization.title == "room") {
          console.log("type is:" + customization.title);
          const reservation = await Reservations.findOne({ tx_ref: tx_ref });
          reservation.status = "completed";
          const room = await Rooms.findById(last_name);
          if (!room) {
            return res.send("room not found");
          }
          const quantity = reservation.quantity;
          room.room_available -= quantity;
          await room.save();
          await reservation.save();
          return res.send("everything done");
        } else if (customization.title == "tour") {
          console.log("type is:" + customization.title);
          const subscription = await Subscriptions.findOne({ tx_ref: tx_ref });
          subscription.status = "completed";
          const tour = await Tours.findById(last_name);
          if (!tour) {
            return res.send("tour not found");
          }
          const quantity = subscription.quantity;
          tour.space_left -= quantity;
          await tour.save();
          await subscription.save();
          return res.send("everything done");
        } else if (customization.title == "good") {
          console.log("type is:" + customization.title);
          const purchase = await Purchase.findOne({ tx_ref: tx_ref });
          purchase.status = "completed";
          const product = await Product.findById(last_name);
          if (!product) {
            return res.send("product not found");
          }
          const quantity = purchase.quantity;
          product.product_available -= quantity;
          await product.save();
          await purchase.save();
          return res.send("everything done");
        }
      }
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};
