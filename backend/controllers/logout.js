let User=require("../models/usermodel")

let logoutUser=async(req,res)=>{
    try{
        let { email }=req.params;
        if(!email){
            return res.status(400).json({ err:"email required"})
        }

        const user=await User.findOne({ email })
        if(!user){
            return res.status(404).json({ err: "User not found"})
        }
        res.clearCookie("token");

        return res.status(200).json({
            msg: "✅ User logged out successfully!"
        })
    }
    catch (error){
        return res.status(500).json({ err:"Logout failed: " + error.message})
    }
}
module.exports={ logoutUser}