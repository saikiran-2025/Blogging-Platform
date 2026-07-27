const Post = require("../models/cpmodel"); 

// Get all published posts for "All Posts" page
// Get all published posts for "All Posts" page
const getAllPosts = async (req, res) => {
  try {
    // 1. Find only published posts from Post collection
    const posts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })                // newest first
      .populate("author", "fullname");        // get author name from User

    // 2. Map to a clean structure for your card layout
    const formatted = posts.map((post) => {
      // Build a description from content if needed
      const cleanContent = post.content
        .replace(/<[^>]*>/g, "")           // remove HTML if any
        .replace(/[#*`_\[\]()]/g, "")      // remove markdown symbols
        .trim();

      const description =
        cleanContent.length > 180
          ? `${cleanContent.substring(0, 177)}...`
          : cleanContent;

      return {
        id: post._id,
        title: post.title,
        featuredImage: post.featuredImage,
        category: post.category,
        description,                       // short snippet
        authorName: post.author?.fullname || "Unknown",
        date: post.createdAt,
        readingTime: post.readingTime,
        tags: post.tags,
        views: 0                           // cpmodel doesn't have views yet
      };
    });

    // 3. Return JSON for frontend
    return res.status(200).json({
      msg: "All published posts fetched successfully.",
      posts: formatted
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error fetching posts." });
  }
};

module.exports = { getAllPosts };