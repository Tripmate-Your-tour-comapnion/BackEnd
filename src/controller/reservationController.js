const Reservations = require("../models/reservationModel");
const Rooms = require("../models/hotelRoomModel");
var crypto = require("crypto");
const { Chapa } = require("chapa-nodejs");
const User = require("../models/userModel");

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY,
});

module.exports.getAllReservations = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.json({ message: "you are not allowed to see reservations" });
    }
    const reservations = await Reservations.find({});
    res.json({ message: reservations }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getMyReservations = async (req, res) => {
  try {
    const { role, id } = req.user;
    // console.log("User Info:", req.user);

    if (role !== "hotel manager") {
      return res
        .status(403)
        .json({ message: "You are not allowed to see reservations" });
    }

    const reservations = await Reservations.find({ hotel: id })
      .populate("customer")
      .populate("room");

    if (!reservations || reservations.length === 0) {
      console.log("No reservations found for hotel:", id);
      return res.status(404).json({ message: "No reservations found" });
    }

    res.status(200).json(reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.reserveRoom = async (req, res, next) => {
  const tx_ref = await chapa.generateTransactionReference();
  try {
    const { role, id } = req.user;
    const { rid } = req.params;
    const { quantity, from, to } = req.body;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to reserve room" });
    }
    const room = await Rooms.findById(rid);
    if (!room) {
      return res.json({ message: "room does not exist" });
    }
    if (room.available <= quantity) {
      return res.json({ message: "sorry!!! we don't have this much room" });
    }
    const reservation = {
      hotel: room.owner,
      room: rid,
      customer: id,
      from: from,
      to: to,
      tx_ref: tx_ref,
      quantity: quantity,
      price: quantity * room.room_price + 0.02 * quantity * room.room_price,
      status: "pending for payment",
    };
    await Reservations.create(reservation);
    const info = {
      type: "room",
      owner: room.owner,
      item: rid,
      id: id,
      tx_ref: tx_ref,
      amount: quantity * room.room_price + 0.02 * quantity * room.room_price,
    };
    req.info = info;
    next();
  } catch (err) {
    res.json({ message: err.message });
  }
};
