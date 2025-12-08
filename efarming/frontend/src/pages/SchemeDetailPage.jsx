// src/pages/SchemeDetailPage.jsx - COMPLETE FILE
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Award, 
  User, 
  DollarSign, 
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Share2,
  ExternalLink,
  Edit,
  Trash2,
  Users,
  Clock
} from 'lucide-react';
import { schemeAPI } from '../services/api';
import toast from 'react-hot-toast';

const SchemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedSchemes, setRelatedSchemes] = useState([]);

  useEffect(() => {
    fetchScheme();
  }, [id]);

  const fetchScheme = async () => {
    setLoading(true);
    try {
      const response = await schemeAPI.getById(id);
      if (response.data.success) {
        setScheme(response.data.data);
        
        // Fetch related schemes by category
        if (response.data.data.category) {
          const relatedResponse = await schemeAPI.getByCategory(response.data.data.category);
          if (relatedResponse.data.success) {
            setRelatedSchemes(relatedResponse.data.data.filter(s => s._id !== id).slice(0, 3));
          }
        }
      } else {
        toast.error('Scheme not found');
        navigate('/schemes');
      }
    } catch (error) {
      console.error('Error fetching scheme:', error);
      toast.error('Failed to load scheme');
      navigate('/schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      // Increment click counter
      await schemeAPI.incrementClicks(id);
      // Open official link in new tab
      window.open(scheme.officialLink, '_blank');
      toast.success('Redirecting to official application page');
    } catch (error) {
      console.error('Error counting click:', error);
      window.open(scheme.officialLink, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this scheme?')) return;
    
    try {
      await schemeAPI.deleteScheme(id);
      toast.success('Scheme deleted successfully');
      navigate('/schemes');
    } catch (error) {
      toast.error('Failed to delete scheme');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isExpired = scheme?.lastDate && new Date(scheme.lastDate) < new Date();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Scheme not found</h1>
        <button
          onClick={() => navigate('/schemes')}
          className="btn-primary"
        >
          Back to Schemes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/schemes')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Schemes</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            {scheme.category}
          </span>
          
          {isExpired ? (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Expired
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              Active
            </span>
          )}
          
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {scheme.views || 0} views
          </span>
          
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {scheme.clicks || 0} applications
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {scheme.title}
        </h1>
        
        <p className="text-gray-600 text-lg mb-4">
          {scheme.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(scheme.lastDate)}</span>
          </div>
          
          {scheme.addedBy && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Added by: {scheme.addedBy.name || 'Admin'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Actions */}
      {userType === 'admin' && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <button
            onClick={() => navigate(`/schemes/edit/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Max Benefit</p>
              <p className="text-2xl font-bold text-gray-800">
                {scheme.eligibility?.income?.max 
                  ? `₹${scheme.eligibility.income.max.toLocaleString()}`
                  : 'Varies'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">Eligible For</p>
              <p className="text-2xl font-bold text-gray-800 capitalize">
                {scheme.eligibility?.gender || 'All'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-2xl font-bold text-gray-800">
                {isExpired ? 'Expired' : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="h-6 w-6 text-amber-600" />
          Scheme Benefits
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{scheme.benefits}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Eligibility Criteria */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Eligibility Criteria</h2>
          
          <div className="space-y-4">
            {/* Age */}
            {scheme.eligibility?.age && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Age Limit</h3>
                <div className="flex items-center gap-4 text-gray-600">
                  <span>Minimum: {scheme.eligibility.age.min || 'None'}</span>
                  <span>Maximum: {scheme.eligibility.age.max || 'None'}</span>
                </div>
              </div>
            )}

            {/* Income */}
            {scheme.eligibility?.income && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Income Limit (Annual)</h3>
                <div className="flex items-center gap-4 text-gray-600">
                  <span>Minimum: ₹{scheme.eligibility.income.min?.toLocaleString() || 'None'}</span>
                  <span>Maximum: ₹{scheme.eligibility.income.max?.toLocaleString() || 'None'}</span>
                </div>
              </div>
            )}

            {/* Location */}
            {scheme.eligibility?.state && scheme.eligibility.state.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Eligible States</h3>
                <div className="flex flex-wrap gap-2">
                  {scheme.eligibility.state.map((state, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gender */}
            {scheme.eligibility?.gender && scheme.eligibility.gender !== 'Both' && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Gender</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {scheme.eligibility.gender}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Required Documents */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Required Documents</h2>
          
          {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 ? (
            <div className="space-y-3">
              {scheme.requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No specific documents mentioned.</p>
          )}

          {/* Target Audience */}
          {scheme.targetAudience && scheme.targetAudience.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Target Audience</h3>
              <div className="flex flex-wrap gap-2">
                {scheme.targetAudience.map((audience, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Section */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Apply?</h2>
            <p className="text-gray-600">
              Click the button below to visit the official application portal
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleApply}
              disabled={isExpired}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold ${
                isExpired
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg'
              }`}
            >
              <ExternalLink className="h-5 w-5" />
              {isExpired ? 'Application Closed' : 'Apply Now'}
            </button>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>
        
        {isExpired && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              <span>This scheme has expired. Applications are no longer accepted.</span>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Official Website: <a href={scheme.sourceWebsite} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{scheme.sourceWebsite}</a></p>
        </div>
      </div>

      {/* Tags */}
      {scheme.tags && scheme.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {scheme.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Schemes */}
      {relatedSchemes.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedSchemes.map((related) => {
              const isRelatedExpired = related.lastDate && new Date(related.lastDate) < new Date();
              return (
                <div
                  key={related._id}
                  onClick={() => navigate(`/schemes/${related._id}`)}
                  className="card hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">
                        {related.category}
                      </span>
                      {isRelatedExpired && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          Expired
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {related.description?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {related.views || 0}
                      </span>
                      <span>{formatDate(related.lastDate)}</span>
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

export default SchemeDetailPage;