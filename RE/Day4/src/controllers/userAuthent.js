const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const Submission =require("../models/submission")
const register= async(req,res)=>{
    try{

    validate(req.body);

    const {firstName,emailId,password} = req.body;
    
    req.body.password=await bcrypt.hash(password,10);
    req.body.role = 'user';
    const user = await User.create(req.body);
    
    const reply={
        firstName : user.firstName,
        emailId : user.emailId,
        _id : user._id,
        role: user.role,
    }

    //generate jwt token
    const token = jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
    });
    res.status(201).json({
        user:reply,
        message:"User registered succesfully"
    });

    }
    catch(err){
        res.status(400).send("Error"+err);
        console.log("`Error"+err.message)
    }


}

const login= async(req,res)=>{
    try{
        const{emailId,password}=req.body;
        
        if(!emailId)
            throw new Error("invalid credential");
        if(!password)
            throw new Error("Invalid credential");

        const user = await User.findOne({emailId})


        const match = await bcrypt.compare(password,user.password)

        if(!match){
            throw new Error("Invalid Credentials");
        }
        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role: user.role,
            
        }


        const token = jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
        });
        res.status(200).json({
            user:reply,
            message:"User login succesfully"
        })
        
    }
    catch(err){
        res.status(401).send('Error: '+err)
    }

}

const logout = async(req,res)=>{

    try{

        //validate the token
        //Token add kar dunga redis ke blockeList me

        //Cookiess ko clear karde
        const {token}=req.cookies;
        const payload=jwt.decode(token);
        
            await redisClient.set(`token:${token}`,"Blocked");
                // await redisClient.expire(`token:${token}`,1800)
            await redisClient.expireAt(`token:${token}`,payload.exp)
        
                
            res.cookie("token",null,{expires: new Date(Date.now())});
            res.send("Logged Out Sussesfully");
        
    }
    catch(err){
        res.status(503).send("Error: "+err);
    }
}

const adminRegister=async(req,res)=>{
    try{

    validate(req.body);

    const {firstName,emailId,password} = req.body;
    
    req.body.password=await bcrypt.hash(password,10);
    

    
    const user = await User.create(req.body);

    //generate jwt token
    const token = jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
    res.cookie('token',token,{maxAge:60*60*1000 });
    res.status(201).send("User registered succesfully");

    }
    catch(err){
        res.status(400).send("Error"+err);
    }


}

const deleteProfile = async(req,res)=>{
    try{
        const userId = req.result._id;

       await User.findByIdAndDelete(userId);
       
       await Submission.deleteMany({userId});

       res.status(200).send("Deleted sussesfully");
    }
    catch(err){
        res.status(500).send("error in deleteprofile"+err)
    }
}
module.exports = { register, login,logout,adminRegister,deleteProfile};