const Destination = require("../models/destinationModel");
const cloudinary = require("../utils/cloudinary");

module.exports.getAllDestinations = async (req, res) => {
  try {
    const destination = await Destination.find({});
    res.json(destination).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getSingleDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findById(id);
    res.json(destination).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.searchDestinations = async (req, res) => {
  try {
    const { key } = req.params;
    const destination = await Destination.find({
      dest_name: { $regex: new RegExp(key, "i") },
    });
    res.json(destination).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.addDestination = async (req, res) => {
  try {
    const fileUpload = await cloudinary.uploader.upload(req.file.path);
    const { role } = req.user;
    const { dest_name, dest_description, lat, lng } = req.body;
    console.log(req.body);
    const dest_image = fileUpload.secure_url;
    if (!dest_image || !dest_description || !dest_name || !lat || !lng) {
      return res.json({ message: "all fields are required" }).status(400);
    }
    if (role != "admin") {
      return res
        .json({ message: "you are not allowed to add destination" })
        .status(400);
    }
    const destination = {
      dest_name: dest_name,
      dest_location: {
        lat: lat,
        lng: lng,
      },
      dest_image: dest_image,
      dest_description: dest_description,
    };
    await Destination.create(destination);
    res
      .json({ message: "destination added sucessfully", body: destination })
      .status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.updateDestination = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const { dest_name, dest_description } = req.body;
    const fileUpload = await cloudinary.uploader.upload(req.file.path);
    const dest_image = fileUpload.secure_url;
    if (!dest_name || !dest_description || !id || !dest_image) {
      return res.json({ message: "all fields are required" }).status(400);
    }
    if (role != "admin") {
      return res
        .json({ message: "you are not allowed to update destination" })
        .status(400);
    }
    const destination = await Destination.findById(id);
    destination.dest_name = dest_name || destination.dest_name;
    destination.dest_image = dest_image;
    destination.dest_description =
      dest_description || destination.dest_description;
    await destination.save();
    return res
      .json({ message: "destination updated sucessfully", body: destination })
      .status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.deleteDestination = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    if (!id) {
      return res.json({ message: "id is not provided" }).status(400);
    }
    if (role != "admin") {
      return res
        .json({ message: "you are not allowed to delete destination" })
        .status(400);
    }
    const destination = await Destination.findByIdAndDelete(id);
    return res.json({ message: "destination deleted sucessfully" }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};
