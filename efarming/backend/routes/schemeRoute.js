import express from 'express'
import { adminMiddleWare } from '../middleware/adminMiddleWare.js';
import { getAllSchemes,getSchemeById,createScheme,updateScheme,deleteScheme,incrementClicks,getPopularSchemes,getSchemesByCategory,searchSchemes,getSchemeAnalytics } from '../controller/schemeController.js';

const schemeRouter = express.Router();

//Scheme routes....
schemeRouter.get('/all', getAllSchemes);
schemeRouter.get('/popular', getPopularSchemes);
schemeRouter.get('/search', searchSchemes);
schemeRouter.get('/category/:category', getSchemesByCategory);
schemeRouter.get('/:id', getSchemeById);
schemeRouter.post('/:id/click', incrementClicks);

//admin procted routes
schemeRouter.post('/create', adminMiddleWare, createScheme);
schemeRouter.put('/update/:id', adminMiddleWare, updateScheme);
schemeRouter.delete('/delete/:id', adminMiddleWare, deleteScheme);
schemeRouter.get('/analytics/popular', adminMiddleWare, getSchemeAnalytics);

export default schemeRouter;


