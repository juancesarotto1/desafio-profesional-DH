import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <h2>Bienvenido de nuevo</h2>
        <p>Inicia sesión para continuar con tu reserva</p>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Iniciar sesión <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>

      <style>{`
        .error-alert {
          background: #fff0f0;
          color: #ff4d4d;
          padding: 12px;
          border-radius: var(--radius);
          border: 1px solid #ff4d4d;
          margin-bottom: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .auth-page {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fcfcfc;
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          border: 1px solid var(--border);
        }
        .auth-card h2 {
          margin-bottom: 8px;
          font-size: 1.8rem;
          font-weight: 800;
        }
        .auth-card p {
          color: var(--text-muted);
          margin-bottom: 32px;
        }
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-with-icon svg {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }
        .input-with-icon input {
          width: 100%;
          padding: 12px 12px 12px 42px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 1rem;
          outline: none;
        }
        .input-with-icon input:focus {
          border-color: var(--primary);
        }
        .w-full {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }
        .auth-footer {
          margin-top: 24px !important;
          font-size: 0.9rem;
        }
        .auth-footer a {
          color: var(--primary);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default Login;
