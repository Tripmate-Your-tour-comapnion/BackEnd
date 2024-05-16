const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema({
  blog_title: {
    type: String,
    required: true,
  },
  blog_image: {
    type: String,
    required: false,
  },
  blog_description: {
    type: String,
    required: true,
  },
  blog_date: {
    type: String,
    required: false,
  },
});
const Blogs = new mongoose.model("blog", BlogSchema);
module.exports = Blogs;
