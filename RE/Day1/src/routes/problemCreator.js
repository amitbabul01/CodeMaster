const express = require('express');

const problemRouter = express.Router();

//use middileware for admin 
problemRouter.post('/create',problemCreate);
problemRouter.delete('/:id',problemDelete);
problemRouter.patch('/:id',problemUpdate);

//no need for admin both acces
problemRouter.get(':id',problemFetch);
problemRouter.get('/',problemFetchAll);
problemRouter.get('/user',solvedProblem);



module.exports = problemRouter;




