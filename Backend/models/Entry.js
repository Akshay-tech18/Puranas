const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    text: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const entrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add the title '],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Please add the content'],
    },
    media: {
        images: [String],
        videos: [String],
        audio: [String],
    },
    tages: [{
        type: String,
        lowercase: true,
    }],
    mode: {
        type: String,
        enum: ['personal','family','community'],
        default: 'personal',
    },
    familyGroupId:{
        type: mongoose.Schema.Types,ObjectId,
        ref: 'FamilyGroup',
    },
    category: {
        type: String,
        enum: ['recipe','tradition','event','story','other'],
        default: 'other',
    },
    comments: [commentSchema],
},{
    timestamps: true,
});


//text indexes for each search
entrySchema.index({title: 'text', content: 'text', tages:'text'});

module.exports = mongoose.model('Entry', entrySchema);