import { useContext } from 'react';
import { AuthContext } from './AuthContext.context.js';

export const useAuth = () => useContext(AuthContext);
