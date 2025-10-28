const mongoose  = require('mongoose');

const familyGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a family name'],
        trim: true,
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true,
});

familyGroupSchema.pre('save', function(next){
    if(!this.inviteCode) {
        this.inviteCode = Math.random().toString(36).substring(2,8).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('FamilyGroup', familyGroupSchema);