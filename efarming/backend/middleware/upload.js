import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Base upload folders (relative to project root)
const UPLOADS_FOLDER = 'uploads';
const THUMBNAILS_FOLDER = path.join(UPLOADS_FOLDER, 'thumbnails');
const VIDEOS_FOLDER = path.join(UPLOADS_FOLDER, 'videos');

// Create folders if they don't exist
[UPLOADS_FOLDER, THUMBNAILS_FOLDER, VIDEOS_FOLDER].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`✅ Created folder: ${folder}`);
    }
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'thumbnail') {
            cb(null, THUMBNAILS_FOLDER);
        } else if (file.fieldname === 'video') {
            cb(null, VIDEOS_FOLDER);
        } else {
            cb(new Error(`Unexpected field name: ${file.fieldname}`), false);
        }
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-random-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueSuffix + '-' + originalName);
    }
});

// File filter - strict validation
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
        // Only allow specific image types
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, JPG, PNG, WebP, and GIF images are allowed for thumbnails!'), false);
        }
    } else if (file.fieldname === 'video') {
        // Only allow specific video types
        const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
        if (allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only MP4, MPEG, MOV, AVI, and WebM videos are allowed!'), false);
        }
    } else {
        cb(new Error(`Unexpected field name: ${file.fieldname}`), false);
    }
};

// File size limits (different for thumbnails and videos)
const limits = {
    fileSize: 100 * 1024 * 1024 // 100MB max for all files (good for videos)
};

// Create multer instance
const upload = multer({
    storage,
    fileFilter,
    limits
});

// Error handling middleware for multer
export const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 100MB.'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field. Only "thumbnail" and "video" fields are allowed.'
            });
        }
    }
    
    if (err) {
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        });
    }
    
    next();
};

export { upload };