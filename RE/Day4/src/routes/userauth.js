const express = require('express');
const {register,login,logout,adminRegister,deleteProfile} = require('../controllers/userAuthent');
const userMiddleware=require('../middileware/userMiddleware');
const adminMiddileware=require('../middileware/adminMiddileware');
const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register',adminMiddileware,adminRegister);
authRouter.delete('/profile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{
    
    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})
module.exports = authRouter;




