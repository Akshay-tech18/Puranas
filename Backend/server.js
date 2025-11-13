// require('dotenv').config()

// const express = require('express');
// const cors = require('cors');
// const connectToDB = require('./config/db');
// const {errorHandler} = require('./middleware/errorMiddleware')

// connectToDB(); // this establishes the connection to database that mongoDB

// const app = express(); //this is used to create application instance (or) object 

// //middleware
// // app.use((req,res,next) => {
// //     console.log(req.path, req.method);
// //     next();
// // })
// app.use(cors());
// app.use(express.json())

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users',require('./routes/userRoutes'));
// app.use('/api/entries',require('./routes/entryRoutes'));
// app.use('/api/family',require('./routes/familyRoutes'));
// app.use('/api/search',require('./routes/searchRoutes'));
// app.use('/api/media',require('./routes/mediaRoutes'));

// //routes
// app.get('/', (req,res) => {
//     res.json({
//         msgg: 'Welcome to Puranas Website',
//         version:'1.0.0',
//         endpoints: {
//             auth: '/api/auth',
//             users: '/api/users',
//             entries: '/api/entries',
//             family:'/api/family',
//             search:'/api/search',
//             media: '/api/media',
//         }
//     });
// })

// //404 handler
// app.use((req, res) => {
//     res.status(404).json({message: 'Routes not found'});
// })

// app.use(errorHandler);

// //either nodemon server.js or npm run dev to run the server 
// app.listen(process.env.PORT, () => {
//     console.log("listening to port ",process.env.PORT);                      
// });

// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const path = require('path'); // ✅ Added for serving uploaded files
// const connectToDB = require('./config/db');
// const { errorHandler } = require('./middleware/errorMiddleware');

// connectToDB(); // Connect to MongoDB

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/entries', require('./routes/entryRoutes'));
// app.use('/api/family', require('./routes/familyRoutes'));
// app.use('/api/search', require('./routes/searchRoutes'));

// // app.use('/api/media', require('./routes/mediaRoutes'));
// app.use('/api/media', require('./routes/mediaRoutes'));

// app.get('/', (req, res) => {
//   res.json({
//     msg: 'Welcome to Puranas Website',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',
//       users: '/api/users',
//       entries: '/api/entries',
//       family: '/api/family',
//       search: '/api/search',
//       media: '/api/media',
//     },
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // Error middleware
// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectToDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

connectToDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/entries', require('./routes/entryRoutes'));
app.use('/api/family', require('./routes/familyRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
  res.json({
    msg: 'Welcome to Puranas Website',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      entries: '/api/entries',
      family: '/api/family',
      search: '/api/search',
      media: '/api/media',
      upload: '/api/upload',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
