import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, ChevronDown, Calendar, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    // Backwards compatibility if name is full string
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Car size={32} className="logo-icon" />
          <div className="logo-text">
            <span className="brand">CARWOW</span>
            <span className="tagline">Alquila el auto perfecto</span>
          </div>
        </Link>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/blog" className="nav-link">Blog</Link>
              <div className="user-dropdown-container">
                <div
                  className="user-trigger"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="avatar">
                    <span>{user.initials || getInitials(user.name)}</span>
                  </div>
                  <span className="user-name">Hola, {user.name}</span>
                  <ChevronDown size={16} className={`chevron ${showDropdown ? 'open' : ''}`} />
                </div>

                {showDropdown && (
                  <>
                    <div className="dropdown-overlay" onClick={() => setShowDropdown(false)}></div>
                    <div className="user-dropdown-menu glass">
                      {(user.role?.name || user.role)?.toUpperCase() === 'ADMIN' && (
                        <Link to="/admin" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                          <LayoutDashboard size={16} /> Panel Admin
                        </Link>
                      )}
                      <Link to="/my-bookings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        <Calendar size={16} /> Mis Reservas
                      </Link>
                      <Link to="/favorites" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        <Heart size={16} /> Mis Favoritos
                      </Link>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-item logout" onClick={handleLogout}>
                        <LogOut size={16} /> Cerrar sesión
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/blog" className="nav-link">Blog</Link>
              <Link to="/register" className="nav-link">Crear cuenta</Link>
              <Link to="/login" className="nav-link btn-secondary">Iniciar sesión</Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 80px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .logo-icon {
          color: var(--primary);
        }
        .logo-text {
          display: flex;
          flex-direction: column;
        }
        .brand {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1;
          color: var(--text);
        }
        .tagline {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .nav-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .user-dropdown-container {
            position: relative;
        }
        .user-trigger {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 8px;
            transition: background 0.2s;
        }
        .user-trigger:hover {
            background: rgba(0,0,0,0.03);
        }
        .avatar {
            width: 38px;
            height: 38px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.95rem;
        }
        .user-name {
            font-weight: 600;
            font-size: 0.95rem;
            color: var(--text);
        }
        .chevron {
            color: var(--text-muted);
            transition: transform 0.2s;
        }
        .chevron.open {
            transform: rotate(180deg);
        }
        
        .dropdown-overlay {
            position: fixed;
            inset: 0;
            z-index: 998;
        }
        .user-dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 8px;
            width: 220px;
            background: white;
            border: 1px solid var(--border);
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            z-index: 999;
            animation: slideDown 0.2s ease-out;
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 8px;
            color: var(--text);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            text-decoration: none;
        }
        .dropdown-item:hover {
            background: #f5f5f7;
            color: var(--primary);
        }
        .dropdown-item.logout:hover {
            background: #fff5f5;
            color: #ff4d4d;
        }
        .dropdown-divider {
            height: 1px;
            background: var(--border);
            margin: 4px 0;
        }

        .nav-link {
          font-weight: 700;
          color: var(--text);
          font-size: 0.95rem;
          transition: color 0.2s;
          padding: 8px 12px;
          text-decoration: none;
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .btn-secondary {
            border: 2px solid var(--primary);
            color: var(--primary);
            border-radius: 8px;
            padding: 8px 16px;
        }
        .btn-secondary:hover {
            background: var(--primary);
            color: white;
        }
      `}</style>
    </nav >
  );
};

export default Navbar;
