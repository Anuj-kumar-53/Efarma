import express from 'express';
import { getCurrentWeather, getWeatherForecast } from '../controller/weatherController.js';

const router = express.Router();

/**
 * @route   GET /api/weather/current
 * @desc    Get current weather data for specific coordinates
 * @access  Public
 * @params  lat (number), lon (number) - required
 */
router.get('/current', getCurrentWeather);

/**
 * @route   GET /api/weather/forecast
 * @desc    Get 7-day weather forecast for specific coordinates
 * @access  Public
 * @params  lat (number), lon (number) - required
 */
router.get('/forecast', getWeatherForecast);

export default router;