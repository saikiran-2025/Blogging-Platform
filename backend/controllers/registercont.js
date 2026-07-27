const bcrypt = require("bcrypt");
const User = require("../models/usermodel");

const regcont = async (req, res) => {
  try {
    const { fullname, email, pwd, confirmPwd } = req.body;

    // 1. Basic validation
    if (!fullname || !email || !pwd || !confirmPwd) {
      return res.status(400).json({ err: "Need to fill all fields" });
    }

    // 2. Confirm password check
    if (pwd !== confirmPwd) {
      return res.status(400).json({ err: "Password and confirm password must match" });
    }

    // 3. Check if email already exists
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ err: "Account already exists" });
    }

    // 4. Hash password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // 5. Create user
    const user = await User.create({
      fullname,
      email: email.toLowerCase(),
      pwd: hashedPwd
    });

    // 6. Never send password back in response
    return res.status(201).json({
      msg: "Registration successful",
      user: {
        fullname: user.fullname,
        email: user.email,
        _id: user._id
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: error.message || "Registration failed" });
  }
};

module.exports = { regcont };