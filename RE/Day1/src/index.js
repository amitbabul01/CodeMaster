const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter=require('./routes/userauth');
const redisClient = require('./config/redis');

app.use(express.json());
app.use(cookieParser());

app.use('/user/auth',authRouter);

const InitializeConnection = async () => {
    try {
        // ✅ Correct syntax for Promise.all
        await Promise.all([
            main(),
            redisClient.connect()
        ]);

        console.log(" MongoDB & Redis connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(" Server listening on port: " + process.env.PORT);
        });
    } catch (err) {
        console.log(" Error initializing connections: " + err);
    }
};
InitializeConnection();

// main()
// .then(async ()=>{
//     app.listen(process.env.PORT, ()=>{
//         console.log("the server listening on: "+process.env.PORT);
//     });
// })
// .catch(err => console.log("Error occurred: "+err))

