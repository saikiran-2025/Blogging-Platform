let mongoose=require("mongoose")
let rpus=new mongoose.Schema({
    "email":{
        type: String,
        required: [true,"Email is required"],
        unique:true,
        trim:true
    },
    "new_pwd":{
        type: String,
        required: [true,"Password is required"]
    }
})
let rpum=mongoose.model("Resetpassword",rpus)
module.exports=rpum