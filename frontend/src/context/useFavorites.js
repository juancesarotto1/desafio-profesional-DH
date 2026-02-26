import { useContext } from 'react';
import { FavoritesContext } from './FavoritesContext.context.js';

export const useFavorites = () => useContext(FavoritesContext);
