import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Interceptor para agregar el token JWT a cada solicitud
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar errores no autorizados (e.g. token expirado)
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 403) {
        // opcional: cerrar sesión o refrescar el token
        console.error('Session expired or unauthorized');
    }
    return Promise.reject(error);
});

export default api;
