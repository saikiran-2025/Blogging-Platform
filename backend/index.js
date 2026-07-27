// index.js
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const rt = require("./routes/route");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Static for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", rt);

// Optional global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error middleware:", err);
  if (err && err.message === "Only image files are allowed.") {
    return res.status(400).json({ err: err.message });
  }
  return res.status(500).json({ err: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});