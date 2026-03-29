const express = require('express');

const problemRouter = express.Router();
const adminMiddileware= require('../middileware/adminMiddileware');
const userMiddleware = require('../middileware/userMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,problemSolvedByUser}=require('../controllers/userProblem');

//use middileware for admin 
problemRouter.post('/create',adminMiddileware,createProblem);
problemRouter.delete('/delete/:id',adminMiddileware,deleteProblem);
problemRouter.put('/update/:id',adminMiddileware,updateProblem);

//no need for admin both acces
problemRouter.get('/problemById/:id',userMiddleware,getProblemById);
problemRouter.get('/getAllProblem',userMiddleware, getAllProblem);

problemRouter.get('/problemSolvedByUser',userMiddleware,problemSolvedByUser);



module.exports = problemRouter;




