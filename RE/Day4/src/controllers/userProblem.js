const axios= require('axios');
const Problem=require('../models/problem');
const User = require("../models/user");
const Submission = require("../models/submission");
const {getLanguageById,submitBatch,submitToken}=require('../utils/problemUtility')

const createProblem= async(req,res)=>{

    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;
    
    try{
        console.log("referenceSolution:", referenceSolution);
 
        if (!Array.isArray(referenceSolution)) {
        return res.status(400).json({ error: "referenceSolution must be an array" });
        }
        

        for(const{language,completeCode} of referenceSolution){

            //source_code
            //language_id
            //stdin
            //expectedOutput

            const languageId=getLanguageById(language);

            //give the all things in a batch
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,  // use consistent lowercase
                stdin:testcase.input,
                expected_output: testcase.output
            }));

            //submit the submission  completecode and language id and input and output 
            const submitResult = await submitBatch(submissions);

            //submitResult give the tokens we 
            const resultToken = submitResult.map((value)=>value.token);
            console.log("resultToken gudge0 =>>>>",resultToken)

            const testResult = await submitToken(resultToken);


            for (const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error occured")
                }
            }  
        }

        //we can store problem in database
        await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });
        res.status(201).send("Problem saved sussesfully");
    }
    catch(err){
        res.status(400).send("Error"+err);
    }



}

const updateProblem= async(req,res)=>{
    //we check the updatedata provided by the user are correct by judge0 or not
    const {id}=req.params;
    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;
    try{
        if (!Array.isArray(referenceSolution)) {
        return res.status(400).json({ error: "referenceSolution must be an array" });
        }
        if(!id){
            return res.status(400).send("Missing Id field");
        }
        const DsaProblem = await Problem.findById(id);
        if(!DsaProblem){
            return res.status(404).send('Id is not present in server')
        }

        for(const{language,completeCode} of referenceSolution){

            //source_code
            //language_id
            //stdin
            //expectedOutput

            const languageId=getLanguageById(language);

            //give the all things in a batch
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,  // use consistent lowercase
                stdin:testcase.input,
                expected_output: testcase.output
            }));

            //submit the submission  completecode and language id and input and output 
            const submitResult = await submitBatch(submissions);

            //submitResult give the tokens we 
            const resultToken = submitResult.map((value)=>value.token);

            const testResult = await submitToken(resultToken);


            for (const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error occured")
                }
            }  
        }

       const newProblem = await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true, new:true});//checking of validity of a field is not bydefult in update method
       res.status(200).send(newProblem);
    }
    catch(err){
        res.status(500).send("Error: "+err)
    }
}

const deleteProblem = async(req,res)=>{
    const {id}=req.params;
    try{
        if(!id){
            return res.status(400).send("Id is Missing")
        }
        const deletedProblem = await Problem.findByIdAndDelete(id);

        if(!deletedProblem){
            return res.status(404).send("Problem is missing")
        }

        res.status(200).send("succesfully deletd")

    }
    catch(err){
        res.status(500).send("Error"+err);
    }
}

const getProblemById = async(req,res)=>{
    const {id}=req.params;
    try{
        if(!id){
            return res.status(400).send("Id is Missing")
        }
        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode');

        if(!getProblem){
            return res.status(404).send("Problem is missing")
        }

        res.status(200).send(getProblem);

    }
    catch(err){
        res.status(500).send("Error"+err);
    }
}

const getAllProblem = async(req,res)=>{
    
    try{
        
        const getProblem = await Problem.find({}).select('_id title difficulty tags');

        if(getProblem.lenght==0){
            return res.status(404).send("Problem is missing")
        }

        res.status(200).send(getProblem);

    }
    catch(err){
        res.status(500).send("Error"+err);
    }
}

const problemSolvedByUser =  async(req,res)=>{
   
    try{
       
      const userId = req.result._id;

      const user =  await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      });
      
      res.status(200).send(user.problemSolved);

    }
    catch(err){
      res.status(500).send("Server Error");
    }
}





module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,problemSolvedByUser};
