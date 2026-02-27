import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

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
          <Link to="/" className="nav-link">Inicio</Link>
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
      `}</style>
    </nav>
  );
};

export default Navbar;
