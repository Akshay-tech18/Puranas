const Entry = require('../models/Entry');

// search entries
// get /api/ search

const searchEntries = async (req, res, next) => {
    try {
        const {
            q,
            mode,
            category,
            tags,
            familyId,
            userId,
            sortBy,
            order,
            page  = 1,
            limit = 10,
        } = req.query;

        let query = {};

        if(q) {
            query.$text = {$search: q};
        }

        if(mode) {
            query.mode = mode;
        }

        if(category) {
            query.category = category;
        }

        if(tags) {
            const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
            query.tags = {$in: tagArray};
        }

        if(familyId) {
            query.familyGroupId = familyId;
        }

        if(userId) {
            query.userId = userId;
        }

        if(!mode || mode === 'personal') {
            if(!userId || userId === req.user._id.toString()) {
                query.userId = req.user._id;
                query.mode = 'personal';
            }else {
                return res.json({entries: [], total: 0, pages: 0});
            }
        }else if (mode === 'family') {
            const User = require('../models/User');
            const user = await User.findById(req.user._id);

            if(familyId) {
                if(!user.familyGroups.includes(familyId)) {
                    return res.status(403).json({message: 'Access denied to this family group '});
                }
            }else {
                query.familyGroupId = { $in: user.familyGroup};
            }
            query.mode = 'family';
        }else if (mode === 'community') {
            query.mode = 'community';
        }

        if(!mode && !query.mode) {
            const User = require('../models/User');
            const user = await User.findById(req.user._id);

            query.$or = [
                {userId: req.user._id},
                {mode: 'community'},
                {mode: 'family', familyGroupId: { $in: user.familyGroups}},
            ];
        }

        let sortOptions = {};
        if(sortBy) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }else if(q) {
            sortOptions = {score :{$meta: 'textScore'}};
        }else {
            sortOptions = {createdAt: -1};
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const entries = await Entry.find(query)
            .select(q ? {score: {$meta: 'textScore'} } : {})
            .populate('userId', 'name profilePicture')
            .populate('familyGroupId','name')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const total = await Entry.countDocuments(query);

        res.json({
            entries,
            total,
            pages: Math.ceil(total / limitNum),
            currentPage: pageNum,
        });
    }catch (error) {
        next(error);
    }
};


// get /api/search/suggestions

const getSearchSuggestions = async (req, res, next) => {
    try{
        const {q} = req.query;

        if(!q || q.length < 2){
            return res.json({suggestion :[]});
        }

        const tagSuggestions = await Entry.aggregate([
            {$unwind: '$tags'},
            {$match: {tags: {$regex: q, $options: 'i'}}},
            {$group: { _id: '$tags', count: {$sum: 1}}},
            {$sort: { count : -1}},
            {$limit: 5},
            {$project: {tage: '$_id', count: 1, _id: 0}},
        ]);

        const titleSuggestions = await Entry.find({
            title: {$regex: q, $options: 'i'},
            $or: [
                { userId: req.user._id},
                {mode :' community'},
            ],
        })
            .select('title')
            .limit(5);

        res.json({
            tags: tagSuggestions.map(t => t.tag),
            titles: titleSuggestions.mao(e => e.title),
        });
    }catch (error) {
        next(error);
    }
};

const getPopularTags = async (req, res, next) => {
    try{
        const popularTags = await Entry.aggregate([
            {$unwind: '$tags'},
            {$group: {_id: '$tags', count: {$sum: 1}}},
            {$sort: { count : -1}},
            {$limit: 20},
            {$project: {tag: '$_id', count: 1, _id: 0}},
        ]);

        res.json(popularTags);
    }catch (error) {
        next(error);
    }
};

module.exports = {
    searchEntries,
    getSearchSuggestions,
    getPopularTags
}