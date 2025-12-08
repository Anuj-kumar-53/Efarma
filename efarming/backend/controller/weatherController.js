import WeatherService from '../services/weatherService.js';

const weatherService = new WeatherService();

const getCurrentWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Latitude (lat) and longitude (lon) are required query parameters'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude must be valid numbers'
            });
        }

        const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
        
        res.status(200).json({
            success: true,
            message: 'Current weather data retrieved successfully',
            data: weatherData
        });
    } catch (error) {
        console.error('Weather Controller Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

const getWeatherForecast = async (req, res) => {
    try {
        const { lat, lon, days = 7 } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Latitude (lat) and longitude (lon) are required query parameters'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude must be valid numbers'
            });
        }

        const forecastData = await weatherService.getWeatherForecast(latitude, longitude);
        
        res.status(200).json({
            success: true,
            message: 'Weather forecast retrieved successfully',
            data: forecastData
        });
    } catch (error) {
        console.error('Forecast Controller Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export {
    getCurrentWeather,
    getWeatherForecast
};