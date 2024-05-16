const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const {
  getAllBlogs,
  searchBlog,
  postBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
} = require("../controller/blogController");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.get("/get-all", getAllBlogs);
router.get("/get-single/:id?", getSingleBlog);
router.get("/search/:key?", searchBlog);
router.post("/post-new", upload.single("dest_image"), auth_mw, postBlog);
router.put("/update/:id?", upload.single("dest_image"), auth_mw, updateBlog);
router.delete("/delete/:id?", auth_mw, deleteBlog);

module.exports = router;
