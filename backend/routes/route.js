let express=require("express")
let rt=express.Router()

let { regcont } = require("../controllers/registercont")
let { lgcont } = require("../controllers/logincont")
let { resetpwd } = require("../controllers/resetcont")
let upload = require("../middlewares/upload")
const { createPost, authMiddleware: cpAuth } = require("../controllers/cpcont");
let { getAllPosts }=require("../controllers/allpostcont")
let { getViewPost,likePost,addComment,authMiddleware: viewAuthMiddleware }=require("../controllers/viewpostcont")
let { getDashboard,updatePost,deletePost,getPostById,authMiddleware: dashAuth }=require("../controllers/dashboardcont")
let { logoutUser }=require("../controllers/logout")


rt.post("/register",regcont);
rt.post("/login",lgcont)
rt.post("/reset",resetpwd)

rt.post("/createpost", cpAuth, upload.single("image"), createPost);
rt.get("/allposts",getAllPosts)

rt.get("/viewpost/:id", getViewPost);
rt.post("/viewpost/:id/like", viewAuthMiddleware, likePost);
rt.post("/viewpost/:id/comment", viewAuthMiddleware, addComment);


// Dashboard
rt.get("/dashboard", dashAuth, getDashboard);
rt.get("/dashboard/post/:id", dashAuth, getPostById);
// Edit post from dashboard
rt.put("/dashboard/post/:id",dashAuth,upload.single("featuredImage"),updatePost);
// Delete post from dashboard
rt.delete("/dashboard/post/:id", dashAuth, deletePost);

rt.post("/logout/:email",logoutUser)
module.exports=rt