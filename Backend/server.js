require('dotenv').config()

const express = require('express');
const cors = require('cors');


const app = express();

//middleware
app.use((req,res,next) => {
    console.log(req.path, req.method);
    next();
})

//routes
app.get('/', (req,res) => {
    res.json({msgg: 'Welcome to Puranas Website'});
})

//either nodemon server.js or npm run dev to run the server 
app.listen(process.env.PORT, () => {
    console.log("listening to port ",process.env.PORT);                      
});

