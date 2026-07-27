const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const lgcont = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    // 1. Basic validation
    if (!email || !pwd) {
      return res.status(400).json({ err: "Need to fill all fields" });
    }

    // 2. Find user by email (case-insensitive)
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (!exists) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(pwd, exists.pwd);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // 4. Create JWT token (use user id, not 'data._id')
    const payload = { _id: exists._id , fullname: exists.fullname };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY , { expiresIn: "1h" });

    // 5. Send token and basic user info (no password)
    return res.status(200).json({
      token,
      email: exists.email,
      _id: exists._id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error in login" });
  }
};
module.exports = { lgcont };