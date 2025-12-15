import React from 'react';
import { TrendingUp, DollarSign, Calendar, BarChart, Sprout } from 'lucide-react';

const RecommendationCard = ({ recommendation, marketPrices = [], cultivationCosts = [] }) => {
  const getSuitabilityColor = (score) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    const scoreLower = score.toLowerCase();
    if (scoreLower.includes('high')) return 'bg-emerald-100 text-emerald-800';
    if (scoreLower.includes('medium')) return 'bg-amber-100 text-amber-800';
    if (scoreLower.includes('low')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDemandColor = (trend) => {
    if (!trend) return 'bg-gray-100 text-gray-800';
    const trendLower = trend.toLowerCase();
    if (trendLower.includes('high')) return 'bg-emerald-100 text-emerald-800';
    if (trendLower.includes('medium')) return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Safely extract data from API response
  const cropName = recommendation.cropName || 'Unnamed Crop';
  const suitabilityScore = recommendation.suitabilityScore || 'Medium';
  const durationMonths = recommendation.durationMonths || 6;
  const reason = recommendation.reason || 'Recommended based on analysis.';

  // Match market price and demand trend from the shared list
  const priceEntry = marketPrices.find(
    (p) => p.cropName?.toLowerCase() === cropName.toLowerCase()
  );
  const marketPrice = priceEntry?.pricePerKg || 'Market price not available';
  const demandTrend = priceEntry?.demandTrend || 'Medium';

  // Match cultivation cost data
  const costEntry = cultivationCosts.find(
    (c) => c.cropName?.toLowerCase() === cropName.toLowerCase()
  );
  const costPerAcre = costEntry?.costPerAcre || 'Cost estimate not available';

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {cropName}
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuitabilityColor(suitabilityScore)}`}>
                {suitabilityScore} Suitability
              </span>
              
              <div className="flex items-center space-x-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{durationMonths} months</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">{reason}</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Market Price */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span className="font-medium text-gray-700">Market Price</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{marketPrice}</p>
            <p className="text-sm text-gray-600 mt-1">per kg</p>
          </div>

          {/* Demand Trend */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700">Demand Trend</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 capitalize mb-1">
              {demandTrend}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(demandTrend)}`}>
              {demandTrend === 'High' ? 'High Demand' : demandTrend === 'Medium' ? 'Stable' : 'Low Demand'}
            </span>
          </div>

          {/* Cost per Acre */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-700">Cost per Acre</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{costPerAcre}</p>
            <p className="text-sm text-gray-600 mt-1">Estimated</p>
          </div>
        </div>

        {/* Additional details if available */}
        {recommendation.waterRequirements && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Water Requirements</h4>
            <p className="text-gray-600">{recommendation.waterRequirements}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;