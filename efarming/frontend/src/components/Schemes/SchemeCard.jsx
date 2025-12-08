// src/components/Schemes/SchemeCard.jsx - UPDATED
import React from 'react';
import { Award, Calendar, User, DollarSign, ArrowUpRight, Eye, MapPin } from 'lucide-react';
import { schemeAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SchemeCard = ({ scheme }) => {
  const navigate = useNavigate();
  const isExpired = scheme.lastDate && new Date(scheme.lastDate) < new Date();
  
  const handleApplyClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Call the API to increment clicks
      await schemeAPI.incrementClicks(scheme._id);
      // Open the official link in new tab
      window.open(scheme.officialLink, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error incrementing clicks:', error);
      // Still open the link even if click counter fails
      window.open(scheme.officialLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    navigate(`/schemes/${scheme._id}`);
  };

  return (
    <div 
      className="card hover:shadow-xl transition-all duration-300 group cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-600">{scheme.category}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-200">
              {scheme.title}
            </h3>
          </div>
          {isExpired ? (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Expired
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              Active
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-3">
          {scheme.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {scheme.lastDate ? `Until ${new Date(scheme.lastDate).toLocaleDateString()}` : 'No deadline'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {scheme.views || 0} views
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Benefits</span>
              </div>
              {scheme.eligibility?.income && (
                <span className="text-sm text-gray-600">
                  Up to ₹{scheme.eligibility.income.max?.toLocaleString() || 'Varies'}
                </span>
              )}
            </div>
            
            <button
              onClick={handleApplyClick}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium p-2 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              <span>Apply Now</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {scheme.tags && scheme.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {scheme.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeCard;