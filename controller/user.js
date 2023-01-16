import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/user.js'

export const signin=async(req,res)=>{
    const {email,password}=req.body;

   

    try {
        const existingUser=await User.findOne({email});
     

        if(!existingUser) return res.status(404).json({message:"User doesn't exist"})

        const ispasswordcorrect=await bcrypt.compare(password,existingUser.password)

        if(!ispasswordcorrect) return res.status(404).json({message:"Invalid Credential"})

        const token=jwt.sign({email:existingUser.email,id:existingUser._id},process.env.JWT_VERIFY_ID,{expiresIn:"1h"})

        res.status(200).json({result:existingUser,token})
        
    } catch (error) {
        res.status(500).json("Something went wrong..")
        
    }


}

export const signup=async(req,res)=>{
    const {firstName,lastName,email,password,confirmPassword}=req.body;

    try {
        const isexistUser=await User.findOne({email});
      
        if(isexistUser) return res.status(404).json({message:"User already exist"});
     
        if(confirmPassword!==password) return res.status(404).json({message:"Password does not match"});
        
        const hashPassword=await bcrypt.hash(password,12);
    
        const result=await User.create({email,password:hashPassword,name:`${firstName} ${lastName}`});

        const token=jwt.sign({email:result.email,id:result._id},"test",{expiresIn:"1h"})

        
        res.status(200).json({result,token})

    } catch (error) {
        res.status(500).json("Something went wrong..")
    }


}



