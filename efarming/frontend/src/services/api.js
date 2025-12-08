import axios from 'axios';

// IMPORTANT: Backend is running on port 8000, not 5000 or 3000
const API_BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increase timeout to 30 seconds
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`📡 API Base URL: ${API_BASE_URL}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });
    
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Network Error: Backend is not accessible');
      console.error(`Please ensure backend is running on ${API_BASE_URL.replace('/api', '')}`);
      
      // Show user-friendly message
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('network-error', {
          detail: { 
            message: `Cannot connect to server. Please ensure backend is running on ${API_BASE_URL.replace('/api', '')}` 
          }
        });
        window.dispatchEvent(event);
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log(`Testing connection to: ${API_BASE_URL}/health`);
    const response = await api.get('/health');
    return {
      connected: true,
      message: 'Backend connected successfully',
      data: response.data
    };
  } catch (error) {
    return {
      connected: false,
      message: `Cannot connect to backend at ${API_BASE_URL}: ${error.message}`,
      error: error.code
    };
  }
};

// Update your environment variables in .env file for frontend:
// VITE_API_URL=http://localhost:8000/api

// Auth Services
export const authAPI = {
  adminLogin: (credentials) => api.post('/admin/login', credentials),
  adminLogout: () => api.post('/admin/logout'),
  farmerSignup: (data) => api.post('/signup', data),
  farmerLogin: (credentials) => api.post('/signin', credentials),
};

// Weather Services
export const weatherAPI = {
  getCurrentWeather: (lat, lon) => 
    api.get('/weather/current', { 
      params: { 
        lat: parseFloat(lat), 
        lon: parseFloat(lon) 
      } 
    }),
  getWeatherForecast: (lat, lon) => 
    api.get('/weather/forecast', { 
      params: { 
        lat: parseFloat(lat), 
        lon: parseFloat(lon) 
      } 
    }),
};

// Agriculture Services
export const agricultureAPI = {
  // Get recommendations based on location
  getRecommendations: async (lat, lon) => {
    try {
      console.log(`Fetching recommendations for lat: ${lat}, lon: ${lon}`);
      const response = await api.get('/agriculture/recommendations', {
        params: { lat, lon }
      });
      
      console.log('Agriculture API Response:', response.data);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('No response data received from server');
      }
      
      return response;
    } catch (error) {
      console.error('Agriculture API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Re-throw the error to be handled by the component
      throw error;
    }
  },

  // Test connection to backend
  testConnection: async () => {
    try {
      console.log(`Testing connection to agriculture endpoint...`);
      const response = await api.get('/health');
      console.log('Connection test response:', response.data);
      return { connected: true, data: response.data };
    } catch (error) {
      console.error('Connection test failed:', error.message);
      return { 
        connected: false, 
        error: error.message,
        details: `Cannot connect to ${API_BASE_URL}`
      };
    }
  }
};

// Knowledge Hub Services
export const knowledgeAPI = {
  getAll: (params) => api.get('/knowledge', { params }),
  getById: async (id, retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await api.get(`/knowledge/${id}`);
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  },
  getByCategory: (category, params) => 
    api.get(`/knowledge/category/${category}`, { params }),
  getTrending: (limit) => 
    api.get('/knowledge/trending', { params: { limit } }),
  search: (query) => api.get(`/knowledge/search/${query}`),
  getCategories: () => api.get('/knowledge/categories/all'),
  incrementViews: (id) => api.patch(`/knowledge/${id}/view`),
  
  // Admin routes
  createItem: (data) => {
    if (data instanceof FormData) {
      return api.post('/knowledge', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/knowledge', data);
  },
  updateItem: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/knowledge/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/knowledge/${id}`, data);
  },
  deleteItem: (id) => api.delete(`/knowledge/${id}`),
  togglePublish: (id) => api.patch(`/knowledge/${id}/publish`),
  getAdminStats: () => api.get('/knowledge/admin/stats'),
};

// Scheme Services
export const schemeAPI = {
  getAll: (params) => api.get('/scheme/all', { params }),
  getById: async (id, retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await api.get(`/scheme/${id}`);
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  },
  getPopular: () => api.get('/scheme/popular'),
  getByCategory: (category) => api.get(`/scheme/category/${category}`),
  search: (query) => api.get('/scheme/search', { params: { q: query } }),
  incrementClicks: (id) => api.post(`/scheme/${id}/click`),
  
  // Admin routes
  createScheme: (data) => api.post('/scheme/create', data),
  updateScheme: (id, data) => api.put(`/scheme/update/${id}`, data),
  deleteScheme: (id) => api.delete(`/scheme/delete/${id}`),
  getAnalytics: () => api.get('/scheme/analytics/popular'),
};

// Dashboard Services
export const dashboardAPI = {
  getStats: () => api.post('/admin/dashboard'),
  getAdminStats: () => api.post('/admin/dashboard'),
  getAdminAnalytics: () => api.get('/admin/analytics'),
};

export default api;