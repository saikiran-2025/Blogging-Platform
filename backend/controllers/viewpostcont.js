const Post = require("../models/cpmodel"); // use main Post model
const jwt = require("jsonwebtoken");

// Optional auth middleware if likes/comments require login
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ err: "No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = { _id: decoded._id };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ err: "Invalid or expired token." });
  }
};

// GET /viewpost/:id  → full View Post page data
const getViewPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("author", "fullname bio profileImage");

    if (!post) {
      return res.status(404).json({ err: "Post not found." });
    }

    // Build response for View Post page
    return res.status(200).json({
      msg: "Post fetched successfully.",
      post: {
        id: post._id,
        title: post.title,
        featuredImage: post.featuredImage,
        category: post.category,
        description: "", // you can compute a snippet if needed
        content: post.content,
        tags: post.tags || [],
        status: post.status,
        author: {
          id: post.author?._id,
          name: post.author?.fullname || "Unknown",
          bio: post.author?.bio || "",
          profileImage: post.author?.profileImage || ""
        },
        readingTime: post.readingTime,
        likeCount: 0,         // cpmodel doesn’t have likes yet
        commentCount: 0,      // cpmodel doesn’t have comments yet
        views: 0,             // cpmodel doesn’t have views yet
        createdAt: post.createdAt,
        comments: []          // comments need a separate model or vpmodel later
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error fetching post." });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ err: "Post not found." });
    }

    const alreadyLiked = post.likes.some(
      (u) => u.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (u) => u.toString() !== userId.toString()
      );
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      msg: alreadyLiked ? "Post unliked." : "Post liked.",
      likeCount: post.likeCount
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error updating like." });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, rating } = req.body;
    const userId = req.user._id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ err: "Comment text is required." });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ err: "Post not found." });
    }

    // Push new comment
    post.comments.push({
      author: userId,
      text: text.trim(),
      rating: rating || 5
    });

    await post.save();

    // Optionally repopulate comments to return full list
    await post.populate("comments.author", "fullname profileImage");

    return res.status(201).json({
      msg: "Comment added successfully.",
      commentCount: post.commentCount,
      comments: post.comments.map((c) => ({
        id: c._id,
        author: {
          id: c.author?._id,
          name: c.author?.fullname || "Unknown",
          profileImage: c.author?.profileImage || ""
        },
        text: c.text,
        rating: c.rating,
        createdAt: c.createdAt
      }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error adding comment." });
  }
};

module.exports = { getViewPost,likePost,addComment,authMiddleware };