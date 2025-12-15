import React, { useState, useEffect } from 'react';
import RecommendationCard from '../components/Agriculture/RecommendationCard';
import { MapPin, RefreshCw, Leaf, AlertCircle, Thermometer, Droplets, CloudRain, Sun } from 'lucide-react';
import { agricultureAPI } from '../services/api';
import toast from 'react-hot-toast';

const AgriculturePage = () => {
  const [location, setLocation] = useState({ lat: '28.6139', lon: '77.2090' });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Test backend connection on mount
  useEffect(() => {
    testBackendConnection();
    fetchRecommendations(); // start fetching immediately on page load
  }, []);

  const testBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      const response = await agricultureAPI.testConnection();
      if (response.connected) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
        setError('Backend server not responding');
      }
    } catch (err) {
      setConnectionStatus('disconnected');
      setError('Cannot connect to backend server');
    }
  };

  const fetchRecommendations = async ({ isRetry = false } = {}) => {
    if (!location.lat || !location.lon) {
      toast.error('Please enter both latitude and longitude');
      return;
    }

    setLoading(true);
    if (isRetry) {
      setError(null);
    } else {
      setError(null);
      setRecommendations(null);
    }

    try {
      const response = await agricultureAPI.getRecommendations(location.lat, location.lon);
      
      // Validate API response structure
      if (response.data?.success && response.data.data) {
        setRecommendations(response.data.data);
        toast.success('Recommendations loaded successfully!');
      } else if (response.data?.data) {
        // Some APIs might not include 'success' field
        setRecommendations(response.data.data);
        toast.success('Recommendations loaded!');
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      // Handle different error types
      let errorMessage = 'Failed to fetch recommendations';
      
      if (err.response) {
        // Server responded with error status
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data?.message || 'Invalid location parameters';
            break;
          case 404:
            errorMessage = 'API endpoint not found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          case 502:
          case 503:
            errorMessage = 'Service temporarily unavailable';
            break;
          default:
            errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Other errors
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      // Auto-retry once before surfacing the error
      if (!isRetry) {
        setTimeout(() => fetchRecommendations({ isRetry: true }), 700);
        return;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleLocationChange = (field, value) => {
    setLocation(prev => ({ ...prev, [field]: value }));
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(4),
            lon: position.coords.longitude.toFixed(4)
          });
          toast.dismiss();
          toast.success('Location updated!');
          setTimeout(fetchRecommendations, 500); // Fetch after location update
        },
        (error) => {
          toast.dismiss();
          toast.error('Unable to get your location. Please enter manually.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Agriculture Advisor</h1>
              <p className="text-gray-600 mt-1">Real-time crop recommendations using weather data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              connectionStatus === 'connected' 
                ? 'bg-emerald-100 text-emerald-800'
                : connectionStatus === 'checking'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {connectionStatus === 'connected' ? '🟢 Connected' : 
               connectionStatus === 'checking' ? '🟡 Connecting...' : '🟢 Connected'}
            </div>
          </div>
        </div>
      </div>

      {/* Location Input Card */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl shadow-xl p-6 mb-8 border border-primary-200">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 rounded-lg bg-white shadow">
            <MapPin className="h-5 w-5 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Farm Location</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={location.lat}
              onChange={(e) => handleLocationChange('lat', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              placeholder="e.g., 28.6139"
              min="-90"
              max="90"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={location.lon}
              onChange={(e) => handleLocationChange('lon', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              placeholder="e.g., 77.2090"
              min="-180"
              max="180"
            />
          </div>
          
          <div className="flex flex-col justify-end">
            <div className="flex space-x-3">
              <button
                onClick={handleUseCurrentLocation}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Use My Location
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Leaf className="h-5 w-5" />
                  <span>Get Recommendations</span>
                </>
              )}
            </button>
          </div>
          
          {error && connectionStatus === 'disconnected' && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : recommendations ? (
        <div className="space-y-8">
          {/* Weather Analysis */}
          {recommendations.weatherCondition && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Weather Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.weatherCondition.summary && (
                  <WeatherCard
                    icon={<Sun className="h-8 w-8" />}
                    title="Summary"
                    value={recommendations.weatherCondition.summary}
                    gradient="from-orange-50 to-amber-50"
                    border="border-orange-100"
                  />
                )}
                {recommendations.weatherCondition.temperature && (
                  <WeatherCard
                    icon={<Thermometer className="h-8 w-8" />}
                    title="Temperature"
                    value={recommendations.weatherCondition.temperature}
                    gradient="from-blue-50 to-cyan-50"
                    border="border-blue-100"
                  />
                )}
                {recommendations.weatherCondition.humidity && (
                  <WeatherCard
                    icon={<Droplets className="h-8 w-8" />}
                    title="Humidity"
                    value={recommendations.weatherCondition.humidity}
                    gradient="from-purple-50 to-pink-50"
                    border="border-purple-100"
                  />
                )}
                {recommendations.weatherCondition.suitableFor && (
                  <WeatherCard
                    icon={<Leaf className="h-8 w-8" />}
                    title="Suitable For"
                    value={recommendations.weatherCondition.suitableFor}
                    gradient="from-emerald-50 to-green-50"
                    border="border-emerald-100"
                  />
                )}
              </div>
            </div>
          )}

          {/* Crop Recommendations */}
          {recommendations.recommendedCrops && recommendations.recommendedCrops.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Crops</h2>
              <div className="space-y-6">
                {recommendations.recommendedCrops.map((crop, index) => (
                  <RecommendationCard
                    key={index}
                    recommendation={crop}
                    marketPrices={recommendations.marketPrices || []}
                    cultivationCosts={recommendations.cultivationCost || []}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Crop Recommendations Available</h3>
              <p className="text-gray-600">Try a different location or check back later.</p>
            </div>
          )}

          {/* Market Prices */}
          {recommendations.marketPrices && recommendations.marketPrices.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Market Prices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.marketPrices.map((price, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{price.cropName}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price per kg:</span>
                        <span className="font-bold text-gray-800 text-lg">{price.pricePerKg}</span>
                      </div>
                      {price.demandTrend && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Demand:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            price.demandTrend?.toLowerCase().includes('high') 
                              ? 'bg-emerald-100 text-emerald-800'
                              : price.demandTrend?.toLowerCase().includes('medium')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {price.demandTrend}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Plan */}
          {recommendations.actionPlan && recommendations.actionPlan.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Action Plan</h2>
              <div className="space-y-4">
                {recommendations.actionPlan.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agricultural Tips */}
          {recommendations.agriculturalTips && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Agricultural Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.agriculturalTips.fertilizerRecommendations && (
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Fertilizer Recommendations</h3>
                    <ul className="space-y-2">
                      {recommendations.agriculturalTips.fertilizerRecommendations.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-3 text-gray-700">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendations.agriculturalTips.irrigationInstructions && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Irrigation Instructions</h3>
                    <ul className="space-y-2">
                      {recommendations.agriculturalTips.irrigationInstructions.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-3 text-gray-700">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={fetchRecommendations} />
      ) : connectionStatus === 'connected' ? (
        <EmptyState onGetStarted={fetchRecommendations} />
      ) : (
        <ConnectionError onRetry={testBackendConnection} />
      )}
    </div>
  );
};

// Weather Card Component
const WeatherCard = ({ icon, title, value, gradient, border }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-xl border ${border}`}>
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 rounded-lg bg-white shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Error State Component
const ErrorState = ({ error, onRetry }) => (
  <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
    <div className="mx-auto max-w-md">
      <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">Unable to Load Data</h3>
      <p className="text-gray-600 mb-2">{error}</p>
      <p className="text-sm text-gray-500 mb-8">
        Please check your internet connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onGetStarted }) => (
  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl shadow-lg p-12 text-center border border-primary-200">
    <div className="mx-auto max-w-md">
      <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-lg">
        <Leaf className="h-10 w-10 text-primary-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Get Recommendations</h3>
      <p className="text-gray-600 mb-6">
        Click the button below to get AI-powered crop recommendations for your farm location.
      </p>
      <button
        onClick={onGetStarted}
        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
      >
        Get Recommendations
      </button>
    </div>
  </div>
);

// Connection Error Component
// Connection Error Component - FIXED VERSION
const ConnectionError = ({ onRetry }) => {
  // Get API URL from environment variable or use default
  const apiUrl = import.meta.env.BACKEND_API || 'http://localhost:8000/api';
  const backendUrl = apiUrl.replace('/api', '');
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
      <div className="mx-auto max-w-md">
        <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Cannot Connect to Server</h3>
        <p className="text-gray-600 mb-6">
          Please ensure the backend server is running at: 
        </p>
        <code className="block bg-gray-100 px-4 py-3 rounded-lg mb-6 font-mono text-sm">
          {backendUrl}
        </code>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Troubleshooting Steps:</h4>
          <ol className="text-sm text-gray-600 text-left space-y-1">
            <li>1. Check if backend is running (look for "Server started at port 8000")</li>
            <li>2. Open <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">http://localhost:8000</a> in your browser</li>
            <li>3. Try this API endpoint directly: <a href="http://localhost:8000/api/health" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">http://localhost:8000/api/health</a></li>
            <li>4. Check browser console (F12) for detailed errors</li>
          </ol>
        </div>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold"
        >
          Retry Connection
        </button>
      </div>
    </div>
  )
}

export default AgriculturePage;