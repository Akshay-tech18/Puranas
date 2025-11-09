const User = require('../models/User');
const bcrypt = require('bcryptjs');

// get user profile
// get /api/ user/ :id
const getUserProfile = async(req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('familyGroups', 'name inviteCode');

        if(!user) {
            return res.status(404).json({message: 'user not found'});
        }

        res.json(user);
    }catch (error){
        next(error);
    }
};

// get current user profile
// get/api/users/me
const getMyProfile = async (req, res, next) => {
    try{
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('familyGroups', 'name inviteCode creatorId members');
        res.json(user);
    }catch (error) {
        next(error);
    }
};

// update user profile
// put /api/users/:id

const updateUserProfile  = async(req, res, next) => {
    try {
        if(req.params.id !== req.user._id.toString()) {
            return res.status(403).json({message: 'Not authorized to update this profile'});
        }

        const { name, email, profilePicture,culturalIntrest, religion, caste} = req.body;

        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({message: 'user not found'});
        }

        if(email && email !== user.email) {
            const emailExists = await User.findOne({email});
            if(emailExists) {
                return res.status(400).json({message: 'Email already in use'});
            }
            user.email = email;
        }

        if(name) user.name = name;
        if(profilePicture) user.profilePicture = profilePicture;
        if(culturalIntrest) user.culturalIntrest = culturalIntrest;
        if(religion) user.religion = religion;
        if(caste !== undefined) user.caste = caste;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            culturalIntrest: user.culturalIntrest,
            religion: user.religion,
            caste: user.caste,
        });
    }catch(error) {
        next(error);
    }
};

//change password]
// put /api/userss/:id/password
const changePassword = async (req, res, next) => {
    try{
        if(req.params.id !== req.user._id.toString()){
            return res.status(403). json({message: 'Not authorized '});
        }

        const {currentPassword, newPassword} = req.body;

        if(!currentPassword || !newPassword) {
            return res.status(400).json({
                message : 'please provide current password and new password'
            });
        }

        if(newPassword.length < 6){
            return res.status(400).json({
                message: 'new password must be at least 6 char'
            });
        }

        const user = await User.findById(req.params.id).select('+password');

        if(!user) {
            return res.status(404).json({message: 'user not found'});
        }

        const isMatch = await user.matchPassword(currentPassword);
        if(!isMatch) {
            return res.status(401).json({message : 'current password is incorrect'});
        }

        user.password = newPassword;
        await user.save();

        res.json({message: 'password updarted successfully'});
    }catch (error) {
        next(error);
    }
};

// delete user acc
// delete /api/users/:id

const deleteUser = async (req, res, next) => {
    try{
        if(req.params.id !== req.user._id.toString()){
            return res.status(403).json({message: 'not authorized'});
        }

        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({message: 'user not found'});
        }

        const Entry = require('../models/Entry');
        await Entry.deleteMany({userId: user._id});

        const FamilyGroup = require('../models/FamilyGroup');
        await FamilyGroup.updateMany(
            {members: user._id},
            {$pull: {members : user._id}}
        );

        await FamilyGroup.deleteMany({creatorId: user._id});

        await user.deleteOne();

        res.json({message: 'user account deleted successfully'});
    }catch (error){
        next(error)
    }
};

// get user statistice
//. get /api/users/:id/stats

// const getUserStats = async (req, res, next) => {
//     try {
//         const userId = req.params.id;

//         if(userId !== req.user._id.toString()) {
//             return res.status(403).json({message: 'Access denied'});
//         }

//         const Entry = require('../models/Entry');

//         const entryCounts = await Entry.aggregate([
//             {$match: {userId: req.user._id}},
//             {$group: {_id: '$mode', count: {$sum: 1}}},
//         ]);

//         const categoryCounts = await Entry.aggregate([
//             {$match: {userId: req.user._id}},
//             { $group:{_id: '$category', count: {$sum: 1}}},
//         ]);

//         const totalEntries = await Entry.conutDocuments({userId: req.user._id});

//         const mediaStats = await Entry.aggregate([
//             {$match: { userId: req.user._id}},
//             {
//                 $project: {
//                     imageCount : {$size: {$ifNull: ['$media.images',[]]}},
//                     videoCount : {$size: {$ifNull: ['$media.videos',[]]}},
//                     audioCount : {$size: {$ifNull: ['$media.audio',[]]}},
//                 },
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalImages: {$sum: '$imageCount'},
//                     totalVideos: {$sum: '$videoCount'},
//                     totalAudios: {$sum: '$audioCount'},
//                 },
//             },
//         ]);

//         const user = await User.findById(req.user._id);
//         const familyGroupsCount = user.familyGroups.length;

//         res.json({
//             totalEntries,
//             entriesByMode: entryCounts,
//             entriesByCategory: categoryCounts,
//             media: mediaStats[0] || {totalImages: 0, totalVideos: 0, totalAudio: 0},
//             familyGroups: familyGroupsCount,
//         });
//     }catch (error){
//         next(error);
//     }
// };

module.exports = {
    getUserProfile,
    getMyProfile,
    updateUserProfile,
    changePassword,
    deleteUser,
    //getUserStats,
};