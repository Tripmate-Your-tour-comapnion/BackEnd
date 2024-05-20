require("dotenv").config();
const { Chapa } = require("chapa-nodejs");
const Provider = require("../models/providerProfileModel");
const Tourist = require("../models/touristProfileModel");
const cloudinary = require("../utils/cloudinary");

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY,
});

module.exports.providerCredential = async (req, res) => {
  try {
    const { id } = req.params;

    const { company_name, description, address, acc_name, acc_number, bank } =
      req.body;
    const { profile_image, bussiness_license, image1, image2, image3 } =
      req.files;
    console.log(image1);
    const profileUpload = await cloudinary.uploader.upload(
      profile_image[0].path
    );
    const profileImage = profileUpload.secure_url;

    const bussinessLicenseUpload = await cloudinary.uploader.upload(
      bussiness_license[0].path
    );
    const bussinessLicense = bussinessLicenseUpload.secure_url;

    const image1Upload = await cloudinary.uploader.upload(image1[0].path);
    const Image1 = image1Upload.secure_url;
    const image2Upload = await cloudinary.uploader.upload(image2[0].path);
    const Image2 = image2Upload.secure_url;
    const image3Upload = await cloudinary.uploader.upload(image3[0].path);
    const Image3 = image3Upload.secure_url;

    if (
      !company_name ||
      !description ||
      !address ||
      !acc_name ||
      !acc_number ||
      !bank
    ) {
      return res.status(400).json({ message: "all fields are required" });
    }
    let bank_code;
    if (bank === "Awash Bank") {
      bank_code = "80a510ea-7497-4499-8b49-ac13a3ab7d07";
    } else if (bank === "Bank of Abyssinia") {
      bank_code = "32735b19-bb36-4cd7-b226-fb7451cd98f0";
    } else if (bank === "Commercial Bank of Ethiopia (CBE)") {
      bank_code = "96e41186-29ba-4e30-b013-2ca36d7e7025";
    } else if (bank === "Dashen Bank") {
      bank_code = "809814c1-ab98-4750-a5b8-3be5db7bd5f5";
    } else if (bank === "telebirr") {
      bank_code = "853d0598-9c01-41ab-ac99-48eab4da1513";
    } else if (bank === "M-Pesa") {
      bank_code = "953d0598-4e01-41ab-ac93-t9eab4da1u13";
    }
    const response = await chapa.createSubaccount({
      business_name: company_name,
      account_name: acc_name,
      bank_code: bank_code,
      account_number: acc_number,
      split_type: "flat",
      split_value: 25,
    });
    const user = new Provider({
      _id: id,
      company_name: company_name,
      description: description,
      address: address,
      profile_image: profileImage,
      images: [Image1, Image2, Image3],
      bussiness_license: bussinessLicense,
      payment_info: {
        acc_name: acc_name,
        acc_number: acc_number,
        bank: bank,
        subaccount_id: response.data.subaccount_id,
      },
    });
    await user.save();
    res.json({ message: "user signup successfully", body: user }).status(200);
  } catch (err) {
    console.log("the error: " + err);
  }
};

module.exports.touristCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { passport_id, phone_number } = req.body;
    const profile_image = req.files;
    // Should log file object if uploaded

    const profileUpload = await cloudinary.uploader.upload(req.file.path);
    const profileImage = profileUpload.secure_url;

    if (!passport_id || !phone_number) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const user = new Tourist({
      _id: id,
      passport_id: passport_id,
      phone_number: phone_number,
      profile_image: profileImage,
    });
    await user.save();
    res.json({ message: "user signup successfully", body: user }).status(200);
  } catch (err) {
    console.log("the error: " + err);
  }
};

module.exports.updateTouristCredential = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.json({ message: "not authorized" });
    }
    const { phone_number } = req.body;
    const { profile_image } = req.files;
    if (!phone_number || !profile_image) {
      res.json({ message: "all fields are required" });
    }
    const profileUpload = await cloudinary.uploader.upload(
      profile_image[0].path
    );
    const profileImage = profileUpload.secure_url;
    const user = await Tourist.findById(id);
    if (!user) {
      return res.json({ message: "user does not exist" });
    }
    user.phone_number = phone_number || user.phone_number;
    user.profile_image = profileImage || user.profile_image;
    await user.save();
    return res.json({ message: "user updated successfully", body: user });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.updateProviderCredential = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.json({ message: "not authorized" });
    }
    const { description, address, company_name } = req.body;
    const { profile_image, image1, image2, image3 } = req.files;
    // if (
    //   !phone_number ||
    //   !profile_image ||
    //   !description ||
    //   !address ||
    //   !company_name
    // ) {
    //   res.json({ message: "all fields are required" });
    // }
    const profileUpload = await cloudinary.uploader.upload(
      profile_image[0].path
    );
    const profileImage = profileUpload.secure_url;
    const image1Upload = await cloudinary.uploader.upload(image1[0].path);
    const Image1 = image1Upload.secure_url;
    const image2Upload = await cloudinary.uploader.upload(image2[0].path);
    const Image2 = image2Upload.secure_url;

    const image3Upload = await cloudinary.uploader.upload(image3[0].path);
    const Image3 = image3Upload.secure_url;
    const user = await Provider.findById(id);
    if (!user) {
      return res.json({ message: "user does not exist" });
    }
    user.description = description || user.description;
    user.address = address || user.address;
    user.company_name = company_name || user.company_name;
    user.profile_image = profileImage || user.profile_image;
    user.images[0] = Image1 || user.images[0];
    user.images[1] = Image2 || user.images[1];
    user.images[2] = Image3 || user.images[2];
    await user.save();
    return res.json({ message: "user updated successfully", body: user });
  } catch (err) {
    res.json({ message: err.message });
  }
};
