const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        // const conn  = await mongoose.connect(process.env.MONGO_URL, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // });
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Database ${conn.connection.host}`);
    } catch (error) {
        console.log(`Connection Failed : ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectToDB;