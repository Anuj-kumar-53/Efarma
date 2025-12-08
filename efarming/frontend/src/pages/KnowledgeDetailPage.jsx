// src/pages/KnowledgeDetailPage.jsx - CORRECTED VERSION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Clock, 
  User, 
  Tag, 
  PlayCircle,
  FileText,
  Edit,
  Trash2,
  Share2,
  Bookmark,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { knowledgeAPI, testBackendConnection} from '../services/api';
import toast from 'react-hot-toast';

const KnowledgeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [mediaError, setMediaError] = useState(false);

  // Ensure API_BASE_URL is defined (usually from your api.js)
  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    console.log('🚀 KnowledgeDetailPage mounted with ID:', id);
    
    const testConnection = async () => {
      const status = await testBackendConnection();
      setBackendStatus(status.connected ? 'connected' : 'disconnected');
    };
    
    testConnection();
    fetchItem();
  }, [id]);

  // Helper function to construct proper media URLs
  const getMediaUrl = (url) => {
    if (!url) return null;
    
    // If URL already has http:// or https://, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If URL starts with /, prepend base URL
    if (url.startsWith('/')) {
      return `${BASE_URL}${url}`;
    }
    
    // Otherwise, assume it's a relative path from uploads
    return `${BASE_URL}/uploads/${url}`;
  };

  const fetchItem = async () => {
    if (!id) {
      toast.error('Invalid item ID');
      navigate('/knowledge');
      return;
    }

    setLoading(true);
    setMediaError(false);
    
    try {
      const cachedItem = sessionStorage.getItem(`knowledge_${id}`);
      if (cachedItem) {
        const parsedItem = JSON.parse(cachedItem);
        setItem(parsedItem);
        setLoading(false);
        fetchFreshData(id);
        return;
      }

      const response = await knowledgeAPI.getById(id);
      
      if (response.data?.success && response.data.data) {
        const itemData = response.data.data;
        
        // Process tags - handle array format issue
        if (itemData.tags && itemData.tags.length > 0) {
          itemData.tags = itemData.tags.map(tag => {
            if (Array.isArray(tag)) return tag[0] || tag;
            if (typeof tag === 'string' && tag.startsWith('["') && tag.endsWith('"]')) {
              try {
                const parsed = JSON.parse(tag);
                return Array.isArray(parsed) ? parsed[0] : tag;
              } catch {
                return tag;
              }
            }
            return tag;
          });
        }
        
        sessionStorage.setItem(`knowledge_${id}`, JSON.stringify(itemData));
        setItem(itemData);
        
        // Increment views
        try {
          await knowledgeAPI.incrementViews(id);
        } catch (viewError) {
          console.warn('⚠️ Could not increment views:', viewError.message);
        }
        
        // Fetch related items
        if (itemData.category) {
          fetchRelatedItems(itemData.category, id);
        }
      } else {
        toast.error('Item not found or invalid data received');
        navigate('/knowledge');
      }
    } catch (error) {
      console.error('❌ Error fetching item:', error);
      
      // Try localStorage cache
      const allCachedItems = JSON.parse(localStorage.getItem('knowledgeItems') || '[]');
      const cachedItem = allCachedItems.find(item => item._id === id);
      
      if (cachedItem) {
        setItem(cachedItem);
        toast.warning('Showing cached content. Network connection issue.');
      } else {
        toast.error('Failed to load item. Please try again.');
        navigate('/knowledge');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFreshData = async (itemId) => {
    try {
      const response = await knowledgeAPI.getById(itemId);
      if (response.data?.success && response.data.data) {
        const freshData = response.data.data;
        setItem(freshData);
        sessionStorage.setItem(`knowledge_${itemId}`, JSON.stringify(freshData));
      }
    } catch (error) {
      console.warn('⚠️ Background refresh failed:', error.message);
    }
  };

  const fetchRelatedItems = async (category, currentId) => {
    try {
      const response = await knowledgeAPI.getByCategory(category, { limit: 3 });
      if (response.data?.success) {
        const filtered = response.data.data.filter(item => item._id !== currentId);
        setRelatedItems(filtered);
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch related items:', error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await knowledgeAPI.deleteItem(id);
      toast.success('Item deleted successfully');
      
      sessionStorage.removeItem(`knowledge_${id}`);
      const cachedItems = JSON.parse(localStorage.getItem('knowledgeItems') || '[]');
      const updatedItems = cachedItems.filter(item => item._id !== id);
      localStorage.setItem('knowledgeItems', JSON.stringify(updatedItems));
      
      navigate('/knowledge');
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleMediaError = (e) => {
    console.error('Media loading error:', e);
    setMediaError(true);
    toast.error('Failed to load media. Please check the file URL.');
  };

  const renderConnectionStatus = () => {
    if (backendStatus === 'checking') {
      return (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2 text-blue-700 text-sm animate-pulse">
          <div className="h-3 w-3 bg-blue-400 rounded-full animate-pulse"></div>
          Checking backend connection...
        </div>
      );
    }
    
    if (backendStatus === 'disconnected') {
      return (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          Backend connection issue. Showing cached content if available.
        </div>
      );
    }
    
    return (
      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-emerald-700 text-sm">
        <CheckCircle className="h-4 w-4" />
        Connected to backend server
      </div>
    );
  };

  const renderMedia = () => {
    if (!item) return null;
    
    const isVideo = item.mediaType === 'video';
    const mediaUrl = getMediaUrl(item.mediaUrl);
    const thumbnailUrl = getMediaUrl(item.thumbnailUrl);

    console.log('Media Debug:', {
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl,
      fullMediaUrl: mediaUrl,
      thumbnailUrl: item.thumbnailUrl,
      fullThumbnailUrl: thumbnailUrl
    });

    if (!mediaUrl && !thumbnailUrl) {
      return (
        <div className="w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center p-8">
            {isVideo ? (
              <Video className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            ) : (
              <ImageIcon className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            )}
            <p className="text-gray-500 text-lg mb-2">No media available</p>
            <p className="text-gray-400 text-sm">Upload a {isVideo ? 'video' : 'image'} to display here</p>
          </div>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl">
          <div className="aspect-video w-full">
            <video
              key={mediaUrl} // Force re-render on URL change
              src={mediaUrl}
              controls
              controlsList="nodownload"
              className="w-full h-full object-contain"
              poster={thumbnailUrl}
              onError={handleMediaError}
              preload="metadata"
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          {/* Video overlay play button (hidden when playing) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
              <PlayCircle className="h-20 w-20 text-white/90" />
            </div>
          </div>
          
          {mediaError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="text-center p-8 max-w-md">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                <p className="text-white text-xl font-semibold mb-3">Video failed to load</p>
                <p className="text-gray-300 mb-6">
                  The video file could not be loaded. Please check the URL or try again later.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Open video directly
                  </a>
                  <button
                    onClick={() => setMediaError(false)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // For articles, show thumbnail if available
    return (
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        {thumbnailUrl ? (
          <div className="relative group">
            <img
              key={thumbnailUrl}
              src={thumbnailUrl}
              alt={item.title}
              className="w-full h-auto max-h-[600px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
              onError={handleMediaError}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </div>
        ) : (
          <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
            <FileText className="h-24 w-24 text-blue-300" />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        {renderConnectionStatus()}
        <div className="animate-pulse space-y-6">
          {/* Back button skeleton */}
          <div className="h-12 w-40 bg-gray-200 rounded-xl"></div>
          
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-12 w-3/4 bg-gray-200 rounded-xl"></div>
            <div className="flex gap-4">
              <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          {/* Media skeleton */}
          <div className="h-[500px] bg-gray-200 rounded-3xl"></div>
          
          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-6xl mx-auto px-4 text-center py-20">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-lg mx-auto shadow-xl">
          <AlertCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Item not found</h1>
          <p className="text-gray-600 mb-8">The knowledge item you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/knowledge')}
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Knowledge Hub
          </button>
        </div>
      </div>
    );
  }

  const downloadUrl = getMediaUrl(item.mediaUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {renderConnectionStatus()}
      
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/knowledge')}
          className="group inline-flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
          <span className="font-medium text-gray-700 group-hover:text-gray-900">Back to Knowledge Hub</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="p-8 pb-0">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-4 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
              item.mediaType === 'video' 
                ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-100 shadow-sm' 
                : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-100 shadow-sm'
            }`}>
              {item.mediaType === 'video' ? (
                <>
                  <Video className="h-4 w-4" />
                  Video Tutorial
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Article
                </>
              )}
            </span>
            
            <span className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200 rounded-full text-sm font-medium shadow-sm">
              {item.category}
            </span>
            
            {userType === 'admin' && (
              <span className={`px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm ${
                item.isPublished 
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-100' 
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200'
              }`}>
                {item.isPublished ? '✓ Published' : 'Draft'}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {item.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
              <User className="h-4 w-4" />
              <span className="font-medium">{item.author}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
              <Calendar className="h-4 w-4" />
              <span>{new Date(item.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
              <Eye className="h-4 w-4" />
              <span className="font-medium">{item.views || 0} views</span>
            </div>
            
            {item.mediaType !== 'video' && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                <Clock className="h-4 w-4" />
                <span>{item.readTime || 5} min read</span>
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        {userType === 'admin' && (
          <div className="px-8 pt-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <button
                onClick={() => navigate(`/knowledge/edit/${id}`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <Edit className="h-5 w-5" />
                Edit Content
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Media Section */}
        <div className="p-8 pt-6">
          {renderMedia()}
          
          {mediaError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Media failed to load. Please check if the file exists at: {getMediaUrl(item.mediaUrl || item.thumbnailUrl)}
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="px-8 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Tag className="h-5 w-5" />
                <span className="font-medium">Tags:</span>
              </div>
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-default"
                >
                  #{typeof tag === 'string' ? tag.replace(/[\[\]"]/g, '') : tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="px-8 pb-8">
          {item.mediaType === 'video' ? (
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <Video className="h-20 w-20 text-primary-500 mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Video Content</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Watch the video above for detailed instructions and visual guidance.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={downloadUrl}
                    download
                    className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Download className="h-5 w-5" />
                    Download Video
                  </a>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Open in New Tab
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg space-y-6">
                  {item.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow font-medium"
                >
                  <Share2 className="h-5 w-5" />
                  Share Content
                </button>
                <button className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow font-medium">
                  <Bookmark className="h-5 w-5" />
                  Save for Later
                </button>
              </div>
              
              <div className="text-gray-500 text-sm">
                <span className="font-medium">Last updated:</span> {new Date(item.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Content */}
      {relatedItems.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Related Content</h2>
            <button
              onClick={() => navigate(`/knowledge?category=${item.category}`)}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 group"
            >
              View all in {item.category}
              <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedItems.map((related) => {
              const relatedThumbnailUrl = getMediaUrl(related.thumbnailUrl);
              
              return (
                <div
                  key={related._id}
                  onClick={() => navigate(`/knowledge/${related._id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary-300 hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="h-48 overflow-hidden relative">
                    {relatedThumbnailUrl ? (
                      <img
                        src={relatedThumbnailUrl}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center ${
                              related.mediaType === 'video' 
                                ? 'bg-gradient-to-br from-red-50 to-pink-50' 
                                : 'bg-gradient-to-br from-blue-50 to-cyan-50'
                            }">
                              ${related.mediaType === 'video' 
                                ? '<svg class="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                                : '<svg class="h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
                              }
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        related.mediaType === 'video' 
                          ? 'bg-gradient-to-br from-red-50 to-pink-50' 
                          : 'bg-gradient-to-br from-blue-50 to-cyan-50'
                      }`}>
                        {related.mediaType === 'video' ? (
                          <Video className="h-12 w-12 text-red-400" />
                        ) : (
                          <FileText className="h-12 w-12 text-blue-400" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        related.mediaType === 'video' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {related.mediaType === 'video' ? 'Video' : 'Article'}
                      </span>
                      <span className="text-sm text-gray-500">{related.category}</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors text-lg">
                      {related.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {related.content?.substring(0, 120)}...
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span>{related.readTime || 5} min read</span>
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        <span>{related.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeDetailPage;