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
<<<<<<< HEAD
            const response = await api.post('/auth/login', { email, password });

            // Backend returns { token, user: { ... } }
            const { token, user } = response.data;

            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            console.error('Login failed full error:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
            return { success: false, error: error.response?.data?.error || 'Error al iniciar sesión' };
=======
            const response = await api.post('/auth/authenticate', { email, password });
            // la respuesta tipica contiene { token, user } or just { token }
            // si el backend no retorna info del user, podemos necesitar un endpoint separado
            // por ahora, vamos a asumir que retorna { token, user: { name, email, role } }
            // o basado en la mayoría de las implementaciones de JWT, podría solo retornar { token }
            // ajustaré based on standard JWT response patterns seen in the backend code

            const { token, ...data } = response.data;
            const userData = {
                ...data,
                name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email
            };

            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' };
>>>>>>> origin/master
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
<<<<<<< HEAD
            const { token, user } = response.data;

            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            console.error('Registration failed', error);
            return { success: false, error: error.response?.data?.error || 'Error al registrarse' };
=======
            const { token, ...data } = response.data;
            const registeredUser = {
                ...data,
                name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email
            };

            setUser(registeredUser);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(registeredUser));
            return { success: true };
        } catch (error) {
            console.error('Registration failed', error);
            return { success: false, error: error.response?.data?.message || 'Error al registrarse' };
>>>>>>> origin/master
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};


