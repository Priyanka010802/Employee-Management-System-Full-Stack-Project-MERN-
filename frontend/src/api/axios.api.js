import axios from 'axios';

// Priority: 
// 1. Environment variable if set (useful for local dev and CI/CD)
// 2. Automatic localhost detection
// 3. Fallback to production URL
const getBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    // If we're on localhost but no env var, assume backend is local
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:3000';
    }
    return 'https://employees-management-system-full-stack-ahtr.onrender.com';
};

const VITE_API_URL = getBaseUrl();
const CLEAN_BASE_URL = VITE_API_URL.endsWith('/') ? VITE_API_URL.slice(0, -1) : VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `${CLEAN_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Log the final URL being called for easier debugging
        console.log(`Axios Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized! Current session is invalid.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
