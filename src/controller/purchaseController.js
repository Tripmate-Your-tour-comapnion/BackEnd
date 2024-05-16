const Purchase = require("../models/purchaseModel");
const Product = require("../models/productModel");
var crypto = require("crypto");
const { Chapa } = require("chapa-nodejs");

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY,
});

module.exports.getAllPurchases = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.json({ message: "you are not allowed to see purchases" });
    }
    const purchases = await Purchase.find({});
    res.json(purchases).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getMyPurchases = async (req, res) => {
  try {
    const { role, id ,status } = req.user;
    if (role != "shop owner") {
      return res.json({ message: "you are not allowed to see purchases" });
    }
    if (status != "verified") {
      return res.json({ message: "you must be verified to see purchases" });
    }
    const purchases = await Purchase.find({ shop: id });
    res.json(purchases).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.purchaseProduct = async (req, res, next) => {
  const tx_ref = await chapa.generateTransactionReference();
  try {
    const { role, id } = req.user;
    const { pid, quantity } = req.body;
    if (role != "tourist") {
      return res.json({ message: "you are not allowed to purchase product" });
    }
    const product = await Product.findById(pid);
    const price = product.product_price;
    // for (let i = 0; i < purchase.product_info.length; i++) {
    //   let total = 0;
    //   total = total + quantity[i] * price[i];
    // }

    if (!product) {
      return res.json({ message: "product does not exist" });
    }
    if (product.product_available <= quantity) {
      return res.json({ message: "sorry!!! we don't have this much product" });
    }
    const purchase = {
      shop: product.shop_owner,
      customer: id,
      product: pid,
      quantity: quantity,
      tx_ref: tx_ref,
      price: price,
      total: price * quantity,
      status: "pending payment",
    };
    await Purchase.create(purchase);
    const info = {
      type: "good",
      owner: product.shop_owner,
      item: pid,
      id: id,
      tx_ref: tx_ref,
      amount: purchase.total + 0.02 * purchase.total,
    };
    req.info = info;
    next();
    // room.available -= quantity;
    //reservation.status = "reserved";
    // await room.save();
    // res
    //   .json({ message: " reserved successfully", body: reservation })
    //   .status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};
