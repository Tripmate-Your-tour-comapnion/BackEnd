const Room = require("../models/hotelRoomModel");
const User = require("../models/userModel");
const Provider = require("../models/providerProfileModel");
const cloudinary = require("../utils/cloudinary");
const ProviderProfile = require("../models/providerProfileModel");

module.exports.getAllRooms = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to see rooms" });
    }
    const rooms = await Room.find({}).populate("owner");
    res.json({ message: rooms }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getTopRatedHotels = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "tourist") {
      return res.json({ message: "You are not allowed to see rooms" });
    }

    // Fetch all rooms
    const rooms = await Room.find({});
    console.log("Fetched rooms:", rooms);

    // Filter rooms with a rating higher than 4
    const topRatedRooms = rooms.filter((room) => room.room_rate.value > 3);
    console.log("Top rated rooms:", topRatedRooms);

    const hotelOwnerDetails = await Promise.all(
      topRatedRooms.map(async (room) => {
        const hotel = await ProviderProfile.findById(room.owner);
        console.log(`Fetched hotel for room ${room._id}:`, hotel);
        return hotel
          ? {
              owner: hotel._id,
              hotelName: hotel.company_name,

              rating: room.room_rate.value,
            }
          : null;
      })
    );

    // Remove null values in case some hotels were not found
    const validHotelOwnerDetails = hotelOwnerDetails.filter(
      (detail) => detail !== null
    );
    console.log("Valid hotel owner details:", validHotelOwnerDetails);

    res.json(validHotelOwnerDetails);
  } catch (err) {
    console.error("Error fetching top-rated hotels:", err.message);
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
    res.json(room).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};
module.exports.getAllRoomsOfOneHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = await Room.find({ owner: id });
    res.json(rooms).status(200);
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
    res.json(rooms).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.createRooms = async (req, res) => {
  try {
    // const { role, id, status } = req.user;
    const { role, id } = req.user;
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
    if (role !== "hotel manager") {
      return res.json({ message: "you are not allowed to create rooms" });
    }
    // if (status !== "verified") {
    //   return res.json({ message: "you must be verified to create rooms" });
    // }
    const room = {
      owner: id,
      room_name: room_name,
      room_image: [Image1, Image2, Image3],
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
    const files = req.files;

    // Ensure you have the current room information
    const room = await Room.findById(rid);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the user has permission to update the room
    if (room.owner.toString() !== id) {
      return res
        .status(403)
        .json({ message: "You are only allowed to update your rooms" });
    }

    // Initialize image URLs
    let image1URL = room.room_image[0];
    let image2URL = room.room_image[1];
    let image3URL = room.room_image[2];

    // Process new images if uploaded
    if (files && files.image1) {
      const image1Upload = await cloudinary.uploader.upload(
        files.image1[0].path
      );
      image1URL = image1Upload.secure_url;
    }
    if (files && files.image2) {
      const image2Upload = await cloudinary.uploader.upload(
        files.image2[0].path
      );
      image2URL = image2Upload.secure_url;
    }
    if (files && files.image3) {
      const image3Upload = await cloudinary.uploader.upload(
        files.image3[0].path
      );
      image3URL = image3Upload.secure_url;
    }

    // Update room details
    room.room_name = room_name || room.room_name;
    room.room_image[0] = image1URL;
    room.room_image[1] = image2URL;
    room.room_image[2] = image3URL;
    room.room_description = room_description || room.room_description;
    room.room_price = room_price || room.room_price;
    room.room_amount = room_amount || room.room_amount;

    await room.save();

    res.status(200).json({ message: "Room updated successfully", body: room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteRoom = async (req, res) => {
  try {
    const { role, status } = req.user;
    const rid = req.params.id;
    if (role != "hotel manager") {
      return res.json({ message: "you are not allowed to delete rooms" });
    }
    // if (status != "verified") {
    //   return res.json({ message: "you must be verified to delete rooms" });
    // }
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
    room.room_rate.value =
      room.room_rate.total / (room.room_rate.rater_number + 1);
    room.room_rate.rater_number += 1;
    await room.save();
    return res.json({ body: room }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};
