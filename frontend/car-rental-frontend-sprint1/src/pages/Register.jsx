import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // validación de contraseña
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!/\d/.test(formData.password)) {
      setError('La contraseña debe incluir al menos un número.');
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <h2>Crea tu cuenta</h2>
        <p>Únete a la mayor red de alquiler de autos</p>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="name-fields">
            <div className="form-group">
              <label>Nombre</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Juan"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Pérez"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <p className="input-hint">Mínimo 8 caracteres y al menos un número.</p>
          </div>

          <button type="submit" className="btn-primary w-full">
            Registrarse <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
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
        .name-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
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
        .input-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 6px;
          margin-left: 2px;
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

export default Register;
