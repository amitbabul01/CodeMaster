const jwt=require("jsonwebtoken");
const User=require('../models/user');
const redisClient=require('../config/redis');

const adminMiddileware= async (req,res,next)=>{
    try{
        const {token} =req.cookies;
            if(!token){
                throw new Error("Token is not present");
            }
            const payload = jwt.verify(token,process.env.JWT_KEY);

            const {_id}=payload;

            if(!_id){
                throw new Error("Id is missing")
            }

            const result=await User.findById(_id);

            if(payload.role != 'admin'){
                throw new Error("Invalid token");
            }

            if(!result){
                throw new Error("user does not exist")
            }

            //it is present or not in redis blocklist
           const isBlocked = await redisClient.exists(`token:${token}`);

            if(isBlocked){
                throw new Error("Invalid token");
            }

            req.result=result;

            next();
    }
    catch(err){
        res.status(401).send("Error: "+err.message)
    }
}

module.exports=adminMiddileware;