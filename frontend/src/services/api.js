import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Interceptor para agregar el token JWT a cada solicitud
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        console.log('API Request: sending token', token.substring(0, 15) + '...');
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('API Request: No token found in localStorage');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar errores no autorizados (e.g. token expirado)
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 403) {
        console.error('--- 403 FORBIDDEN DEBUG ---');
        console.error('URL:', error.config?.url);
        console.error('Method:', error.config?.method);
        console.error('Request Data:', error.config?.data);
        console.error('Response Status:', error.response?.status);
        console.error('Response Data:', error.response?.data);
        const authHeader = error.config?.headers?.Authorization || error.config?.headers?.authorization;
        console.error('Has Authorization Header:', !!authHeader);
        if (authHeader) console.error('Auth Header Start:', authHeader.substring(0, 15) + '...');
    }
    return Promise.reject(error);
});

export default api;
