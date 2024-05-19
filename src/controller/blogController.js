const Blog = require("../models/blogModel");
const cloudinary = require("../utils/cloudinary");

module.exports.getAllBlogs = async (req, res) => {
  try {
    const blog = await Blog.find({});
    res.json(blog).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.json(blog).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.searchBlog = async (req, res) => {
  try {
    const { key } = req.params;
    const blog = await Blog.find({
      blog_title: { $regex: new RegExp(key, "i") },
    });
    res.json(blog).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.postBlog = async (req, res) => {
  try {
    const fileUpload = await cloudinary.uploader.upload(req.file.path);
    // const { role } = req.user;
    const { blog_title, blog_description } = req.body;
    const blog_image = fileUpload.secure_url;
    if (!blog_title || !blog_description || !blog_image) {
      return res.json({ message: "all fields are required" });
    }
    // if (role != "admin") {
    //   return res.json({ message: "you are not allowed to post blog" });
    // }
    const blog = {
      blog_title: blog_title,
      blog_image: blog_image,
      blog_description: blog_description,
      blog_date: Date.now(),
    };
    await Blog.create(blog);
    res.json({ message: "blog posted sucessfully", body: blog }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.updateBlog = async (req, res) => {
  try {
    // const { role } = req.user;
    const id = req.params.id;
    const { blog_title, blog_description } = req.body;
    const fileUpload = await cloudinary.uploader.upload(req.file.path);
    const blog_image = fileUpload.secure_url;
    if (!blog_title || !blog_description || !id || !blog_image) {
      return res.json({ message: "all fields are required" });
    }
    // if (role != "admin") {
    //   return res.json({ message: "you are not allowed to update blog" });
    // }
    const blog = await Blog.findById(id);
    blog.blog_title = blog_title || blog.blog_title;
    blog.blog_image = blog_image || blog.blog_image;
    blog.blog_description = blog_description || blog.blog_description;
    blog.blog_date = Date.now();
    await blog.save();
    return res
      .json({ message: "blog updated sucessfully", body: blog })
      .status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.deleteBlog = async (req, res) => {
  try {
    // const { role } = req.user;
    const id = req.params.id;
    if (!id) {
      return res.json({ message: "id is not provided" });
    }
    // if (role != "admin") {
    //   return res.json({ message: "you are not allowed to delete blog" });
    // }
    const blog = await Blog.findByIdAndDelete(id);
    return res.json({ message: "blog deleted sucessfully" }).status(200);
  } catch (err) {
    res.json({ message: err.message });
  }
};
