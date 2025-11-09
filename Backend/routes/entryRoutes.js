const express = require('express');
const {
    createEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry,
    addComment,
} = require('../controllers/entryController');
const {protect} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


const router = express.Router();
const uploadFields = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'audio', maxCount: 3 },
  { name: 'videos', maxCount: 2 },
]);

router.route('/')
    .post(protect, uploadFields, createEntry)
    .get(protect, getEntries);

router.route('/:id')
    .get(protect, getEntry)
    .put(protect, updateEntry)
    .delete(protect, deleteEntry);

router.post('/:id//comment', protect, addComment);

module.exports = router;