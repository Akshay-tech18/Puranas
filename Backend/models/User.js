const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    culturalIntrest: {
        type: String,
        required: [true, 'Please add cultural Interest'],
        trim: true,
    },
    religion: {
        type: String,
        required: [true, 'Please add religion'],
        trim: true,
    },
    caste: {
        type: String,
        trim: true,
        default: null,
    },
    profilePicture: {
        type: String,
        default: 'https://via.placeholder.com/150',
    },
    familyGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyGroup',
    }],
},{
    timestamps: true,
});

// we hash the password before saving it in database
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
