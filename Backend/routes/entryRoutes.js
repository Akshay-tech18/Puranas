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

const router = express.Router();

router.route('/')
    .post(protect, createEntry)
    .get(protect, getEntries);

router.route('/:id')
    .get(protect, getEntry)
    .put(protect, updateEntry)
    .delete(protect, deleteEntry);

router.post('/:id//comment', protect, addComment);

module.exports = router;