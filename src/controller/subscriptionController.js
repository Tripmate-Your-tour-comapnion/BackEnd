const Subscriptions = require("../models/subscriptionModel");
const Tours = require("../models/tourPackageModel");
var crypto = require("crypto");
const { Chapa } = require("chapa-nodejs");

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY,
});

module.exports.getAllSubscriptions = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.json({ message: "you are not allowed to see Subscriptions" });
    }
    const subscriptions = await Subscriptions.find({});
    res.json({ message: subscriptions }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getMySubscriptions = async (req, res) => {
  try {
    // const { role, id, status } = req.user;
    const { role, id } = req.user;
    if (role != "tour guide") {
      return res
        .status(403)
        .json({ message: "you are not allowed to see Subscriptions" });
    }
    // if (status != "verified") {
    //   return res.json({ message: "you must be verified to see Subscriptions" });
    // }
    const subscriptions = await Subscriptions.find({ agency: id })
      .populate("customer")
      .populate("package");
    res.json(subscriptions).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.subscribePackage = async (req, res, next) => {
  const tx_ref = await chapa.generateTransactionReference();
  try {
    const { role, id } = req.user;
    const { tid } = req.params;
    const { quantity } = req.body;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to reserve room" });
    }
    const tour = await Tours.findById(tid);
    if (!tour) {
      return res.json({ message: "tour does not exist" });
    }
    if (tour.space_left <= quantity) {
      return res.json({ message: "sorry!!! we don't have this much room" });
    }
    const subscription = {
      agency: tour.agent,
      package: tid,
      customer: id,
      tx_ref: tx_ref,
      quantity: quantity,
      price:
        quantity * tour.package_price + 0.02 * quantity * tour.package_price,
      status: "pending for payment",
    };
    await Subscriptions.create(subscription);
    const info = {
      type: "tour",
      owner: tour.agent,
      item: tid,
      id: id,
      tx_ref: tx_ref,
      amount:
        quantity * tour.package_price + 0.02 * quantity * tour.package_price,
    };
    req.info = info;
    next();
  } catch (err) {
    res.json({ message: err.message });
  }
};

// module.exports.confirmPayment = async (req, res) => {
//   try {
//     const hash = crypto
//       .createHmac("sha256", process.env.SECRET_KEY)
//       .update(JSON.stringify(req.body))
//       .digest("hex");
//     if (hash == req.headers["x-chapa-signature"]) {
//       const event = req.body;
//       const { tx_ref, status, last_name } = event;
//       if (status == "success" && tx_ref) {
//         const subscription = await Subscriptions.findOne({ tx_ref: tx_ref });
//         subscription.status = "completed";
//         const tour = await Tours.findById(last_name);
//         if (!tour) {
//           return res.send("tour not found");
//         }
//         const quantity = subscription.quantity;
//         tour.space_left -= quantity;
//         await tour.save();
//         await subscription.save();
//         return res.send("everything done");
//       }
//     }
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
