const express = require('express');
const {
    createFamily,
    joinFamily,
    getFamilyGroup,
    getUserFamilies,
    getFamilyMembers,
    removeMember,
    leaveFamily,
    updateFamily,
    deleteFamily,
} = require('../controllers/familyController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create',protect, createFamily);
router.post('/join',protect, joinFamily);
router.get('/', protect, getUserFamilies);
router.get('/:id', protect, getFamilyGroup);
router.get('/:id/members',protect,getFamilyMembers);
router.delete('/:id/member/:userId',protect, removeMember);
router.delete('/:id/leave', protect,leaveFamily);
router.put('/:id',protect,updateFamily);
router.delete('/:id',protect,deleteFamily);

module.exports = router;