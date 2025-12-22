import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import router from './routes/adminRoute.js';
import schemeRouter from './routes/schemeRoute.js';
import knowledgeRouter from './routes/knowledgeHubRouter.js';
import weatherRoutes from './routes/weatherRoutes.js';
import agricultureRoutes from "./routes/agricultureRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({});

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: "https://efarming-dun.vercel.app",    // your React frontend
  credentials: true,                  // allow cookies/auth
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Set proper headers for media files
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    
    // Cache control for media files (1 day cache for images/videos)
    const ext = path.extname(filePath).toLowerCase();
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm', '.avi', '.mov'];
    
    if (mediaExtensions.includes(ext)) {
      res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    }
    
    // Set proper MIME types for video files
    if (ext === '.mp4') {
      res.set('Content-Type', 'video/mp4');
    } else if (ext === '.webm') {
      res.set('Content-Type', 'video/webm');
    } else if (ext === '.avi') {
      res.set('Content-Type', 'video/x-msvideo');
    } else if (ext === '.mov') {
      res.set('Content-Type', 'video/quicktime');
    }
  }
}));

// API Routes
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/scheme', schemeRouter);
app.use('/api/weather', weatherRoutes);
app.use('/api/agriculture', agricultureRoutes);
app.use('/api', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uploadsPath: path.join(__dirname, 'uploads')
  });
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

connectDB();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
  console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`Static files served at: http://localhost:${port}/uploads/`);
});