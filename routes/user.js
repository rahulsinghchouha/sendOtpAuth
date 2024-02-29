const express = require("express");
const router = express.Router();

const {login,signup} = require("../Controller/Auth");

//we importing middlewares


 const {auth,isStudent,isAdmin} = require("../middleWares/auth");

// //if we wanna  testing route
 router.get("/test",auth,(req,res)=>{
     res.json({
         success:true,
         message:"Welcome to the protected routes for TESTING",
     });
 })

// //protected route we use middlewares in call back we definrd the actions
 router.get("/student",auth,isStudent,(req,res)=>{
     res.json({
         success:true,
         message:"Welcome to the protected routes for student",
     });
 })

// //for admin
 router.get("/Admin",auth,isAdmin,(req,res)=>{
     res.json({
         success:true,
         message:"Welcome to the protected routes for student",
     });
 })

// router.post("/login",login);
// router.post("/signup",signup);

module.exports = router;