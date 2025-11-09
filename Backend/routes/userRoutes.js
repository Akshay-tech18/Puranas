const express = require('express');
const {
    getUserProfile,
    getMyProfile,
    updateUserProfile,
    changePassword,
    deleteUser,
    //getUserStats
} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me',protect,getMyProfile);
router.get('/:id',protect, getUserProfile);
router.put('/:id',protect, updateUserProfile);
router.put('/:id/password',protect, changePassword);
router.delete('/:id',protect,deleteUser);
//router.get('/:id/stats', protect, getUserStats);

module.exports = router;