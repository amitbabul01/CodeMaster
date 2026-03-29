const express = require('express');
const {register,login,logout,adminRegister} = require('../controllers/userAuthent');
const userMiddleware=require('../middileware/userMiddleware');
const adminMiddileware=require('../middileware/adminMiddileware');
const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register',adminMiddileware,adminRegister);

module.exports = authRouter;




