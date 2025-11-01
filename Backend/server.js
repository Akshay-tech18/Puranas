require('dotenv').config()

const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/db');
const {errorHandler} = require('./middleware/errorMiddleware')

connectToDB(); // this establishes the connection to database that mongoDB

const app = express(); //this is used to create application instance (or) object 

//middleware
// app.use((req,res,next) => {
//     console.log(req.path, req.method);
//     next();
// })
app.use(cors());
app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users',require('./routes/userRoutes'));
app.use('/api/entries',require('./routes/entryRoutes'));
app.use('/api/family',require('./routes/familyRoutes'));
app.use('/api/search',require('./routes/searchRoutes'));
app.use('/api/media',require('./routes/mediaRoutes'));

//routes
app.get('/', (req,res) => {
    res.json({
        msgg: 'Welcome to Puranas Website',
        version:'1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            entries: 'api/entries',
            family:'/api/family',
            search:'/api/search',
            media: '/api/media',
        }
    });
})

//404 handler
app.use((req, res) => {
    res.status(404).json({message: 'Routes not found'});
})

app.use(errorHandler);

//either nodemon server.js or npm run dev to run the server 
app.listen(process.env.PORT, () => {
    console.log("listening to port ",process.env.PORT);                      
});

