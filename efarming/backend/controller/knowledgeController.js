
import KnowledgeHub from '../model/knowledge.js'
import path from 'path'
import fs from 'fs'

// @desc    Get all knowledge items with advanced filtering, sorting and pagination
// @route   GET /api/knowledge
// @access  Public
 export const getAllKnowledgeItems = async (req, res) => {
    try {
        const {
            type,           // 'article' or 'video'
            category,       // specific category
            search,         // search term
            tags,           // filter by tags (comma separated)
            author,         // filter by author
            isPublished,    // true/false (for admin)
            page = 1,
            limit = 12,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        let filter = {};
        
        // For non-admin users, only show published items
        if (!req.isAdmin) {
            filter.isPublished = true;
        }
        
        if (type && ['article', 'video'].includes(type)) {
            filter.mediaType = type;
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (author) {
            filter.author = new RegExp(author, 'i');
        }
        
        if (isPublished && req.isAdmin) {
            filter.isPublished = isPublished === 'true';
        }
        
        if (tags) {
            const tagsArray = tags.split(',').map(tag => tag.trim());
            filter.tags = { $in: tagsArray };
        }
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Sort configuration
        const sortConfig = {};
        const validSortFields = ['title', 'createdAt', 'updatedAt', 'views', 'readTime'];
        const validSortOrders = ['asc', 'desc'];
        
        const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const finalSortOrder = validSortOrders.includes(sortOrder) ? (sortOrder === 'desc' ? -1 : 1) : -1;
        
        sortConfig[finalSortBy] = finalSortOrder;

        // Execute query with pagination
        const items = await KnowledgeHub.find(filter)
            .sort(sortConfig)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        // Get total count for pagination info
        const total = await KnowledgeHub.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: items.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: items
        });
    } catch (error) {
        console.error('Get all knowledge items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get single knowledge item by ID and increment views
// @route   GET /api/knowledge/:id
// @access  Public
 export const getKnowledgeItemById = async (req, res) => {
    try {
        const item = await KnowledgeHub.findById(req.params.id).select('-__v');
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Knowledge item not found'
            });
        }

        // Check if user is not admin and item is not published
        if (!req.isAdmin && !item.isPublished) {
            return res.status(404).json({
                success: false,
                message: 'Knowledge item not found'
            });
        }

        // Increment views count (only for published items)
        if (item.isPublished) {
            await item.incrementViews();
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid knowledge item ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create new knowledge item (article/video)
// @route   POST /api/knowledge
// @access  Private/Admin
 export const createKnowledgeItem = async (req, res) => {
    try {
        const {
            title,
            content,
            mediaType,
            category,
            tags,
            author,
            isPublished = false
        } = req.body;

        // Handle file URLs
        const thumbnailUrl = req.files?.thumbnail?.[0] 
            ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
            : req.body.thumbnailUrl;

        const mediaUrl = req.files?.video?.[0]
            ? `/uploads/videos/${req.files.video[0].filename}`
            : req.body.mediaUrl;

        // Validate required fields for video
        if (mediaType === 'video' && !mediaUrl) {
            return res.status(400).json({
                success: false,
                message: 'Video URL is required for video content'
            });
        }

        // Create knowledge item
        const knowledgeItem = new KnowledgeHub({
            title,
            content,
            mediaType,
            mediaUrl,
            thumbnailUrl: thumbnailUrl || '/uploads/thumbnails/default.jpg',
            category,
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
            author,
            isPublished: Boolean(isPublished)
        });

        const savedItem = await knowledgeItem.save();

        res.status(201).json({
            success: true,
            message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} created successfully`,
            data: savedItem
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Update knowledge item
// @route   PUT /api/knowledge/:id
// @access  Private/Admin
export const updateKnowledgeItem = async (req, res) => {
    try {
        const item = await KnowledgeHub.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Knowledge item not found'
            });
        }

        // Handle file URLs - keep existing if no new file uploaded
        const updateData = { ...req.body };
        
        if (req.files?.thumbnail?.[0]) {
            // Delete old thumbnail if it exists and is not default
            if (item.thumbnailUrl && !item.thumbnailUrl.includes('default.jpg')) {
                const oldThumbnailPath = path.join(__dirname, '..', item.thumbnailUrl);
                if (fs.existsSync(oldThumbnailPath)) {
                    fs.unlinkSync(oldThumbnailPath);
                }
            }
            updateData.thumbnailUrl = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
        }
        
        if (req.files?.video?.[0]) {
            // Delete old video if it exists
            if (item.mediaUrl) {
                const oldVideoPath = path.join(__dirname, '..', item.mediaUrl);
                if (fs.existsSync(oldVideoPath)) {
                    fs.unlinkSync(oldVideoPath);
                }
            }
            updateData.mediaUrl = `/uploads/videos/${req.files.video[0].filename}`;
        }

        // Handle tags array
        if (updateData.tags && typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
        }

        const updatedItem = await KnowledgeHub.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-__v');

        res.status(200).json({
            success: true,
            message: 'Knowledge item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid knowledge item ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Delete knowledge item
// @route   DELETE /api/knowledge/:id
// @access  Private/Admin
export const deleteKnowledgeItem = async (req, res) => {
    try {
        const item = await KnowledgeHub.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Knowledge item not found'
            });
        }

        // Delete associated files
        if (item.thumbnailUrl && !item.thumbnailUrl.includes('default.jpg')) {
            const thumbnailPath = path.join(__dirname, '..', item.thumbnailUrl);
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
        }

        if (item.mediaUrl) {
            const videoPath = path.join(__dirname, '..', item.mediaUrl);
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }

        await KnowledgeHub.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Knowledge item deleted successfully',
            data: {}
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid knowledge item ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get items by category
// @route   GET /api/knowledge/category/:category
// @access  Public
export const getItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const filter = { 
            category, 
            isPublished: true 
        };

        const items = await KnowledgeHub.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await KnowledgeHub.countDocuments(filter);

        res.status(200).json({
            success: true,
            category,
            count: items.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Search knowledge items
// @route   GET /api/knowledge/search/:query
// @access  Public
export const searchKnowledgeItems = async (req, res) => {
    try {
        const { query } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const filter = {
            isPublished: true,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } },
                { author: { $regex: query, $options: 'i' } }
            ]
        };

        const items = await KnowledgeHub.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await KnowledgeHub.countDocuments(filter);

        res.status(200).json({
            success: true,
            searchQuery: query,
            count: items.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get trending knowledge items (most viewed)
// @route   GET /api/knowledge/trending/:limit?
// @access  Public
export const getTrendingItems = async (req, res) => {
    try {
        const limit = parseInt(req.params.limit) || parseInt(req.query.limit) || 10;
        
        const items = await KnowledgeHub.find({ isPublished: true })
            .sort({ views: -1, createdAt: -1 })
            .limit(limit)
            .select('-__v');

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Increment views for a knowledge item
// @route   PATCH /api/knowledge/:id/view
// @access  Public
export const incrementViews = async (req, res) => {
    try {
        const item = await KnowledgeHub.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Knowledge item not found'
            });
        }

        if (!item.isPublished) {
            return res.status(404).json({
                success: false,
                message: 'Knowledge item not found'
            });
        }

        await item.incrementViews();

        res.status(200).json({
            success: true,
            message: 'View count incremented',
            views: item.views + 1
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid knowledge item ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all categories with counts
// @route   GET /api/knowledge/categories/all
// @access  Public
export const getAllCategories = async (req, res) => {
    try {
        const categories = await KnowledgeHub.aggregate([
            { $match: { isPublished: true } },
            { $group: { 
                _id: '$category', 
                count: { $sum: 1 },
                articles: { 
                    $sum: { $cond: [{ $eq: ['$mediaType', 'article'] }, 1, 0] } 
                },
                videos: { 
                    $sum: { $cond: [{ $eq: ['$mediaType', 'video'] }, 1, 0] } 
                }
            }},
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Toggle publish status
// @route   PATCH /api/knowledge/:id/publish
// @access  Private/Admin
export const togglePublishStatus = async (req, res) => {
    try {
        const item = await KnowledgeHub.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Knowledge item not found'
            });
        }

        item.isPublished = !item.isPublished;
        await item.save();

        res.status(200).json({
            success: true,
            message: `Item ${item.isPublished ? 'published' : 'unpublished'} successfully`,
            data: item
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid knowledge item ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get statistics for admin dashboard
// @route   GET /api/knowledge/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const totalItems = await KnowledgeHub.countDocuments();
        const publishedItems = await KnowledgeHub.countDocuments({ isPublished: true });
        const draftItems = await KnowledgeHub.countDocuments({ isPublished: false });
        const totalArticles = await KnowledgeHub.countDocuments({ mediaType: 'article' });
        const totalVideos = await KnowledgeHub.countDocuments({ mediaType: 'video' });
        const totalViews = await KnowledgeHub.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        
        const recentItems = await KnowledgeHub.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title mediaType isPublished createdAt views');

        res.status(200).json({
            success: true,
            data: {
                totalItems,
                publishedItems,
                draftItems,
                totalArticles,
                totalVideos,
                totalViews: totalViews[0]?.totalViews || 0,
                recentItems
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get items by media type
// @route   GET /api/knowledge/type/:mediaType
// @access  Public
export const getItemsByMediaType = async (req, res) => {
    try {
        const { mediaType } = req.params;
        const { page = 1, limit = 12 } = req.query;

        if (!['article', 'video'].includes(mediaType)) {
            return res.status(400).json({
                success: false,
                message: 'Media type must be either "article" or "video"'
            });
        }

        const filter = { 
            mediaType, 
            isPublished: true 
        };

        const items = await KnowledgeHub.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await KnowledgeHub.countDocuments(filter);

        res.status(200).json({
            success: true,
            mediaType,
            count: items.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

