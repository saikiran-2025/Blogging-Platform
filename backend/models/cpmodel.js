const mongoose = require("mongoose");

// Subdocument schema for comments on a post
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: [true, "Comment content cannot be empty."],
      trim: true
    },
    rating: {
      type: Number, // 1–5 stars
      min: 1,
      max: 5,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

const uscp = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required."],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters."]
    },
    featuredImage: {
      type: String, // Stores the URL or file path of the uploaded image
      default: ""
    },
    category: {
      type: String,
      trim: true,
      default: "Uncategorized"
    },
    content: {
      type: String,
      required: [true, "Post content is required."]
    },
    tags: {
      type: [String], // Array of strings
      default: []
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    readingTime: {
      type: Number, // minutes
      default: 1
    },

    // NEW: likes array for posts (users who liked this post)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // NEW: comments array for posts
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

// Calculate estimated reading time before saving
uscp.pre("save", function () {
  if (this.content) {
    const wordsPerMinute = 200;
    const words = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.ceil(words / wordsPerMinute);
  }
});

// Virtuals for likeCount and commentCount
uscp.virtual("likeCount").get(function () {
  return this.likes.length;
});

uscp.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Ensure virtuals are serialized
uscp.set("toJSON", { virtuals: true });
uscp.set("toObject", { virtuals: true });

const umcp = mongoose.model("Post", uscp);

module.exports = umcp;