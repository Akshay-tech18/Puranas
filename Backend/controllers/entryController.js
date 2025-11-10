const Entry = require('../models/Entry');

//creating the new entry 
//POST api/entries
const createEntry = async (req, res, next) => {
    try {
        // const { title, content, tags, mode, familyGroupId, media} = req.body;
        const { title, content, tags, mode, familyGroupId} = req.body;
        const media = {
            images: [],
            audio: [],
            videos: [],
        };

        if (req.files) {
            if (req.files.images) {
                media.images = req.files.images.map((f) => `/uploads/images/${f.filename}`);
            }
            if (req.files.audio) {
                media.audio = req.files.audio.map((f) => `/uploads/audio/${f.filename}`);
            }
            if (req.files.videos) {
                media.videos = req.files.videos.map((f) => `/uploads/videos/${f.filename}`);
            }
        }

        const entry = await Entry.create({
            userId: req.user._id,
            title,
            content,
            tags,
            mode,
            familyGroupId : mode === 'family' ? familyGroupId : null,
            media,
        });

        res.status(201).json(entry);
    }catch (error){
        next(error);
    }
};

// for getting the entries (all)
// GET api/entires?mode=personal|family|community
const getEntries = async (req, res, next) => {
    try {
        const { mode, familyGroupId} = req.query;

        let query = {};

        if(mode === 'personal') {
            query = {userId: req.user._id, mode: 'personal'};
        }else if (mode === 'family' && familyGroupId) {
            query = {familyGroupId, mode: 'family'};
        }else if (mode === 'community') {
            query = {mode: 'community'};
        }else {
            query = {
                $or: [
                    {userId: req.user._id},
                    {mode: 'community'},
                    {mode: 'family', familyGroupId: { $in: req.user.familyGroups}},
                ],
            };
        }

        const entries = await Entry.find(query)
        .populate('userId','name profilePicture')
        .sort({createdAt: -1});

        res.json(entries);
    } catch(error){
        next(error);
    }
};

// getting a single entry 
// GET api/entries/:id
const getEntry = async (req, res, next) => {
    try{
        const entry = await Entry.findById(req.params.id)
            .populate('userId', 'name profilePicture')
            .populate('comments.userId', 'name profilePicture');

        if(!entry) {
            return res.status(404).json({ message : 'Entry not found'});
        }

        if(entry.mode === 'personal' && entry.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({message : 'Access denied'});
        }

        res.json(entry);
    }catch (error) {
        next(error);
    }
};

// updating the entry 
// PUT api/entires/:id
const updateEntry = async (req, res, next) => {
    try {
        let entry = await Entry.findById(req.params.id);

        if(!entry) {
            return res.status(404).json({message: 'Entry not found'});
        }

        if(entry.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({message: 'Not authorized to update the entry'});
        }

        entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.json(entry);
    }catch (error){
        next(error);
    }
};

//Deleting the entry 
//DELETE api/entires/:id
const deleteEntry = async (req, res, next) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if(!entry){
            return res.status(404).json({message: 'Entry not found '});
        }

        if(entry.userId.toString() !== req.user._id.toString()){
            return res.status(404).json({message: 'Not authorized to delete'});
        }

        await entry.deleteOne();
        res.json({message: 'Entry Deleted Successfully'});
    } catch(error){
        next(error);
    }
}

//Adding comment to entry 
//POST api/entries/:id/comment

const addComment = async (req, res, next) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if(!entry) {
            return res.status(404).json({message : 'Entry not found'});
        }

        // if(entry.mode === 'family'){
        //     // yet add the logic
        // }

        entry.comments.push({
            userId: req.user._id,
            text: req.body.text,
        });
         
        await entry.save();

        res.status(201).json(entry);
    } catch(error){
        next(error);
    }
}

module.exports = {
    createEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry,
    addComment,
};