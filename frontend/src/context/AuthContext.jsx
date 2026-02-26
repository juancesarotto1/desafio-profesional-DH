import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext.context.js';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // chequea local storage por si hay session existente
        const initAuth = () => {
            try {
                const savedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');
                if (savedUser && token) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (err) {
                console.error('Failed to restore session:', err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Enviando login requst a /api/auth/login para:', email);
            const response = await api.post('/auth/login', { email, password });

            console.log('Login response status:', response.status);
            console.log('Login response total data:', response.data);

            // Backend returns { token, user: { ... } } or { jwt, usuario: { ... } } or just { token, ...userData }
            console.log('Login Raw Data:', response.data);
            const { token, jwt, accessToken, user: userData, usuario } = response.data;
            const finalToken = token || jwt || accessToken;

            // Si el objeto 'user' no está presente, tal vez los datos estén en la raíz (ej: login/{email})
            const rawUser = userData || usuario || (response.data.email ? response.data : null);

            // Normalizar el usuario para que la UI tenga campos consistentes
            const normalizedUser = rawUser ? {
                ...rawUser,
                id: rawUser.id || rawUser.userId || rawUser.idUsuario || rawUser.iduser,
                name: rawUser.name || rawUser.nombre || rawUser.firstName || rawUser.email?.split('@')[0] || 'Usuario',
                role: (rawUser.role?.name || rawUser.role || 'USER').toUpperCase()
            } : null;

            console.log('Extracted Token:', finalToken ? 'Yes' : 'No');
            console.log('Normalized User:', JSON.stringify(normalizedUser, null, 2));

            setUser(normalizedUser);
            localStorage.setItem('token', finalToken || '');
            localStorage.setItem('user', JSON.stringify(normalizedUser || {}));
            return { success: true };
        } catch (error) {
            console.error('Login failed full error details:', error);
            let errorMessage = 'Error al iniciar sesión';

            if (error.response) {
                console.error('Backend Error Response:', error.response.data);
                errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
            } else if (error.request) {
                console.error('No response received from backend:', error.request);
                errorMessage = 'No se puede contactar al servidor';
            }

            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const register = async (userData) => {
        try {
            console.log('Original userData received in register:', userData);

            // Mapeo exhaustivo para cubrir cualquier convención del backend (Hibernate/JPA)
            const payload = {
                // Variaciones de Nombre
                name: userData.firstName,
                nombre: userData.firstName,
                firstName: userData.firstName,
                firstname: userData.firstName,

                // Variaciones de Apellido
                lastName: userData.lastName,
                apellido: userData.lastName,
                lastname: userData.lastName,
                last_name: userData.lastName,
                apellidos: userData.lastName,
                surname: userData.lastName,

                // Variaciones de Email
                email: userData.email,
                correo: userData.email,
                correo_electronico: userData.email,
                'correo electrónico': userData.email,

                // Variaciones de Contraseña
                password: userData.password,
                contraseña: userData.password,
                password_hash: userData.password
            };

            console.log('Enviando registro con payload:', payload);
            const response = await api.post('/auth/register', payload);
            console.log('Registro exitoso, respuesta:', response.data);

            const { token, jwt, accessToken, user } = response.data;
            const finalToken = token || jwt || accessToken;

            // Normalizar el usuario registrado
            const normalizedUser = user ? {
                ...user,
                name: user.name || user.nombre || user.firstName || user.email?.split('@')[0] || 'Usuario',
                role: (user.role?.name || user.role || 'USER').toUpperCase()
            } : null;

            setUser(normalizedUser);
            localStorage.setItem('token', finalToken || '');
            localStorage.setItem('user', JSON.stringify(normalizedUser || {}));
            return { success: true };
        } catch (error) {
            console.error('Registration failed full error details:', error);
            let errorMessage = 'Error al registrarse';

            if (error.response) {
                console.error('Backend Registration Error Response:', error.response.data);
                errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
            }
            return { success: false, error: errorMessage };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};


