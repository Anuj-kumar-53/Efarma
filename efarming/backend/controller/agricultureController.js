import { agricultureAgent } from '../agent/agent.js';
import WeatherService from '../services/weatherService.js';

const getAgricultureRecommendations = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Valid numbers required'
            });
        }

        console.log("Getting weather for:", latitude, longitude);
        
        // Get weather data
        const weatherService = new WeatherService();
        const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
        
        console.log("Weather data received:", Object.keys(weatherData));

        // Get AI recommendations
        const recommendations = await agricultureAgent({
            weatherJson: weatherData
        });

        console.log("Recommendations generated successfully");
        
        // Always return success with whatever data we have
        res.status(200).json({
            success: true,
            message: 'Recommendations generated successfully',
            data: recommendations
        });
        
    } catch (error) {
        console.error('Controller error:', error.message);
        console.error('Controller error stack:', error.stack);
        
        // Return error but with some data
        res.status(500).json({
            success: false,
            message: 'Error generating recommendations: ' + error.message,
            data: {
                weatherCondition: {
                    summary: "Service error occurred",
                    temperature: "Data unavailable",
                    humidity: "Data unavailable"
                },
                recommendedCrops: [
                    {
                        cropName: "Consult local expert",
                        durationMonths: 0,
                        suitabilityScore: "Medium",
                        reason: "System temporarily unavailable"
                    }
                ]
            }
        });
    }
};

export { getAgricultureRecommendations };
