// controllers/cpcont.js
const jwt = require("jsonwebtoken");
const Post = require("../models/cpmodel");

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ err: "No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = { _id: decoded._id, fullname: decoded.fullname };
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ err: "Invalid or expired token." });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, category, content, tags, status } = req.body;
    const file = req.file;

    // 1. Basic validation
    if (!title || !content) {
      return res
        .status(400)
        .json({ err: "Title and content are required fields." });
    }

    // 2. Status
    const finalStatus = status === "published" ? "published" : "draft";

    // Require image only for published
    if (finalStatus === "published" && !file) {
      return res
        .status(400)
        .json({ err: "Featured image (JPG) is required for publishing." });
    }

    // 3. Handle image
    let featuredImagePath = "";
    if (file) {
      const mime = file.mimetype;
      if (mime !== "image/jpeg" && mime !== "image/jpg") {
        return res.status(400).json({ err: "Only JPG images are allowed." });
      }
      // URL that frontend can use, served by /uploads static
      featuredImagePath = `/uploads/featured/${file.filename}`;
    }

    // 4. Tags
    let tagsArray = [];
    if (Array.isArray(tags)) {
      tagsArray = tags.map((t) => t.trim()).filter((t) => t.length > 0);
    } else if (typeof tags === "string") {
      tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }

    // 5. Create post
    const post = await Post.create({
      title,
      featuredImage: featuredImagePath,
      category: category || undefined,
      content,
      tags: tagsArray,
      status: finalStatus,
      author: req.user._id
    });

    return res.status(201).json({
      msg:
        finalStatus === "published"
          ? "Post published successfully."
          : "Post saved as draft.",
      post,
      authorName: req.user.fullname
    });
  } catch (error) {
    console.error("CreatePost error:", error);
    return res
      .status(500)
      .json({ err: "Internal Server Error", details: error.message });
  }
};

module.exports = { createPost, authMiddleware };