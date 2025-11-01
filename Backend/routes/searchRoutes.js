const express = require('express');
const {
    searchEntries,
    getSearchSuggestions,
    getPopularTags,
} = require('../controllers/searchController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',protect,searchEntries);
router.get('/suggestions',protect, getSearchSuggestions);
router.get('/popular-tags',protect, getPopularTags);

module.exports = router;