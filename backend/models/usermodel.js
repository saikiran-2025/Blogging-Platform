const mongoose = require("mongoose");

const us = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
      // usually we don't keep fullname unique, because many people
      // can share the same name
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,          // create unique index
      trim: true,
      lowercase: true
    },
    pwd: {
      type: String,
      required: [true, "Password is required"]
    }
  },
  { timestamps: true }
);

const um = mongoose.model("User", us);

module.exports = um;