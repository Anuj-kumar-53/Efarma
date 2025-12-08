import express from 'express'
import { adminLogin, logout  } from "../controller/adminController.js";
import { adminDashboard, adminAnalytics } from '../controller/adminDashboard.js';
import { adminMiddleWare } from '../middleware/adminMiddleWare.js';

//farmer
import { signupFarmer, loginFarmer } from '../controller/farmerController.js';



const router = express.Router();

router.post('/admin/login',adminLogin);
router.post('/admin/logout',adminMiddleWare,logout);
// router.post('/profile',adminMiddleWare, profile);
router.post('/admin/dashboard',adminMiddleWare,adminDashboard);
router.get('/admin/analytics',adminMiddleWare,adminAnalytics);



//farmer Routes...
router.post('/signup',signupFarmer);
router.post('/signin',loginFarmer);



export default router;