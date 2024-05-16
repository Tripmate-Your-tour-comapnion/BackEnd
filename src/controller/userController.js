require("dotenv").config();
const crypto = require("crypto");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

module.exports.signup = async (req, res) => {
  try {
    const { full_name, email, password, re_password, role } = req.body;
    if (!full_name || !email || !password || !re_password || !role) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password != re_password) {
      return res.status(400).json({ message: "password mismatch" });
    }
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    user = new User(
      _.pick(req.body, ["full_name", "email", "password", "role"])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const token = await jwt.sign(
      { id: user._id, role: user.role, status: user.verification_status },
      process.env.PRIVATE_SECERET_TOKEN
    );
    await user.save();
    res
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({ message: "user signup successfully", body: user })
      .status(200);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const token = await jwt.sign(
      { id: user._id, role: user.role, status: user.verification_status },
      process.env.PRIVATE_SECERET_TOKEN
    );
    res
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({ message: "loggedin successfully", body: user })
      .status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.logout = async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // Setting expiration date to past
    sameSite: "none",
    secure: true,
  });
  res
    .json({
      message: "logged out successfully",
    })
    .status(200);
};

module.exports.changePassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { old_password, re_password, new_password } = req.body;
    if (!old_password || !re_password || !new_password) {
      res.json({ message: "all fields are required" });
    }
    if (!id) {
      return res.json({ message: "not authorized" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.json({ message: "user does not exist" });
    }
    if (new_password != re_password) {
      return res.json({ message: " password mismatch" });
    }
    const validate = await bcrypt.compare(old_password, user.password);
    if (!validate) {
      return res.json({ message: "old password incorrect" });
    }
    user.password = new_password;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    return res.json({ message: user });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.send("user doesn't exist");
  }
  console.log(user)
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 15 * (60 * 1000), // Thirty minutes
  }).save();
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password</p>  
  <p>This reset link is valid for only 30minutes.</p>

  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

  <p>Regards...</p>
  <p>Pinvent Team</p>
`;
  const subject = "Password Reset Request";
  const send_to = user.email;
  console.log(send_to)
  const sent_from = process.env.EMAIL_USER;
  console.log(sent_from)

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.userInfo = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.json({ message: "not authorized" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.json({ message: "user does not exist" });
    }
    return res.json({ message: user });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.verifyUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.json({ message: "you are not allowed verify user" });
    }
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.json({ message: "user does not exist" });
    }
    user.verification_status = "verified";
    await user.save();
    return res.json(user);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.banUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.json({ message: "you are not allowed ban user" });
    }
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.json({ message: "user does not exist" });
    }
    user.verification_status = "banned";
    await user.save();
    return res.json(user);
  } catch (err) {
    res.json({ message: err.message });
  }
};
