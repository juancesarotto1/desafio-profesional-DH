import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
<<<<<<< HEAD
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
=======
>>>>>>> origin/master

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
<<<<<<< HEAD
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
=======
>>>>>>> origin/master
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
