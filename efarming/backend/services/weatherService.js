import axios from 'axios';
import WEATHER_CONFIG from '../config/weatherConfig.js';

class WeatherService {
    async getCurrentWeather(latitude, longitude) {
        try {
            const response = await axios.get(
                `${WEATHER_CONFIG.BASE_URL}${WEATHER_CONFIG.ENDPOINTS.CURRENT}`,
                {
                    params: {
                        latitude: latitude,
                        longitude: longitude,
                        current_weather: true,
                        daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                        temperature_unit: 'celsius',
                        windspeed_unit: 'kmh',
                        timezone: 'auto'
                    }
                }
            );
            return this.formatCurrentWeather(response.data, latitude, longitude);
        } catch (error) {
            console.error('Weather API Error:', error.message);
            throw new Error('Failed to fetch weather data');
        }
    }

    async getWeatherForecast(latitude, longitude) {
        try {
            const response = await axios.get(
                `${WEATHER_CONFIG.BASE_URL}${WEATHER_CONFIG.ENDPOINTS.FORECAST}`,
                {
                    params: {
                        latitude: latitude,
                        longitude: longitude,
                        hourly: 'temperature_2m,relativehumidity_2m,weathercode,windspeed_10m,precipitation_probability',
                        daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
                        temperature_unit: 'celsius',
                        windspeed_unit: 'kmh',
                        timezone: 'auto',
                        forecast_days: 7
                    }
                }
            );
            return this.formatForecastData(response.data);
        } catch (error) {
            console.error('Forecast API Error:', error.message);
            throw new Error('Failed to fetch weather forecast');
        }
    }

    formatCurrentWeather(data, lat, lon) {
        const current = data.current_weather;
        const daily = data.daily;
        
        return {
            location: { latitude: lat, longitude: lon },
            current: {
                temperature: Math.round(current.temperature),
                windspeed: current.windspeed,
                weathercode: current.weathercode,
                description: this.getWeatherDescription(current.weathercode),
                isDay: current.is_day === 1,
                time: new Date(current.time)
            },
            today: {
                maxTemp: Math.round(daily.temperature_2m_max[0]),
                minTemp: Math.round(daily.temperature_2m_min[0]),
                precipitationChance: daily.precipitation_probability_max[0],
                description: this.getWeatherDescription(daily.weathercode[0])
            }
        };
    }

    formatForecastData(data) {
        const forecast = [];
        
        for (let i = 0; i < data.daily.time.length; i++) {
            forecast.push({
                date: new Date(data.daily.time[i]),
                maxTemp: Math.round(data.daily.temperature_2m_max[i]),
                minTemp: Math.round(data.daily.temperature_2m_min[i]),
                weathercode: data.daily.weathercode[i],
                description: this.getWeatherDescription(data.daily.weathercode[i]),
                precipitationChance: data.daily.precipitation_probability_max[i],
                sunrise: new Date(data.daily.sunrise[i]),
                sunset: new Date(data.daily.sunset[i])
            });
        }

        return {
            location: {
                latitude: data.latitude,
                longitude: data.longitude
            },
            forecast: forecast
        };
    }

    getWeatherDescription(weathercode) {
        const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light freezing drizzle',
            57: 'Dense freezing drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Light freezing rain',
            67: 'Heavy freezing rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };
        return weatherCodes[weathercode] || 'Unknown weather condition';
    }
}

export default WeatherService;