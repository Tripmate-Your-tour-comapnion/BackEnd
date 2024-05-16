const Room = require("../models/hotelRoomModel");
const cloudinary = require("../utils/cloudinary");

module.exports.getAllRooms = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to see rooms" });
    }
    const rooms = await Room.find({});
    res.json({ message: rooms }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.searchRoom = async (req, res) => {
  try {
    const { role } = req.user;
    const { key } = req.params;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to see rooms" });
    }
    const rooms = await Room.find({
      room_name: { $regex: new RegExp(key, "i") },
    });
    res.json({ message: rooms }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getSingleRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    res.json({ message: room }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
  
};
module.exports.getAllRoomsOfOneHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = await Room.find({owner:id});
    res.json( rooms ).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getMyRooms = async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role != "hotel manager") {
      return res.json({ message: "you are not allowed to see rooms" });
    }
    const rooms = await Room.find({ owner: id });
    res.json({ message: rooms }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.createRooms = async (req, res) => {
  try {
    const { role, id, status } = req.user;
    const { room_name, room_price, room_amount, room_description } = req.body;
    const { image1, image2, image3 } = req.files;
    const image1Upload = await cloudinary.uploader.upload(image1[0].path);
    const Image1 = image1Upload.secure_url;
    const image2Upload = await cloudinary.uploader.upload(image2[0].path);
    const Image2 = image2Upload.secure_url;
    const image3Upload = await cloudinary.uploader.upload(image3[0].path);
    const Image3 = image3Upload.secure_url;
    if (
      !room_name ||
      !image1 ||
      !image2 ||
      !image3 ||
      !room_price ||
      !room_amount ||
      !room_description
    ) {
      return res.json({ message: "all fields are required" }).satus(400);
    }
    if (role != "hotel manager") {
      return res.json({ message: "you are not allowed to create rooms" });
    }
    if (status != "verified") {
      return res.json({ message: "you must be verified to create rooms" });
    }
    const room = {
      owner: id,
      room_name: room_name,
      image: [Image1, Image2, Image3],
      room_description: room_description,
      room_price: room_price,
      room_amount: room_amount,
      room_available: room_amount,
    };
    await Room.create(room);
    res.json({ message: "room created sucessfully", body: room }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.updateRoom = async (req, res) => {
  try {
    const { role, id, status } = req.user;
    const rid = req.params.id;
    const { room_name, room_price, room_amount, room_description } = req.body;
    const { image1, image2, image3 } = req.files;
    const image1Upload = await cloudinary.uploader.upload(image1[0].path);
    const Image1 = image1Upload.secure_url;
    const image2Upload = await cloudinary.uploader.upload(image2[0].path);
    const Image2 = image2Upload.secure_url;
    const image3Upload = await cloudinary.uploader.upload(image3[0].path);
    const Image3 = image3Upload.secure_url;
    if (
      !room_name ||
      !image1 ||
      !image2 ||
      !image3 ||
      !room_price ||
      !room_amount ||
      !room_description
    ) {
      return res.json({ message: "all fields are required" }).satus(400);
    }
    if (role != "hotel manager") {
      return res.json({ message: "you are not allowed to update rooms" });
    }
    if (status != "verified") {
      return res.json({ message: "you must be verified to update rooms" });
    }
    const room = await Room.findById(rid);
    if (room.owner != id) {
      return res.json({ message: "you are only allowed to update your rooms" });
    }
    room.room_name = room_name || room.room_name;
    room.image[0] = Image1 || room.image[0];
    room.image[1] = Image2 || room.image[1];
    room.image[2] = Image3 || room.image[2];
    room.room_description = room_description || room.room_description;
    room.room_price = room_price || room.room_price;
    room.room_amount = room_amount || room.room_amount;
    await room.save();
    res.json({ message: "room updated sucessfully", body: room }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.deleteRoom = async (req, res) => {
  try {
    const { role, status } = req.user;
    const rid = req.params.id;
    if (role != "hotel manager") {
      return res.json({ message: "you are not allowed to delete rooms" });
    }
    if (status != "verified") {
      return res.json({ message: "you must be verified to delete rooms" });
    }
    const room = await Room.findById(rid);
    if (room.owner != req.user.id) {
      return res.json({ message: "you are only allowed to update your rooms" });
    }
    await room.deleteOne();
    res.json({ message: "room deleted successfully" }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.rateRoom = async (req, res) => {
  try {
    const { role } = req.user;
    const { rate } = req.body;
    const { id } = req.params;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to rate rooms" });
    }
    const room = await Room.findById(id);
    if (!room) {
      return res.json({ message: "room does not exist" });
    }
    room.room_rate.total += rate;
    room.rate.value = room.room_rate.total / (room.room_rate.rater_number + 1);
    room.room_rate.rater_number += 1;
    await room.save();
    return res.json({ body: room }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};
