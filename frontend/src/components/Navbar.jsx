import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
<<<<<<< HEAD
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    // Backwards compatibility if name is full string
    return name.substring(0, 2).toUpperCase();
  };

=======

const Navbar = () => {
  const navigate = useNavigate();

>>>>>>> origin/master
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
<<<<<<< HEAD
          {user ? (
            <div className="user-menu">
              {user.role.toUpperCase() === 'ADMIN' && (
                <Link to="/admin" className="admin-link">Administrar</Link>
              )}
              <div className="avatar">
                <span>{user.initials || getInitials(user.name)}</span>
              </div>
              <div className="user-info">
                <span className="user-name">Hola, {user.name}</span>
                <span className="logout-btn" onClick={handleLogout}>Cerrar sesión</span>
              </div>
            </div>
          ) : (
            <>
              <Link to="/register" className="nav-link">Crear cuenta</Link>
              <Link to="/login" className="nav-link btn-secondary">Iniciar sesión</Link>
            </>
          )}
=======
          <Link to="/" className="nav-link">Inicio</Link>
>>>>>>> origin/master
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
        }
        .tagline {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .nav-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .nav-link {
          font-weight: 700;
          color: var(--text);
          font-size: 0.95rem;
          transition: color 0.2s;
          padding: 8px 12px;
        }
        .nav-link:hover {
          color: var(--primary);
        }
<<<<<<< HEAD
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
        .user-menu {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .avatar {
            width: 40px;
            height: 40px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1rem;
        }
        .user-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 0.85rem;
        }
        .user-name {
            font-weight: 700;
        }
        .logout-btn {
            color: #ff4d4d;
            cursor: pointer;
            font-size: 0.8rem;
        }
        .logout-btn:hover {
            text-decoration: underline;
        }
        .admin-link {
            color: var(--text-muted);
            font-weight: 600;
            margin-right: 8px;
            font-size: 0.9rem;
        }
        .admin-link:hover {
            color: var(--primary);
        }
=======
>>>>>>> origin/master
      `}</style>
    </nav>
  );
};

export default Navbar;
