import express from 'express';
import { getAgricultureRecommendations } from '../controller/agricultureController.js';

const router = express.Router();

/**
 * @route   GET /api/agriculture/recommendations
 * @desc    Get agriculture recommendations based on weather data
 * @access  Public
 * @params  lat (number), lon (number) - required
 */
router.get('/recommendations', getAgricultureRecommendations);

export default router;