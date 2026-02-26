import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <FavoritesProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
    </FavoritesProvider>
  </AuthProvider>,
)
