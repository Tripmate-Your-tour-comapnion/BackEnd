const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const { upload } = require("../middleware/multer");
const {
  getAllProducts,
  getSingleProduct,
  searchProduct,
  getMyProducts,
  createProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");

const router = express.Router();

router.get("/get-all", auth_mw, getAllProducts);
router.get("/get-single/:id?", getSingleProduct);
router.get("/search/:key?", auth_mw, searchProduct);
router.get("/get-my-products", auth_mw, getMyProducts);

router.post(
  "/create-new",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  auth_mw,
  createProducts
);

router.put(
  "/update/:id?",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  auth_mw,
  updateProduct
);

router.delete("/delete/:id?", auth_mw, deleteProduct);

module.exports = router;
