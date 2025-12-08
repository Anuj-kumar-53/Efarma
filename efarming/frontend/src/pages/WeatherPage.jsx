// src/pages/WeatherPage.jsx
import React, { useState } from 'react';
import WeatherCard from '../components/Weather/WeatherCard';
import ForecastChart from '../components/Weather/ForecastChart';
import { Search, MapPin, RefreshCw,  ChevronRight } from 'lucide-react';
import { weatherAPI } from '../services/api';

const WeatherPage = () => {
    const [location, setLocation] = useState({ lat: '28.6139', lon: '77.2090' });
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // src/pages/WeatherPage.jsx - Update fetchWeather function
    const fetchWeather = async () => {
        if (!location.lat || !location.lon) {
            setError('Please enter both latitude and longitude');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [current, forecast] = await Promise.all([
                weatherAPI.getCurrentWeather(location.lat, location.lon),
                weatherAPI.getWeatherForecast(location.lat, location.lon)
            ]);

            if (current.data.success && forecast.data.success) {
                setWeatherData(current.data.data);
                setForecastData(forecast.data.data);
            } else {
                setError('Failed to fetch weather data');
            }
        } catch (err) {
            console.error('Weather API error:', err);

            // Show user-friendly error message
            if (err.response?.status === 400) {
                setError('Invalid coordinates. Please check your input.');
            } else if (err.response?.status === 404) {
                setError('Weather service unavailable for this location.');
            } else if (err.code === 'ERR_NETWORK') {
                setError('Cannot connect to the server. Make sure backend is running on port 5000.');
            } else {
                setError('Failed to fetch weather data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeather();
    };

    // Default to Delhi coordinates on mount
    React.useEffect(() => {
        fetchWeather();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Weather Intelligence</h1>
                <p className="text-gray-600">Real-time weather data and forecasts for your location</p>
            </div>

            {/* Search Form */}
            <div className="card p-6 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="h-5 w-5 text-primary-600" />
                        <h2 className="text-xl font-semibold text-gray-800">Enter Location Coordinates</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Latitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={location.lat}
                                onChange={(e) => setLocation(prev => ({ ...prev, lat: e.target.value }))}
                                className="input-field"
                                placeholder="e.g., 28.6139"
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
                                onChange={(e) => setLocation(prev => ({ ...prev, lon: e.target.value }))}
                                className="input-field"
                                placeholder="e.g., 77.2090"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center space-x-2"
                        >
                            {loading ? (
                                <RefreshCw className="h-5 w-5 animate-spin" />
                            ) : (
                                <Search className="h-5 w-5" />
                            )}
                            <span>{loading ? 'Fetching...' : 'Get Weather'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={fetchWeather}
                            className="btn-outline flex items-center space-x-2"
                        >
                            <RefreshCw className="h-5 w-5" />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                            {error}
                        </div>
                    )}
                </form>
            </div>

            {/* Weather Display */}
            {loading ? (
                <div className="space-y-8">
                    <div className="card p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-6"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : weatherData ? (
                <div className="space-y-8">
                    <WeatherCard weatherData={weatherData} />

                    {forecastData && (
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">7-Day Forecast</h2>
                            <ForecastChart data={forecastData.forecast} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Weather Tips</h2>
                            <div className="space-y-3">
                                {[
                                    'Ideal time for sowing: Morning hours',
                                    'Water requirements: Moderate irrigation needed',
                                    'Pest alert: Monitor for fungal infections',
                                    'Harvest timing: Plan for dry weather periods'
                                ].map((tip, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="h-2 w-2 rounded-full bg-primary-500 mt-2"></div>
                                        <span className="text-gray-700">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-800">Get Agriculture Advice</p>
                                            <p className="text-sm text-gray-600">Based on current weather</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </button>

                                <button className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-800">View Crop Calendar</p>
                                            <p className="text-sm text-gray-600">Seasonal planning guide</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default WeatherPage;