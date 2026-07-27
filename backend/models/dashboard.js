const mongoose = require('mongoose');

// Define the Dashboard Schema
const dashboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // One dashboard configuration/analytics profile per user
    },
    sidebarPreferences: {
      showMyPosts: { type: Boolean, default: true },
      showAnalytics: { type: Boolean, default: true }
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/**
 * Static method to dynamically calculate all dashboard metrics for a user.
 * This aggregates data from the 'Post' collection in real-time so that
 * likes, comments, and post counts are always accurate.
 * @param {mongoose.Types.ObjectId|String} userId - The ID of the logged-in user
 * @returns {Promise<Object>} Object containing counts and the user's recent posts
 */
dashboardSchema.statics.getDashboardData = async function (userId) {
  // Use the main Post model (cpmodel.js)
  const Post = mongoose.model('Post');

  // Convert string ID to Mongoose ObjectId safely
  const authorId = new mongoose.Types.ObjectId(userId);

  // 1. Run aggregation to calculate high-level stats (My Posts, Total Comments, Total Likes)
  const statsAggregation = await Post.aggregate([
    { $match: { author: authorId } },
    {
      $group: {
        _id: null,
        myPostsCount: { $sum: 1 },
        totalLikesCount: { $sum: { $size: { $ifNull: ["$likes", []] } } },
        totalCommentsCount: { $sum: { $size: { $ifNull: ["$comments", []] } } }
      }
    }
  ]);

  // Default stats if the user has no posts yet
  const stats = statsAggregation[0] || {
    myPostsCount: 0,
    totalLikesCount: 0,
    totalCommentsCount: 0
  };

  // 2. Query the user's posts to populate "MY RECENT POSTS"
  // Each card displays: Title, Image, Description (snippet from content), Date, and Time
  const recentPosts = await Post.find({ author: authorId })
    .select('title featuredImage content createdAt')
    .sort({ createdAt: -1 }); // newest first

  return {
    stats: {
      myPosts: stats.myPostsCount,
      comments: stats.totalCommentsCount,
      likes: stats.totalLikesCount
    },
    recentPosts: recentPosts.map((post) => {
      const createdDate = new Date(post.createdAt);

      // Formats date to: "15-Jul-2026"
      const dateString = createdDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
        .replace(/ /g, '-');

      // Formats time to: "10:30 AM"
      const timeString = createdDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Build a short description snippet from content
      const cleanContent = post.content
        .replace(/<[^>]*>/g, '')       // strip HTML tags
        .replace(/[#*`_\[\]()]/g, '')  // strip markdown symbols
        .trim();

      const description =
        cleanContent.length > 180
          ? `${cleanContent.substring(0, 177)}...`
          : cleanContent;

      return {
        _id: post._id,
        title: post.title,
        featuredImage: post.featuredImage,
        description,
        date: dateString,
        time: timeString
      };
    })
  };
};

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard;