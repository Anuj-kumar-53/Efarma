// src/pages/SchemesPage.jsx
import React, { useState, useEffect } from 'react';
import SchemeCard from '../components/Schemes/SchemeCard';
import { Search, Filter, Award, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { schemeAPI } from '../services/api';

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [popularSchemes, setPopularSchemes] = useState([]);

  const categories = [
    'Education',
    'Health',
    'Farmer',
    'Women',
    'Housing',
    'Agriculture',
    'Livestock',
    'Irrigation',
    'Subsidy',
    'Loan',
    'Insurance'
  ];

  useEffect(() => {
    fetchSchemes();
    fetchPopularSchemes();
  }, [selectedCategory]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.q = searchQuery;
      
      const response = await schemeAPI.getAll(params);
      setSchemes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularSchemes = async () => {
    try {
      const response = await schemeAPI.getPopular();
      setPopularSchemes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching popular schemes:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    fetchSchemes();
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600">
            <Award className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Government Schemes</h1>
        </div>
        <p className="text-gray-600">Find and apply for government schemes and subsidies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Schemes</p>
              <p className="text-2xl font-bold text-gray-800">{schemes.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Popular</p>
              <p className="text-2xl font-bold text-gray-800">
                {popularSchemes[0]?.views || '0'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-800">3</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Max Benefit</p>
              <p className="text-2xl font-bold text-gray-800">₹2.5L</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for schemes, subsidies, or benefits..."
                  className="input-field pl-12"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Search Schemes
            </button>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Schemes
              </button>
              {categories.map((category) => (
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

          {(selectedCategory || searchQuery) && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {schemes.length} scheme{schemes.length !== 1 ? 's' : ''}
                {selectedCategory && ` in ${selectedCategory}`}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schemes List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : schemes.length > 0 ? (
            <div className="space-y-6">
              {schemes.map((scheme) => (
                <SchemeCard key={scheme._id} scheme={scheme} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="mx-auto max-w-md">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No schemes found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory || searchQuery 
                    ? 'Try changing your filters or search term'
                    : 'No schemes available at the moment'}
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Schemes */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              <span>Most Popular</span>
            </h3>
            <div className="space-y-4">
              {popularSchemes.slice(0, 3).map((scheme, index) => (
                <div key={scheme._id} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{scheme.title}</h4>
                      <p className="text-xs text-gray-500">{scheme.views} views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guide */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Apply</h3>
            <div className="space-y-3">
              {[
                'Check eligibility criteria',
                'Gather required documents',
                'Visit official website',
                'Fill application form',
                'Submit with documents',
                'Track application status'
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Tips</h3>
            <div className="space-y-3">
              {[
                'Apply well before deadline',
                'Keep digital copies ready',
                'Verify all details twice',
                'Save application number',
                'Follow up regularly'
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemesPage;