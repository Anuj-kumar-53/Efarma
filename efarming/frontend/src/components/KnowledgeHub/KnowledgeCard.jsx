// src/components/KnowledgeHub/KnowledgeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, PlayCircle, FileText, ChevronRight } from 'lucide-react';

const KnowledgeCard = ({ item }) => {
    const isVideo = item.mediaType === 'video';

    const handleClick = (e) => {
        console.log('Card clicked:', item._id);
        console.log('Item data:', item);
        console.log('Routing to:', `/knowledge/${item._id}`);

        // Check if Link is working
        if (!item._id) {
            e.preventDefault();
            console.error('Item ID is missing!');
            alert('Cannot open: Item ID is missing');
        }
    };

    return (
        <Link onClick={handleClick} to={`/knowledge/${item._id}`} className="card group hover:shadow-xl transition-all duration-300">
            <div className="relative overflow-hidden rounded-t-2xl">
                <img
                    src={item.thumbnailUrl
                        ? `http://localhost:8000${item.thumbnailUrl}`
                        : '/default-thumbnail.jpg'
                    }
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${isVideo
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {isVideo ? 'Video' : 'Article'}
                    </div>
                </div>
                <div className="absolute top-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        {item.category}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{item.readTime || 5} min read</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">{item.views || 0} views</span>
                        </div>
                    </div>
                    <div className={`p-2 rounded-lg ${isVideo
                            ? 'bg-red-50 text-red-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                        {isVideo ? (
                            <PlayCircle className="h-5 w-5" />
                        ) : (
                            <FileText className="h-5 w-5" />
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                    {item.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.content?.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {item.author || 'Unknown'}</span>
                    <div className="flex items-center space-x-2 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-sm font-medium">Read more</span>
                        <ChevronRight className="h-4 w-4" />
                    </div>
                </div>

                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {item.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default KnowledgeCard;