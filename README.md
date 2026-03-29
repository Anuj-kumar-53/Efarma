🌱 E-Farmer: Smart Agriculture Assistance Platform

E-Farmer is a modern full-stack web application designed to empower farmers with intelligent, data-driven agricultural insights. It leverages AI to provide personalized crop recommendations, cost estimation, and cultivation planning, helping farmers make informed decisions and improve productivity.

🚀 Live Demo

Experience E-Farmer live:
👉 https://efarming-dun.vercel.app/

👉 GitHub Repository:
[https://github.com/Anuj-kumar-53/Efarma](https://github.com/Anuj-kumar-53/Efarma)

🌟 Features
🌾 AI-Powered Crop Recommendation
Personalized crop suggestions based on user inputs (soil type, location, season)
AI-driven insights using Google Gemini API
Supports recommendations for 20+ crops
💰 Cost Estimation & Planning
Provides detailed cost breakdown for crop cultivation
Helps farmers plan budget and resources efficiently
Suggests optimized farming strategies

🌍 Government Schemes Integration
Displays relevant government schemes and subsidies for farmers
Helps users easily discover financial support programs and benefits
Simplifies access to agricultural policies and initiatives

🌦️ Weather Forecast Integration
Real-time weather data using Weather API
Provides temperature, rainfall, and seasonal insights
Helps farmers make better decisions for sowing, irrigation, and harvesting

📊 Smart Dashboard
User-friendly dashboard to manage agricultural data
Displays recommendations, inputs, and results clearly
Interactive UI for better decision-making

🔐 Authentication System
Secure login and signup functionality
JWT-based authentication
Protected routes for user-specific data

🎨 Modern UI/UX
Fully responsive design (mobile + desktop)
Clean and intuitive interface using Tailwind CSS
Smooth transitions and interactive components

🛠️ Tech Stack
Frontend
React.js – Component-based UI development
Vite – Fast build tool
Tailwind CSS – Modern utility-first styling
Axios – API communication
React Router DOM – Routing
Backend
Node.js – Runtime environment
Express.js – Backend framework
MongoDB with Mongoose – Database
JWT – Authentication
Google Gemini API – AI-powered recommendations
Tools & Libraries
ESLint – Code linting
Nodemon – Development server automation
🚀 Installation
Prerequisites
Node.js (v18+)
MongoDB (local or cloud)
Google Gemini API key
⚙️ Setup Instructions

Clone the repository

git clone https://github.com/Anuj-kumar-53/Efarma.git
cd Efarma

Install dependencies

Frontend:

cd client
npm install
cd ..

Backend:

cd server
npm install
cd ..

Environment Variables

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

Run the application

Backend:

cd server
npm start

Frontend:

cd client
npm run dev

Open in browser:

http://localhost:5173
📖 Usage
🌱 How to Use
Login / Signup
Create an account or log in securely
Enter Farming Details
Provide inputs like soil type, season, and location
Get AI Recommendations
Receive crop suggestions and farming insights
Analyze Results
View cost estimation and cultivation strategies
🔌 API Overview
Authentication
POST /api/auth/register – Register user
POST /api/auth/login – Login user
Crop Recommendation
POST /api/recommend
Input: Soil, location, season
Output: Recommended crops + insights


🤝 Contributing

Contributions are welcome!

Fork the repo
Create a branch
Make changes
Submit a PR

🙏 Acknowledgments
Built to support smart agriculture and digital farming
Inspired by real-world farming challenges
Powered by modern web technologies and AI

🎯 Future Enhancements
Crop disease detection using image processing 📸
Multilingual support for farmers 🌍
Mobile app version 📱

🎉 Final Note

Empowering farmers with technology — making agriculture smarter, efficient, and data-driven.
