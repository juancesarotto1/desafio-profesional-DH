import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

import MyBookings from './pages/MyBookings';
import Booking from './pages/Booking';
import Favorites from './pages/Favorites';
import Blog from './pages/Blog';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <WhatsAppButton />

        <style>{`
          .app {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          main {
            flex: 1;
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
