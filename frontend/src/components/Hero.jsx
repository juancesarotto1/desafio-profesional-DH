import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Search, MapPin, Calendar } from 'lucide-react';
import api from '../services/api';
import es from 'date-fns/locale/es';

registerLocale('es', es);

const Hero = ({ onSearchResults }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!startDate || !endDate) return alert('Selecciona un rango de fechas');

    setIsSearching(true);
    try {
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];

      console.info('Buscando con fechas:', { start, end });

      let results = [];
      try {
        // Volver a lo que funcionaba antes: solo fechas para asegurar compatibilidad
        const response = await api.get(`/products/search?start=${start}&end=${end}`);
        results = response.data;
      } catch (err) {
        console.warn('Backend search failed, falling back to all products', err);
        // Si falla la búsqueda, traemos todos los productos como último recurso
        const fallbackRes = await api.get('/products');
        results = fallbackRes.data;
      }

      // Filtrado por destino en el frontend (más seguro y flexible)
      if (location && location.trim() !== '') {
        const term = location.toLowerCase().trim();
        results = results.filter(car =>
          (car.city && car.city.toLowerCase().includes(term)) ||
          (car.name && car.name.toLowerCase().includes(term)) ||
          (car.description && car.description.toLowerCase().includes(term))
        );
      }

      if (onSearchResults) onSearchResults(results);
    } catch (error) {
      console.error('Final search failure', error);
      alert('Error de conexión con el servidor. Por favor verifique que el backend esté corriendo.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Encuentra tu próximo viaje</h1>
        <p>Reserva autos únicos de anfitriones locales.</p>

        <div className="search-bar glass">
          <div className="search-input">
            <div className="input-label"><MapPin size={14} /><label>Dónde</label></div>
            <input
              type="text"
              placeholder="Ciudad, dirección..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="divider"></div>
          <div className="search-input date-picker-container">
            <div className="input-label"><Calendar size={14} /><label>Cuándo</label></div>
            <DatePicker
              selected={startDate}
              onChange={(dates) => { const [s, e] = dates; setStartDate(s); setEndDate(e); }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              placeholderText="Seleccionar fechas"
              locale="es"
              dateFormat="dd MMM."
              minDate={new Date()}
              className="date-input"
            />
          </div>
          <button className="search-btn" onClick={handleSearch} disabled={isSearching}>
            <Search size={20} />
          </button>
        </div>
      </div>
      <style>{`
        .hero { height: 550px; background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80'); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; color: white; text-align: center; margin-bottom: 64px; }
        .hero-content h1 { font-size: 3.8rem; font-weight: 900; margin-bottom: 12px; text-shadow: 0 4px 20px rgba(0,0,0,0.5); letter-spacing: -1px; }
        .hero-content p { font-size: 1.4rem; margin-bottom: 48px; font-weight: 500; opacity: 0.9; }
        
        .search-bar { 
          display: flex; 
          align-items: center; 
          padding: 12px 12px 12px 32px; 
          border-radius: 100px; 
          max-width: 900px; 
          margin: 0 auto; 
          color: var(--text); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.3); 
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .search-bar:focus-within { transform: scale(1.02); box-shadow: 0 25px 50px rgba(0,0,0,0.4); }

        .search-input { display: flex; flex-direction: column; align-items: flex-start; flex: 1; cursor: pointer; padding: 4px 0; }
        .input-label { display: flex; align-items: center; gap: 8px; color: var(--primary); margin-bottom: 4px; }
        .input-label label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .search-input input, .date-input { border: none; background: transparent; font-size: 1.1rem; padding: 2px 0; width: 100%; outline: none; font-weight: 700; color: var(--text); cursor: pointer; }
        .date-input::placeholder { color: #aaa; }

        .divider { width: 1px; height: 40px; background: #ddd; margin: 0 32px; }
        .search-btn { background: var(--primary); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 12px; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .search-btn:hover { background: var(--primary-hover); transform: rotate(90deg) scale(1.1); box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); }
        
        /* Custom DatePicker Styles */
        .date-picker-container :global(.react-datepicker-wrapper) { width: 100%; }
        .date-picker-container :global(.react-datepicker) {
            border: none;
            box-shadow: 0 15px 45px rgba(0,0,0,0.15);
            border-radius: 20px;
            font-family: inherit;
            padding: 10px;
            overflow: hidden;
        }
        .date-picker-container :global(.react-datepicker__header) {
            background: white;
            border-bottom: none;
            padding-top: 15px;
        }
        .date-picker-container :global(.react-datepicker__current-month) {
            font-size: 1.1rem;
            font-weight: 800;
            text-transform: capitalize;
            color: var(--text);
            margin-bottom: 10px;
        }
        .date-picker-container :global(.react-datepicker__day-name) {
            font-weight: 700;
            color: #ccc;
            width: 2.5rem;
        }
        .date-picker-container :global(.react-datepicker__day) {
            width: 2.5rem;
            line-height: 2.5rem;
            border-radius: 50%;
            font-weight: 600;
            transition: all 0.2s;
        }
        .date-picker-container :global(.react-datepicker__day:hover) {
            background-color: #f0f0f0;
            color: var(--primary);
        }
        .date-picker-container :global(.react-datepicker__day--selected),
        .date-picker-container :global(.react-datepicker__day--in-range),
        .date-picker-container :global(.react-datepicker__day--in-selecting-range) {
            background-color: var(--primary) !important;
            color: white !important;
        }
        .date-picker-container :global(.react-datepicker__day--keyboard-selected) {
            background-color: rgba(37, 211, 102, 0.1);
            color: var(--primary);
        }
        .date-picker-container :global(.react-datepicker__triangle) {
            display: none;
        }
      `}</style>
    </div>
  );
};

export default Hero;
