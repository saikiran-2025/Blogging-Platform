const jwt = require("jsonwebtoken");
const Dashboard = require("../models/dashboard");
const Post = require("../models/cpmodel"); // main Post model

// Auth middleware: decode JWT and set req.user._id
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ err: "No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // decoded should contain _id from your login token
    req.user = { _id: decoded._id };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ err: "Invalid or expired token." });
  }
};


// GET /dashboard/post/:id  → fetch single post for edit page
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ err: "Post not found." });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ err: "Not allowed to access this post." });
    }

    return res.status(200).json({
      msg: "Post fetched successfully.",
      post
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error fetching post." });
  }
};
// GET /dashboard  → My Posts, Comments, Likes, My Recent Posts
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user

    const data = await Dashboard.getDashboardData(userId);

    return res.status(200).json({
      msg: "Dashboard data fetched successfully.",
      stats: {
        myPosts: data.stats.myPosts,
        comments: data.stats.comments,
        likes: data.stats.likes
      },
      recentPosts: data.recentPosts
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error fetching dashboard data." });
  }
};

// PUT /dashboard/post/:id  → Edit post (title, category, content, tags, status, featuredImage)
// PUT /dashboard/post/:id  → Edit post (including featuredImage)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ err: "Post not found." });
    }
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ err: "Not allowed to edit this post." });
    }

    const { title, category, content, tags, status } = req.body;

    if (title !== undefined) post.title = title;
    if (category !== undefined) post.category = category;
    if (content !== undefined) post.content = content;
    if (status !== undefined) post.status = status;

    // Tags
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        post.tags = tags.map((t) => t.trim()).filter((t) => t.length > 0);
      } else if (typeof tags === "string") {
        post.tags = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      }
    }

    // Image: only update if a new file is uploaded
    if (req.file) {
      post.featuredImage = `/uploads/featured/${req.file.filename}`;
    }

    await post.save();

    return res.status(200).json({
      msg: "Post updated successfully.",
      post
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error updating post." });
  }
};

// DELETE /dashboard/post/:id  → Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ err: "Post not found." });
    }
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ err: "Not allowed to delete this post." });
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      msg: "Post deleted successfully."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error deleting post." });
  }
};

module.exports = { getDashboard, updatePost, deletePost,getPostById, authMiddleware };