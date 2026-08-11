import riderModel from "../models/rider.model.js";
import { generateToken } from "../services/generateToken.js";

export async function handleGoogleSignUp(req,res) {
 try{
  const {name,email,picture,googleId } = req.user;
  const user = await riderModel.findOne({email});

  if(!user){
   const newUser = await riderModel.create({
    name:name,
    email:email,
    profilePic:picture,
    googleId:googleId
   });
   const token = generateToken(newUser._id);
   res.cookie('token',token);
   return res.redirect('http://localhost:5173');
  }

  const token = generateToken(user._id);
  res.cookie('token',token);
  return res.redirect('http://localhost:5173');

 }catch(err){
  console.error(err);
  return res.status(500).json({success:false,message:"Internal server error"});
 }
}

export async function addDetails(req,res){
 const {profilePic,name} = req.body;
 const {id} = req.user;
 try{
  const user = await riderModel.findById(id);
  if(!user){
   return res.status(404).json({success:false,message:"User not found"});
  }
  user.profilePic = profilePic || user.profilePic;
  user.name = name || user.name;
  await user.save();
  return res.status(200).json({success:true,message:"User details updated",user});
 }catch(err){
  console.error(err);
  return res.status(500).json({success:false,message:"Internal server error"});
 }
}

export async function getUser(req,res){
  try{
    const {id} = req.user;
    const user = await riderModel.findById(id);
    return res.status(200).json({success:true,message:"user fetched",user});
  }catch(err){
    console.error(err);
    return res.status(500).json({success:false,message:'Internal server error'});
  }
}