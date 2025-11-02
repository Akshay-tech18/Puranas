const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// registering the new user 
// POST/api/auth/signup
const signup = async (req,res,next) => {
    try{
        const {name, email, password, culturalIntrest, religion, caste} = req.body;

        if(!name || !email || !password || !culturalIntrest || !religion){
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
            culturalIntrest,
            religion,
            caste,
        });

        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                culturalIntrest: user.culturalIntrest,
                religion: user.religion,
                caste: user.caste,
                token: generateToken(user._id),
            });
        }
    } catch(error){
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
        }else {
            res.status(401).json({message: 'Invalide email or password'});
        }
    }catch (error){
        next(error);
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