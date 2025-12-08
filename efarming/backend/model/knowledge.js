import mongoose from 'mongoose';

const knowledgeHubSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },

    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },

    mediaType: {
        type: String,
        required: [true, 'Media type is required'],
        enum: ['article', 'video']
    },

    mediaUrl: {
        type: String,
        trim: true,
        default: '',
        validate: {
            validator: function (value) {
                if (this.mediaType === 'video') {
                    return value && value.length > 0;
                }
                return true;
            },
            message: 'Video URL is required for mediaType = video'
        }
    },

    thumbnailUrl: {
        type: String,
        required: [true, 'Thumbnail is required for both articles and videos'],
        trim: true
    },

    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: [
            'Crop Cultivation', 
            'Soil Health', 
            'Irrigation', 
            'Crop Protection', 
            'Animal Husbandry', 
            'Financial Planning', 
            'Government Schemes', 
            'Technology',
            'Organic Farming',
            'Other'
        ]
    },

    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (tags) {
                return tags.length <= 10;
            },
            message: 'Cannot have more than 10 tags'
        }
    },

    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true,
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },

    readTime: {
        type: Number,
        default: 0,
        min: [0, 'Read time cannot be negative']
    },

    isPublished: {
        type: Boolean,
        default: false
    },

    views: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

// AUTO READ TIME (ONLY FOR ARTICLES)
knowledgeHubSchema.pre('save', function (next) {
    if (this.mediaType === 'article') {
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.max(1, Math.ceil(wordCount / 200));
    } else {
        this.readTime = 0;
    }
    next();
});

// INDEXES
knowledgeHubSchema.index({ mediaType: 1, category: 1, isPublished: 1 });
knowledgeHubSchema.index({ title: 'text', content: 'text', tags: 'text' });

// STATIC METHODS
knowledgeHubSchema.statics.getPublishedItems = function () {
    return this.find({ isPublished: true }).sort({ createdAt: -1 });
};

knowledgeHubSchema.statics.getByCategory = function (category) {
    return this.find({ category, isPublished: true }).sort({ createdAt: -1 });
};

knowledgeHubSchema.statics.searchItems = function (searchTerm) {
    return this.find({
        isPublished: true,
        $text: { $search: searchTerm }
    }).sort({ score: { $meta: "textScore" } });
};

knowledgeHubSchema.statics.getTrending = function (limit = 10) {
    return this.find({ isPublished: true })
        .sort({ views: -1, createdAt: -1 })
        .limit(limit);
};

// INSTANCE METHODS
knowledgeHubSchema.methods.isArticle = function () {
    return this.mediaType === 'article';
};

knowledgeHubSchema.methods.isVideo = function () {
    return this.mediaType === 'video';
};

knowledgeHubSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

export default mongoose.model('KnowledgeHub', knowledgeHubSchema);