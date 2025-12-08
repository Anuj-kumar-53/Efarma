import express from 'express';
const knowledgeRouter = express.Router();

import {
    getAllKnowledgeItems,
    getKnowledgeItemById,
    createKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    getItemsByCategory,
    searchKnowledgeItems,
    getTrendingItems,
    incrementViews,
    getAllCategories,
    togglePublishStatus,
    getAdminStats,
    getItemsByMediaType
} from '../controller/knowledgeController.js'

import { adminMiddleWare } from '../middleware/adminMiddleWare.js';
import { upload, handleUploadErrors } from '../middleware/upload.js';

// -------------------------------------------
// ✅ PUBLIC ROUTES (No Authentication Needed)
// -------------------------------------------

// Get categories with item counts
knowledgeRouter.get('/categories/all', getAllCategories);

// Trending items
knowledgeRouter.get('/trending/:limit', getTrendingItems);
knowledgeRouter.get('/trending', getTrendingItems);

// Get items by media type (article/video)
knowledgeRouter.get('/type/:mediaType', getItemsByMediaType);

// Get items by category
knowledgeRouter.get('/category/:category', getItemsByCategory);

// Search items
knowledgeRouter.get('/search/:query', searchKnowledgeItems);

// Get ALL items (with pagination + filtering)
knowledgeRouter.get('/', getAllKnowledgeItems);

// Increment view count
knowledgeRouter.patch('/:id/view', incrementViews);

// Get single item by ID (must be LAST public route)
knowledgeRouter.get('/:id', getKnowledgeItemById);


// -------------------------------------------
// 🔐 ADMIN ROUTES (Require Admin Authentication)
// -------------------------------------------

// Middleware to set isAdmin flag for controllers
const setAdminFlag = (req, res, next) => {
    req.isAdmin = true;
    next();
};

// Create new knowledge item
knowledgeRouter.post(
    '/',
    adminMiddleWare,
    setAdminFlag,
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]),
    handleUploadErrors,
    createKnowledgeItem
);

// Update existing knowledge item
knowledgeRouter.put(
    '/:id',
    adminMiddleWare,
    setAdminFlag,
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]),
    handleUploadErrors,
    updateKnowledgeItem
);

// Delete item
knowledgeRouter.delete(
    '/:id',
    adminMiddleWare,
    setAdminFlag,
    deleteKnowledgeItem
);

// Toggle published/unpublished
knowledgeRouter.patch(
    '/:id/publish',
    adminMiddleWare,
    setAdminFlag,
    togglePublishStatus
);

// Admin dashboard stats
knowledgeRouter.get(
    '/admin/stats',
    adminMiddleWare,
    setAdminFlag,
    getAdminStats
);


// ------------------------------------------------
// 📘 API DOCUMENTATION (Public)
// ------------------------------------------------
knowledgeRouter.get('/help/docs', (req, res) => {
    res.json({
        message: '📚 eFarmar Knowledge Hub API Documentation',
        version: '1.0.0',
        endpoints: {
            public: {
                'GET /api/knowledge': 'Get all items with filtering & pagination',
                'GET /api/knowledge/categories/all': 'Get all categories with counts',
                'GET /api/knowledge/trending/:limit?': 'Get trending items (limit optional)',
                'GET /api/knowledge/type/:mediaType': 'Get items by type (article/video)',
                'GET /api/knowledge/category/:category': 'Get items by category',
                'GET /api/knowledge/search/:query': 'Search items',
                'PATCH /api/knowledge/:id/view': 'Increment view count',
                'GET /api/knowledge/:id': 'Get single item by ID'
            },
            admin: {
                'POST /api/knowledge': 'Create new item (with file upload)',
                'PUT /api/knowledge/:id': 'Update item (with file upload)',
                'DELETE /api/knowledge/:id': 'Delete item',
                'PATCH /api/knowledge/:id/publish': 'Publish/unpublish item',
                'GET /api/knowledge/admin/stats': 'Get admin dashboard statistics'
            },
            queryParameters: {
                'page': 'Page number (default: 1)',
                'limit': 'Items per page (default: 12)',
                'type': 'Filter by media type (article/video)',
                'category': 'Filter by category',
                'search': 'Search term',
                'tags': 'Filter by tags (comma separated)',
                'author': 'Filter by author',
                'sortBy': 'Sort field (title, createdAt, views, readTime)',
                'sortOrder': 'Sort order (asc/desc)'
            }
        }
    });
});

export default knowledgeRouter;