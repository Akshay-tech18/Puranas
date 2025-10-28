const FamilyGroup = require('../models/FamilyGroup');
const User = require('../models/User');

//Creating the family group
// post/api/family/create
const createFamily = async(req, res, next) => {
    try{
        const {name} = req.body;

        if(!name) {
            return res.status(400).json({message: 'Please provide a family name'});
        }

        const generateCode = () => {
            return Math.random().toString(36).substring(2, 8).toUpperCase();
        };

        let inviteCode = generateCode();

        let codeExists = await FamilyGroup.findOne({inviteCode});
        while(codeExists) {
            inviteCode = generateCode();
            codeExists = await FamilyGroup.findOne({inviteCode});
        }

        const familyGroup = await FamilyGroup.create({
            creatorId: req.user._id,
            members: [req.user._id],
        });

        await UserfindByIdAndUpdate(req.user._id, {
            $push: {familyGroups: familyGroup._id},
        });

        res.status(201).json({
            _id: familyGroup._id,
            name: familyGroup.name,
            inviteCode: familyGroup.inviteCode,
            creatorId: familyGroup.creatorId,
            members: familyGroup.members,
        });
    }catch (error){
        next(error);
    }
};

// join family group via invite code
//post/api/family/join

const joinFamily = async (req, res, next) => {
    try{
        const {inviteCode} = req.body;

        if(!inviteCode) {
            return res.status(400).json({message : 'Please provide an invite code'});
        }

        const familyGroup = await FamilyGroup.findOne({
            inviteCode: inviteCode.toUpperCase()
        });

        if(!familyGroup){
            return res.status(404).json({message : 'Invalid invite code'});
        }

        if(familyGroup.members.include(req.user._id)) {
            return res.status(404).json({message: 'you are already a member of this family'});
        }

        familyGroup.members.push(req.user._id);
        await familyGroup.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push : {familyGroup: familyGroup._id},
        });

        res.json({
            message: 'Successfully joined family group',
            familyGroup: {
                _id: familyGroup._id,
                name: familyGroup.name,
                inviteCode: familyGroup.inviteCode,
            },
        });
    }catch (error){
        next(error);
    }
};

//get family group details
// get/api/family/:id

const getFamilyGroup = async (req, res, next) => {
    try{
        const familyGroup = await FamilyGroup.findById(req.params.id)
            .populate('members','name email profilePicture')
            .populate('creatorId', 'name email');

            if(!familyGroup) {
                return res.status(404).json({message: 'Family group not found'});
            }

            const isMember = familyGroup.members.some(
                member => member._id.toString() === req,user._id.toString()
            );

            if(!isMember) {
                return res.status(403).json({message : 'Access denied'});
            }

            res.json(familyGroup);
    }catch(error){
        next(error);
    }
};

//get all family groups user belongs to 
// get/api/family

const getUserFamilies = async (req, res, next) => {
    try{
        const user = await User.findById(req.user._id).populate({
            path: 'familyGroups',
            populate: {
                path: 'members',
                select: 'name profilePicture',
            },
        });

        res.json(user.familyGroups);
    } catch(error){
        next(error);
    }
};

//get family members
// get/api/family/:id/members

const getFamilyMembers = async(req, res, next) => {
    try{
        const familyGroup = await FamilyGroup.findById(req.params.id)
            .populate('members', 'name email profilePicture createdAt');

            if(!familyGroup){
                return res.status(404).json({message: 'Family group not found'});
            }

            const isMember = familyGroup.members.some(
                member => member._id.toString() === req.user._id.toString()
            );

            if(!isMember){
                return res.status(403).json({message: 'Access denied'});
            }

            res.json(familyGroup.members);
    }catch (error){
        next(error);
    }
};

//remove member from family group
// delete /api/family/:id/member/:userId

const removeMember = async (req, res, next) => {
    try{
        const { id, userId} = req.params;

        if(!familyGroup){
            return res.status(404).json({message: 'Family group not found'});
        }

        if(familyGroup.creatorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the creator can remove members'});
        }

        if( userId === familyGroup.creatorId.toString()) {
            return res.status(400).json({ message: 'cannot remove the creator'});
        }

        familyGroup.members = familyGroup.members.filter(
            memberId => memberId.toString() !== userId
        );

        await familyGroup.save();

        await User.findByIdAndUpdate(userId, {
            $pull: {familyGroups: familyGroup._id},
        });

        res.json({message : 'Member removed successfully'});
    }catch(error){
        next(error);
    }
};

// leave family group
// delete/api/family/:id/leave

const leaveFamily = async (req, res, next) => {
    try {
        const familyGroup = await FamilyGroup.findById(req.params.id);

        if(!familyGroup) {
            return res.status(404).json({message: 'Family group not found'});
        }

        if(familyGroup.creatorId.toString() === req.user._id.toString()) {
            return res.status(400).json({
                message: 'creator cannot leave the group. delete the group or transfer ownership first.'
            });
        }

        familyGroup.members = familyGroup.members.filter(
            memberId => memberId.toString() !== req.user._id.toString()
        );
        await familyGroup.save();

        await User.findByIdAndUpdate(req.user._id, {
            $pull: {familyGroups: familyGroup._id},
        });

        res.json({ message: 'Successfully left the family group'});
    }catch (error){
        next(error);
    }
};

//update family group.............