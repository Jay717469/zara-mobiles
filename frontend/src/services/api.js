import axios from 'axios';

// Detect if running on a live domain (e.g. Netlify/Vercel) without a custom cloud backend configured
const isLiveWithoutCustomBackend = 
  typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1' && 
  !import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (isLiveWithoutCustomBackend ? '' : 'http://localhost:8080/api'),
  timeout: 3500, // 3.5s timeout prevents hanging on unreachable local ports
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthenticated
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('zm_token');
        localStorage.removeItem('zm_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
