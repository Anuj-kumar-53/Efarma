// src/App.jsx - COMPLETE VERSION WITH ALL IMPORTS
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Public Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// User Pages
import Dashboard from './pages/Dashboard';
import WeatherPage from './pages/WeatherPage';
import AgriculturePage from './pages/AgriculturePage';
import KnowledgeHubPage from './pages/KnowledgeHubPage';
import SchemesPage from './pages/SchemesPage';

// Detail Pages
import KnowledgeDetailPage from './pages/KnowledgeDetailPage'; // Add this import
import SchemeDetailPage from './pages/SchemeDetailPage'; // Add this import

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateKnowledgePage from './pages/admin/CreateKnowledgePage';
import CreateSchemePage from './pages/admin/CreateSchemePage';
import EditKnowledgePage from './pages/admin/EditKnowledgePage';
import EditSchemePage from './pages/admin/EditSchemePage';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && userType !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow section-padding">
              <div className="container-custom">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  
                  {/* Private Routes - All Users */}
                  <Route path="/" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/weather" element={
                    <PrivateRoute>
                      <WeatherPage />
                    </PrivateRoute>
                  } />
                  <Route path="/agriculture" element={
                    <PrivateRoute>
                      <AgriculturePage />
                    </PrivateRoute>
                  } />
                  <Route path="/knowledge" element={
                    <PrivateRoute>
                      <KnowledgeHubPage />
                    </PrivateRoute>
                  } />
                  <Route path="/knowledge/:id" element={
                    <PrivateRoute>
                      <KnowledgeDetailPage />
                    </PrivateRoute>
                  } />
                  <Route path="/schemes" element={
                    <PrivateRoute>
                      <SchemesPage />
                    </PrivateRoute>
                  } />
                  <Route path="/schemes/:id" element={
                    <PrivateRoute>
                      <SchemeDetailPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <PrivateRoute adminOnly>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/knowledge/create" element={
                    <PrivateRoute adminOnly>
                      <CreateKnowledgePage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/knowledge/edit/:id" element={
                    <PrivateRoute adminOnly>
                      <EditKnowledgePage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/schemes/create" element={
                    <PrivateRoute adminOnly>
                      <CreateSchemePage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/schemes/edit/:id" element={
                    <PrivateRoute adminOnly>
                      <EditSchemePage />
                    </PrivateRoute>
                  } />
                  
                  {/* Redirect unknown routes */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '16px',
                },
              }}
            />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;