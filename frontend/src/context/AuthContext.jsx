import React, { createContext, useState, useEffect, useContext } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axios.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Zira Feature: Idle Timeout (e.g., 10 minutes)
    const onIdle = () => {
        if (user) {
            console.log('User is idle. Auto-logging out (Zira Monitor).');
            logout();
        }
    };

    const { reset } = useIdleTimer({
        onIdle,
        timeout: 10 * 60 * 1000, // 10 minutes
        throttle: 500
    });

    useEffect(() => {
        if (token) {
            // CRITICAL: Clear legacy mock tokens that cause crashes
            if (token === 'mock-jwt-token-for-dev') {
                console.warn("Legacy mock token detected. Clearing session.");
                logout();
                return;
            }

            // HANDLE REAL JWT
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    console.warn("Token expired. Logging out.");
                    logout();
                } else {
                    setUser(decoded);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Invalid Token, logging out:", err);
                logout();
            }
        } else {
            setLoading(false);
        }
    }, [token]);

    const apiCall = async (endpoint, options = {}) => {
        try {
            // Remove leading slash to ensure it correctly appends to the /api prefix in baseURL
            const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

            const config = {
                url: cleanEndpoint,
                method: options.method || 'GET',
                data: options.body ? JSON.parse(options.body) : undefined,
                headers: options.headers || {},
            };
            
            const response = await axiosInstance(config);
            return response.data;
        } catch (err) {

            const errorMessage = err.response?.data?.message || err.message;
            console.error(`API Call Error (${endpoint}):`, errorMessage);
            throw new Error(errorMessage);
        }
    };

    const login = async (email, password, role) => {
        try {
            console.log('AuthContext: Attempting login...', { email, role });

            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, role }),
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user_role', role);
            setToken(data.token);
            setUser(data.user);
            reset(); // Reset idle timer on login
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        setToken(null);
        setUser(null);
        window.location.href = '/'; // Hard redirect to clear any state
    };

    // Helper for components to get auth headers
    const authHeader = () => ({
        'Authorization': `Bearer ${token}`
    });

    return (
        <AuthContext.Provider value={{ user, login, logout, getAuthHeader: authHeader, apiCall, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}


