// src/pages/KnowledgeHubPage.jsx - COMPLETE FIXED VERSION
import React, { useState, useEffect } from 'react';
import KnowledgeCard from '../components/KnowledgeHub/KnowledgeCard';
import { 
  BookOpen as BookIcon, 
  FileText, 
  PlayCircle, 
  Eye, 
  Clock, 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  X 
} from 'lucide-react';
import { knowledgeAPI, testBackendConnection } from '../services/api';

const KnowledgeHubPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  const categoriesList = [
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
  ];

  useEffect(() => {
    // Test backend connection first
    const testConnection = async () => {
      const status = await testBackendConnection();
      setBackendStatus(status.connected ? 'connected' : 'disconnected');
      console.log('Backend connection status:', status);
    };
    
    testConnection();
    fetchKnowledgeItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory || searchQuery) {
      fetchKnowledgeItems();
    }
  }, [selectedCategory, searchQuery]);

  const fetchKnowledgeItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const response = await knowledgeAPI.getAll(params);
      
      // FIXED: Properly check response structure
      if (response && response.data && response.data.data) {
        setItems(response.data.data);
        
        // Cache items for detail page
        localStorage.setItem('knowledgeItems', JSON.stringify(response.data.data));
      } else {
        console.warn('Unexpected API response structure:', response);
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching knowledge items:', error);
      setItems([]);
      
      // Try to load from cache if API fails
      try {
        const cachedItems = localStorage.getItem('knowledgeItems');
        if (cachedItems) {
          const parsedItems = JSON.parse(cachedItems);
          // Filter cached items if category/search is applied
          const filteredItems = parsedItems.filter(item => {
            const matchesCategory = !selectedCategory || item.category === selectedCategory;
            const matchesSearch = !searchQuery || 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.content.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
          });
          setItems(filteredItems);
        }
      } catch (cacheError) {
        console.error('Failed to load from cache:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await knowledgeAPI.getCategories();
      if (response && response.data && response.data.data) {
        setCategories(response.data.data);
      } else {
        console.warn('Unexpected categories response:', response);
        setCategories(categoriesList);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use default categories if API fails
      setCategories(categoriesList);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchKnowledgeItems();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
  };

  const renderConnectionStatus = () => {
    if (backendStatus === 'checking') {
      return (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
          🔍 Checking backend connection...
        </div>
      );
    }
    
    if (backendStatus === 'disconnected') {
      return (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
          ⚠️ Backend connection issue. Some features may not work properly.
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="animate-fade-in">
      {renderConnectionStatus()}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <BookIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Knowledge Hub</h1>
        </div>
        <p className="text-gray-600">Learn from expert articles, tutorials, and farming guides</p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, videos, and guides..."
                className="input-field pl-12"
              />
            </div>
          </form>

          {/* Filter Button - Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {showFilters ? <X className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {/* View Toggle - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {(showFilters || window.innerWidth >= 768) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Categories */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === ''
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {categoriesList.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-800">
                {items.filter(i => i.mediaType === 'article').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold text-gray-800">
                {items.filter(i => i.mediaType === 'video').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <PlayCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-800">
                {items.reduce((sum, item) => sum + (item.views || 0), 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50">
              <Eye className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {items.map((item) => (
            <KnowledgeCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No content found</h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory || searchQuery 
                ? 'Try changing your filters or search term'
                : 'No content available at the moment'}
            </p>
            {(selectedCategory || searchQuery) && (
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trending Section */}
      {!selectedCategory && !searchQuery && items.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Now</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.slice(0, 2).map((item) => (
              <div key={item._id} className="card overflow-hidden group">
                <div className="md:flex">
                  <div className="md:w-1/3 relative">
                    <img
                      src={`http://localhost:8000${item.thumbnailUrl}` || '/default-thumbnail.jpg'}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.mediaType === 'video' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.mediaType === 'video' ? 'Video' : 'Article'}
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.content?.substring(0, 200)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{item.readTime || 5} min</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">{item.views || 0} views</span>
                        </div>
                      </div>
                      <span className="text-primary-600 font-medium">Read more →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeHubPage;