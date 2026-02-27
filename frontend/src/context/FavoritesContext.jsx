import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { FavoritesContext } from './FavoritesContext.context.js';

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState(() => {
        if (user) {
            try {
                const saved = localStorage.getItem(`favs_${user.email || 'guest'}`);
                return saved ? JSON.parse(saved) : [];
            } catch (error) {
                console.error('Error parsing favorites:', error);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        if (!user) {
            setFavorites([]);
            return;
        }
        const saved = localStorage.getItem(`favs_${user.email || 'guest'}`);
        try {
            const parsed = saved ? JSON.parse(saved) : [];
            setFavorites(parsed);
        } catch (e) {
            console.error('Error parsing favs in effect', e);
            setFavorites([]);
        }
    }, [user?.email]); // re-run solo cuando el email del user cambia

    const toggleFavorite = (carId) => {
        if (!user) return alert('Debes iniciar sesión para guardar favoritos');

        let newFavs;
        if (favorites.includes(carId)) {
            newFavs = favorites.filter(id => id !== carId);
        } else {
            newFavs = [...favorites, carId];
        }

        setFavorites(newFavs);
        localStorage.setItem(`favs_${user.email || 'guest'}`, JSON.stringify(newFavs));
    };

    const isFavorite = (carId) => favorites.includes(carId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};


