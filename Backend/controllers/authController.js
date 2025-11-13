const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// registering the new user 
// POST/api/auth/signup
const signup = async (req,res,next) => {
    try{
        const {name, email, password, culturalInterest, religion, caste} = req.body;

        if(!name || !email || !password || !culturalInterest || !religion){
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        //checking if the user exists 
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({message: 'User already exists'});
        }

        //if user not exist then we are creating the new user here
        const user = await User.create({
            name,
            email,
            password,
            culturalInterest,
            religion,
            caste,
        });

        console.log("request recived");

        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                culturalInterest: user.culturalInterest,
                religion: user.religion,
                caste: user.caste,
                token: generateToken(user._id),
            });
        }
        console.log("Profile created succesfully");
    } catch(error){
         console.error("🔥 Signup Error:", error);
         res.status(500).json({ message: error.message || "Server error" });
        next(error);
    }
};

//logining in the existing user
//POST//api/auth/login
const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            });
        }


        const user = await User.findOne({email}).select('+password');

        if(user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
            console.log("logged in succesfully");
        }else {
            res.status(401).json({message: 'Invalide email or password'});
        }
    }catch (error){
        next(error);
        console.log("Error occured");
    }
};

const verifyToken = async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    });
};

module.exports = {signup, login, verifyToken};