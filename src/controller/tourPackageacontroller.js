const Tours = require("../models/tourPackageModel");
const cloudinary = require("../utils/cloudinary");

module.exports.getAllPackages = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to see packages" });
    }
    const tours = await Tours.find({});
    res.json({ message: tours }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.searchPackage = async (req, res) => {
  try {
    const { role } = req.user;
    const { key } = req.params;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to see Tours" });
    }
    const tours = await Tours.find({
      package_name: { $regex: new RegExp(key, "i") },
    });
    res.json({ message: tours }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getSinglePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tours.findById(id);
    res.json({ message: tour }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getMyPackages = async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role != "tour agent") {
      return res.json({ message: "you are not allowed to see Tours" });
    }
    const tours = await Tours.find({ agent: id });
    res.json({ message: tours }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.createPackage = async (req, res) => {
  try {
    const { role, id, status } = req.user;
    const { package_name, package_price, total_space, package_description } =
      req.body;
    const { image1, image2, image3 } = req.files;
    const image1Upload = await cloudinary.uploader.upload(image1[0].path);
    const Image1 = image1Upload.secure_url;
    const image2Upload = await cloudinary.uploader.upload(image2[0].path);
    const Image2 = image2Upload.secure_url;
    const image3Upload = await cloudinary.uploader.upload(image3[0].path);
    const Image3 = image3Upload.secure_url;
    if (
      !package_name ||
      !image1 ||
      !image2 ||
      !image3 ||
      !package_price ||
      !total_space ||
      !package_description
    ) {
      return res.json({ message: "all fields are required" }).status(400);
    }
    if (role != "tour agent") {
      return res.json({ message: "you are not allowed to create Tours" });
    }
    if (status != "verified") {
      return res.json({ message: "you must be verified to create Tours" });
    }
    const tour = {
      agent: id,
      package_name: package_name,
      image: [Image1, Image2, Image3],
      package_description: package_description,
      package_price: package_price,
      total_space: total_space,
      space_left: total_space,
    };
    await Tours.create(tour);
    res.json({ message: "tour created sucessfully", body: tour }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.updatePackage = async (req, res) => {
  try {
    const { role, id, status } = req.user;
    const pid = req.params.id;
    const { package_name, package_price, total_space, package_description } =
      req.body;
    const { image1, image2, image3 } = req.files;
    const image1Upload = await cloudinary.uploader.upload(image1[0].path);
    const Image1 = image1Upload.secure_url;
    const image2Upload = await cloudinary.uploader.upload(image2[0].path);
    const Image2 = image2Upload.secure_url;
    const image3Upload = await cloudinary.uploader.upload(image3[0].path);
    const Image3 = image3Upload.secure_url;
    const fileUpload = await cloudinary.uploader.upload(req.file.path);

    const image = fileUpload.secure_url;
    if (
      !package_name ||
      !image1 ||
      !image2 ||
      !image3 ||
      !package_price ||
      !total_space ||
      !package_description
    ) {
      return res.json({ message: "all fields are required" }).satus(400);
    }
    if (role != "tour agent") {
      return res.json({ message: "you are not allowed to update Tours" });
    }
    if (status != "verified") {
      return res.json({ message: "you must be verified to update Tours" });
    }
    const tour = await Tours.findById(pid);
    console.log(tour);
    if (tour.agent != id) {
      return res.json({ message: "you are only allowed to update your Tours" });
    }
    tour.package_name = package_name || tour.package_name;
    tour.image[0] = Image1 || tour.image[0];
    tour.image[1] = Image2 || tour.image[1];
    tour.image[2] = Image3 || tour.image[2];
    tour.package_description = package_description || tour.package_description;
    tour.package_price = package_price || tour.package_price;
    tour.total_space = total_space || tour.total_space;
    await tour.save();
    res.json({ message: "tour updated successfully", body: tour }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.deletePackage = async (req, res) => {
  try {
    const { role, id, status } = req.user;
    const pid = req.params.id;
    if (role != "tour agent") {
      return res.json({ message: "you are not allowed to delete Tours" });
    }
    if (status != "verified") {
      return res.json({ message: "you must be verified to delete Tours" });
    }
    const tour = await Tours.findById(pid);
    if (tour.agent != id) {
      return res.json({ message: "you are only allowed to delete your Tours" });
    }
    // if (tour.space_left <= 0) return res.send("all Tours are reserved");
    await tour.deleteOne();
    res.json({ message: "tour deleted successfully" }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.ratePackage = async (req, res) => {
  try {
    const { role } = req.user;
    const { rate } = req.body;
    const { id } = req.params;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to rate Tours" });
    }
    const tour = await Tours.findById(id);
    if (!tour) {
      return res.json({ message: "tour does not exist" });
    }
    tour.rate.total += rate;
    tour.rate.value = tour.rate.total / (tour.rate.rater_number + 1);
    tour.rate.rater_number += 1;
    await tour.save();
    return res.json({ body: tour }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};
