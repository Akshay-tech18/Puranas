const express = require('express');

const {
    upload,
    uploadMedia,
    deleteMedia,
    uploadProfilePicture,
} = require('../controllers/mediaController');
const{ protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/upload', protect, upload.array('files', 10), uploadMedia);
router.post('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);
router.delete('/:publicId', protect, deleteMedia);

module.exports = router;