const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req,res)=>{
  try{
    const {username,email,password,role} = req.body;
    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({username,email,password:hashed,role:role||"host"});
    res.json(user);
  }catch(e){ res.status(400).json({message:e.message}); }
});

router.post("/login", async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(400).json({message:"User not found"});
  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(400).json({message:"Wrong password"});
  const token = jwt.sign({id:user._id, username:user.username, role:user.role}, "airbnb_secret", {expiresIn:"1d"});
  res.json({token, user:{username:user.username, email:user.email, role:user.role}});
});

module.exports = router;