const bcrypt = require("bcrypt");
const User = require("../models/usermodel");

const resetpwd = async (req, res) => {
    try {
        const { email, new_pwd, confirm_pwd } = req.body;

        // Check if all fields are entered
        if (!email || !new_pwd || !confirm_pwd) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        // Check if email exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account does not exist with this email."
            });
        }

        // Check password match
        if (new_pwd !== confirm_pwd) {
            return res.status(400).json({
                success: false,
                message: "New Password and Confirm Password do not match."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(new_pwd, 10);

        // Update password
        user.pwd = hashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    }
    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = { resetpwd };