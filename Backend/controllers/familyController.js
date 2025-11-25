// const FamilyGroup = require('../models/FamilyGroup');
// const User = require('../models/User');

// //Creating the family group
// // post/api/family/create
// const createFamily = async(req, res, next) => {
//     try{
//         const {name} = req.body;

//         if(!name) {
//             return res.status(400).json({message: 'Please provide a family name'});
//         }

//         const generateCode = () => {
//             return Math.random().toString(36).substring(2, 8).toUpperCase();
//         };

//         let inviteCode = generateCode();

//         let codeExists = await FamilyGroup.findOne({inviteCode});
//         while(codeExists) {
//             inviteCode = generateCode();
//             codeExists = await FamilyGroup.findOne({inviteCode});
//         }

//         const familyGroup = await FamilyGroup.create({
//             name,
//             inviteCode,
//             creatorId: req.user._id,
//             members: [req.user._id],
//         });

//         await User.findByIdAndUpdate(req.user._id, {
//             $push: {familyGroups: familyGroup._id},
//         });

//         res.status(201).json({
//             _id: familyGroup._id,
//             name: familyGroup.name,
//             inviteCode: familyGroup.inviteCode,
//             creatorId: familyGroup.creatorId,
//             members: familyGroup.members,
//         });
//     }catch (error){
//         next(error);
//     }
// };

// // join family group via invite code
// //post/api/family/join

// const joinFamily = async (req, res, next) => {
//     try{
//         const {inviteCode} = req.body;

//         if(!inviteCode) {
//             return res.status(400).json({message : 'Please provide an invite code'});
//         }

//         const familyGroup = await FamilyGroup.findOne({
//             inviteCode: inviteCode.toUpperCase()
//         });

//         if(!familyGroup){
//             return res.status(404).json({message : 'Invalid invite code'});
//         }

//         if(familyGroup.members.includes(req.user._id)) {
//             return res.status(404).json({message: 'you are already a member of this family'});
//         }

//         familyGroup.members.push(req.user._id);
//         await familyGroup.save();

//         await User.findByIdAndUpdate(req.user._id, {
//             $push : {familyGroup: familyGroup._id},
//         });

//         res.json({
//             message: 'Successfully joined family group',
//             familyGroup: {
//                 _id: familyGroup._id,
//                 name: familyGroup.name,
//                 inviteCode: familyGroup.inviteCode,
//             },
//         });
//     }catch (error){
//         next(error);
//     }
// };

// //get family group details
// // get/api/family/:id

// const getFamilyGroup = async (req, res, next) => {
//     try{
//         const familyGroup = await FamilyGroup.findById(req.params.id)
//             .populate('members','name email profilePicture')
//             .populate('creatorId', 'name email');

//             if(!familyGroup) {
//                 return res.status(404).json({message: 'Family group not found'});
//             }

//             const isMember = familyGroup.members.some(
//                 member => member._id.toString() === req.user._id.toString()
//             );

//             if(!isMember) {
//                 return res.status(403).json({message : 'Access denied'});
//             }

//             res.json(familyGroup);
//     }catch(error){
//         next(error);
//     }
// };

// //get all family groups user belongs to 
// // get/api/family

// const getUserFamilies = async (req, res, next) => {
//     try{
//         const user = await User.findById(req.user._id).populate({
//             path: 'familyGroups',
//             populate: {
//                 path: 'members',
//                 select: 'name profilePicture',
//             },
//         });

//         res.json(user.familyGroups);
//     } catch(error){
//         next(error);
//     }
// };

// //get family members
// // get/api/family/:id/members

// // const getFamilyMembers = async(req, res, next) => {
// //     try{
// //         const familyGroup = await FamilyGroup.findById(req.params.id)
// //             .populate('members', 'name email profilePicture createdAt');

// //             if(!familyGroup){
// //                 return res.status(404).json({message: 'Family group not found'});
// //             }

// //             const isMember = familyGroup.members.some(
// //                 member => member._id.toString() === req.user._id.toString()
// //             );

// //             if(!isMember){
// //                 return res.status(403).json({message: 'Access denied'});
// //             }

// //             res.json(familyGroup.members);
// //     }catch (error){
// //         next(error);
// //     }
// // };

// //remove member from family group
// // delete /api/family/:id/member/:userId

// const removeMember = async (req, res, next) => {
//     try{
//         const { id, userId} = req.params;

//         const familyGroup = await FamilyGroup.findById(id);


//         if(!familyGroup){
//             return res.status(404).json({message: 'Family group not found'});
//         }

//         if(familyGroup.creatorId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: 'Only the creator can remove members'});
//         }

//         if( userId === familyGroup.creatorId.toString()) {
//             return res.status(400).json({ message: 'cannot remove the creator'});
//         }

//         familyGroup.members = familyGroup.members.filter(
//             memberId => memberId.toString() !== userId
//         );

//         await familyGroup.save();

//         await User.findByIdAndUpdate(userId, {
//             $pull: {familyGroups: familyGroup._id},
//         });

//         res.json({message : 'Member removed successfully'});
//     }catch(error){
//         next(error);
//     }
// };

// // leave family group
// // delete/api/family/:id/leave

// const leaveFamily = async (req, res, next) => {
//     try {
//         const familyGroup = await FamilyGroup.findById(req.params.id);

//         if(!familyGroup) {
//             return res.status(404).json({message: 'Family group not found'});
//         }

//         if(familyGroup.creatorId.toString() === req.user._id.toString()) {
//             return res.status(400).json({
//                 message: 'creator cannot leave the group. delete the group or transfer ownership first.'
//             });
//         }

//         familyGroup.members = familyGroup.members.filter(
//             memberId => memberId.toString() !== req.user._id.toString()
//         );
//         await familyGroup.save();

//         await User.findByIdAndUpdate(req.user._id, {
//             $pull: {familyGroups: familyGroup._id},
//         });

//         res.json({ message: 'Successfully left the family group'});
//     }catch (error){
//         next(error);
//     }
// };

// //update family group 
// // put/api/family/:id

// // const updateFamily = async(req, res, next) => {
// //     try {
// //         const {name} = req.body;
// //         const familyGroup = await FamilyGroup.findById(req.params.id);

// //         if(!familyGroup) {
// //             return res.status(404).json({message: 'Family group not found'});
// //         }

// //         if(familyGroup.creatorId.toString() !== req.user._id.toString()) {
// //             return res.status(403).json({message: 'Only the creator can update the family group '});
// //         }

// //         await familyGroup.save();

// //         res.json(familyGroup);
// //     }catch(error) {
// //         next(error);
// //     }
// // };

// // delet family group
// // delete /api/family/:id
// const deleteFamily = async(req, res, next) => {
//     try{
//         const familyGroup = await FamilyGroup.findById(req.params.id);

//         if(!familyGroup) {
//             return res.status(404).json({message : 'Family group not found'});
//         }

//         if(familyGroup.creatorId.toString() !== req.user._id.toString()){
//             return res.status(403).json({message: 'only the creator can delete the family group'});
//         }

//         await User.updateMany(
//             {familyGroups: familyGroup._id},
//             {$pull: {familyGroups: familyGroup._id}}
//         );

//         await familyGroup.deleteOne();

//         res.json({message: 'Family group deleted successfully'});
//     }catch(error){
//         next(error);
//     }
// };

// module.exports = {
//     createFamily,
//     joinFamily,
//     getFamilyGroup,
//     getUserFamilies,
//     //getFamilyMembers,
//     removeMember,
//     leaveFamily,
//     //updateFamily,
//     deleteFamily,
// };

const FamilyGroup = require("../models/FamilyGroup");
const User = require("../models/User");

// ---------------------------------------------
// CREATE FAMILY
// ---------------------------------------------
const createFamily = async (req, res, next) => {
  try {
    if (req.user.familyGroup) {
      return res.status(400).json({ message: "You already belong to a family." });
    }

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Family name is required." });

    const generateCode = () =>
      Math.random().toString(36).substring(2, 8).toUpperCase();

    let inviteCode = generateCode();
    while (await FamilyGroup.findOne({ inviteCode })) {
      inviteCode = generateCode();
    }

    const familyGroup = await FamilyGroup.create({
      name,
      inviteCode,
      creatorId: req.user._id,
      members: [req.user._id],
    });

    req.user.familyGroup = familyGroup._id;
    await req.user.save();

    res.status(201).json({ familyGroup });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------
// JOIN FAMILY
// ---------------------------------------------
const joinFamily = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode)
      return res.status(400).json({ message: "Invite code required." });

    if (req.user.familyGroup)
      return res.status(400).json({ message: "You already belong to a family." });

    const familyGroup = await FamilyGroup.findOne({
      inviteCode: inviteCode.toUpperCase(),
    });

    if (!familyGroup)
      return res.status(404).json({ message: "Invalid invite code." });

    familyGroup.members.push(req.user._id);
    await familyGroup.save();

    req.user.familyGroup = familyGroup._id;
    await req.user.save();

    res.json({ familyGroup });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------
// GET MY FAMILY
// ---------------------------------------------
const getMyFamily = async (req, res, next) => {
  try {
    const currentUser = req.user._id;
    if (!req.user.familyGroup)
      return res.json({ familyGroup: null });

    const family = await FamilyGroup.findById(req.user.familyGroup)
      .populate("members", "name email")
      .populate("creatorId", "name email");

    // res.json({ familyGroup: family });
    res.json({
    familyGroup: { ...family.toObject(), currentUser }
});

  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------
// GET FAMILY DETAILS
// ---------------------------------------------
const getFamilyGroup = async (req, res, next) => {
  try {
    const family = await FamilyGroup.findById(req.params.id)
      .populate("members", "name email")
      .populate("creatorId", "name email");

    if (!family) return res.status(404).json({ message: "Family not found." });

    if (!family.members.some((m) => m._id.toString() === req.user._id.toString()))
      return res.status(403).json({ message: "Not a member of this family." });

    res.json(family);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------
// REMOVE MEMBER (ONLY CREATOR)
// ---------------------------------------------
const removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const family = await FamilyGroup.findById(id);
    if (!family) return res.status(404).json({ message: "Family not found" });

    if (family.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only creator can remove members" });
    }

    if (userId === family.creatorId.toString())
      return res.status(400).json({ message: "Creator cannot remove themselves" });

    family.members = family.members.filter(
      (m) => m.toString() !== userId
    );

    await family.save();

    await User.findByIdAndUpdate(userId, { familyGroup: null });

    res.json({ message: "Member removed" });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------
// LEAVE FAMILY (MEMBER ONLY)
// ---------------------------------------------
const leaveFamily = async (req, res, next) => {
  try {
    const family = await FamilyGroup.findById(req.params.id);

    if (!family) return res.status(404).json({ message: "Family not found" });

    if (family.creatorId.toString() === req.user._id.toString())
      return res.status(400).json({ message: "Creator cannot leave the family" });

    family.members = family.members.filter(
      (m) => m.toString() !== req.user._id.toString()
    );
    await family.save();

    req.user.familyGroup = null;
    await req.user.save();

    res.json({ message: "Left the family" });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------
// DELETE FAMILY (CREATOR ONLY)
// ---------------------------------------------
const deleteFamily = async (req, res, next) => {
  try {
    const family = await FamilyGroup.findById(req.params.id);

    if (!family) return res.status(404).json({ message: "Family not found" });

    if (family.creatorId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only creator can delete family" });

    // Clear all users’ familyGroup field
    await User.updateMany(
      { familyGroup: family._id },
      { $set: { familyGroup: null } }
    );

    await family.deleteOne();

    res.json({ message: "Family deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------

module.exports = {
  createFamily,
  joinFamily,
  getMyFamily,
  getFamilyGroup,
  removeMember,
  leaveFamily,
  deleteFamily,
};
