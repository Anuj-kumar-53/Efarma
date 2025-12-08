// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  Award,
  Video,
  File
} from 'lucide-react';
import { knowledgeAPI, schemeAPI, dashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalArticles: 0,
    totalVideos: 0,
    totalSchemes: 0,
    publishedItems: 0,
    draftItems: 0
  });
  const [analytics, setAnalytics] = useState({
    contentDistribution: { byCategory: [], byMediaType: [] },
    topSchemes: [],
    monthlyFarmerGrowth: []
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentSchemes, setRecentSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setLoadingAnalytics(true);
    try {
      // Fetch dashboard stats
      const statsResponse = await dashboardAPI.getAdminStats();
      const apiStats = statsResponse.data?.data?.stats;
      if (statsResponse.data?.success && apiStats) {
        setStats({
          totalFarmers: apiStats.totalFarmers ?? 0,
          totalArticles: apiStats.totalArticles ?? 0,
          totalVideos: apiStats.totalVideos ?? 0,
          totalSchemes: apiStats.totalSchemes ?? 0,
          publishedItems: apiStats.publishedItems ?? 0,
          draftItems: apiStats.draftItems ?? 0,
        });
      }

      // Fetch analytics
      const analyticsResponse = await dashboardAPI.getAdminAnalytics();
      if (analyticsResponse.data?.success) {
        setAnalytics({
          contentDistribution: analyticsResponse.data.data.contentDistribution || { byCategory: [], byMediaType: [] },
          topSchemes: analyticsResponse.data.data.topSchemes || [],
          monthlyFarmerGrowth: analyticsResponse.data.data.monthlyFarmerGrowth || []
        });
      }

      // Fetch recent knowledge items
      const knowledgeResponse = await knowledgeAPI.getAll({
        page: 1,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (knowledgeResponse.data?.success) {
        setRecentItems(knowledgeResponse.data.data || []);
      }

      // Fetch recent schemes
      const schemesResponse = await schemeAPI.getAll({
        page: 1,
        limit: 5
      });
      
      if (schemesResponse.data?.success) {
        setRecentSchemes(schemesResponse.data.data || []);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
      setLoadingAnalytics(false);
    }
  };

  const handleDeleteItem = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      if (type === 'knowledge') {
        await knowledgeAPI.deleteItem(id);
        toast.success('Item deleted successfully');
        setRecentItems(items => items.filter(item => item._id !== id));
      } else if (type === 'scheme') {
        await schemeAPI.deleteScheme(id);
        toast.success('Scheme deleted successfully');
        setRecentSchemes(schemes => schemes.filter(scheme => scheme._id !== id));
      }
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await knowledgeAPI.togglePublish(id);
      toast.success(`Item ${currentStatus ? 'unpublished' : 'published'} successfully`);
      
      // Update local state
      setRecentItems(items => 
        items.map(item => 
          item._id === id 
            ? { ...item, isPublished: !currentStatus } 
            : item
        )
      );
    } catch (error) {
      toast.error('Failed to update publish status');
    }
  };

  const statCards = [
    {
      title: 'Total Farmers',
      value: stats.totalFarmers,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: BookOpen,
      color: 'from-emerald-500 to-green-500',
      change: '+8%'
    },
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      icon: Video,
      color: 'from-red-500 to-pink-500',
      change: '+15%'
    },
    {
      title: 'Active Schemes',
      value: stats.totalSchemes,
      icon: Award,
      color: 'from-amber-500 to-orange-500',
      change: '+5%'
    },
    {
      title: 'Published Items',
      value: stats.publishedItems,
      icon: CheckCircle,
      color: 'from-purple-500 to-indigo-500',
      change: '+10%'
    },
    {
      title: 'Draft Items',
      value: stats.draftItems,
      icon: File,
      color: 'from-gray-500 to-gray-600',
      change: '+3%'
    }
  ];

  const pieColors = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#f43f5e', '#14b8a6', '#eab308', '#6366f1'];
  const barColor = '#3b82f6';
  const lineColor = '#16a34a';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.email || 'Admin'} 👋
            </h1>
            <p className="text-primary-100">
              Admin Dashboard - Manage your eFarmer platform
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Calendar className="h-5 w-5" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <a 
          href="/knowledge/create" 
          className="card p-6 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-primary-600">
                Add Content
              </h3>
              <p className="text-sm text-gray-600">Create articles or videos</p>
            </div>
          </div>
        </a>

        <a 
          href="/schemes/create" 
          className="card p-6 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-secondary-600">
                Add Scheme
              </h3>
              <p className="text-sm text-gray-600">Create government schemes</p>
            </div>
          </div>
        </a>

        <button 
          type="button"
          onClick={() => setShowAnalytics(true)}
          className="card p-6 hover:shadow-xl transition-all duration-300 group text-left w-full"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-purple-600">
                View Analytics
              </h3>
              <p className="text-sm text-gray-600">Platform statistics</p>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      {!showAnalytics && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {loading ? '...' : stat.value}
                </h3>
                <p className="text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Back to Dashboard when in analytics */}
      {showAnalytics && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAnalytics(false)}
            className="btn-primary px-4 py-2"
          >
            ← Back to dashboard
          </button>
        </div>
      )}

      {/* Analytics Section */}
      {showAnalytics && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart - Content Distribution */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Content Distribution</h2>
            <span className="text-sm text-gray-500">Articles & Videos by category</span>
          </div>
          <div className="p-6 h-80">
            {loadingAnalytics ? (
              <div className="h-full flex items-center justify-center text-gray-500">Loading chart...</div>
            ) : analytics.contentDistribution.byCategory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">No content data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.contentDistribution.byCategory}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={4}
                    label
                  >
                    {analytics.contentDistribution.byCategory.map((entry, idx) => (
                      <Cell key={entry.category} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart - Most Viewed Schemes */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Most Viewed Schemes</h2>
            <span className="text-sm text-gray-500">Top 5 by views</span>
          </div>
          <div className="p-6 h-80">
            {loadingAnalytics ? (
              <div className="h-full flex items-center justify-center text-gray-500">Loading chart...</div>
            ) : analytics.topSchemes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">No scheme data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topSchemes} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={70} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="views" fill={barColor} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Line Chart - Farmer Growth */}
      {showAnalytics && (
      <div className="card mb-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Monthly Farmer Growth</h2>
          <span className="text-sm text-gray-500">Last 6 months</span>
        </div>
        <div className="p-6 h-80">
          {loadingAnalytics ? (
            <div className="h-full flex items-center justify-center text-gray-500">Loading chart...</div>
          ) : analytics.monthlyFarmerGrowth.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">No farmer signup data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthlyFarmerGrowth} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={lineColor} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      )}

      {/* Recent Content */}
      {!showAnalytics && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Knowledge Items */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Recent Content</h2>
              <a 
                href="/knowledge" 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all →
              </a>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : recentItems.length > 0 ? (
              recentItems.map((item) => (
                <div key={item._id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-800">{item.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.isPublished 
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.mediaType}</span>
                        <span>•</span>
                        <span>{item.views || 0} views</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleTogglePublish(item._id, item.isPublished)}
                        className={`p-2 rounded-lg ${
                          item.isPublished 
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                        }`}
                        title={item.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {item.isPublished ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                      
                      <a
                        href={`/knowledge/${item._id}`}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      
                      <a
                        href={`/knowledge/edit/${item._id}`}
                        className="p-2 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </a>
                      
                      <button
                        onClick={() => handleDeleteItem(item._id, 'knowledge')}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No content available
              </div>
            )}
          </div>
        </div>

        {/* Recent Schemes */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Recent Schemes</h2>
              <a 
                href="/schemes" 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all →
              </a>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : recentSchemes.length > 0 ? (
              recentSchemes.map((scheme) => (
                <div key={scheme._id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">{scheme.title}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{scheme.category}</span>
                        <span>•</span>
                        <span>{scheme.views || 0} views</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          scheme.isActive 
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {scheme.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <a
                        href={`/schemes/${scheme._id}`}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      
                      <a
                        href={`/schemes/edit/${scheme._id}`}
                        className="p-2 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </a>
                      
                      <button
                        onClick={() => handleDeleteItem(scheme._id, 'scheme')}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No schemes available
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminDashboard;