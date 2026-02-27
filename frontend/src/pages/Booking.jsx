import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ChevronLeft, Info, CheckCircle2, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';
import api from '../services/api';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const startStr = queryParams.get('start');
    const endStr = queryParams.get('end');

    const [car, setCar] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingResult, setBookingResult] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setCar(response.data);
            } catch (error) {
                console.error('Error fetching car for booking', error);
            }
        };
        fetchCar();
    }, [id]);

    const handleBooking = async () => {
        if (!startStr || !endStr) {
            setErrorMsg('Por favor selecciona las fechas en la página anterior.');
            setBookingResult('error');
            return;
        }

        setIsProcessing(true);
        setBookingResult(null);
        setErrorMsg('');

        try {
            const payload = {
                startDate: startStr,
                endDate: endStr,
                product: { id: parseInt(id) }
            };

            console.log('Sending booking payload:', payload);
            await api.post('/bookings', payload);
            setBookingResult('success');
        } catch (error) {
            console.error('Booking failed', error);
            const message = error.response?.data?.message || error.message || 'Error de conexión';
            setErrorMsg(message);
            setBookingResult('error');
        } finally {
            setIsProcessing(false);
        }
    };

    const [errorMsg, setErrorMsg] = useState('');

    if (bookingResult === 'success') {
        return (
            <div className="booking-feedback container">
                <div className="feedback-card glass shadow">
                    <CheckCircle2 size={80} color="#25d366" />
                    <h1>¡Reserva Confirmada!</h1>
                    <p>Tu reserva para el <strong>{car?.name}</strong> ha sido procesada con éxito.</p>
                    <div className="notification-info"><Mail size={18} /><span>Te hemos enviado un correo con los detalles.</span></div>
                    <div className="actions">
                        <button className="btn-primary" onClick={() => navigate('/my-bookings')}>Ver mis reservas</button>
                        <button className="btn-outline" onClick={() => navigate('/')}>Volver al inicio</button>
                    </div>
                </div>
                <style>{`
          .booking-feedback { display: flex; align-items: center; justify-content: center; height: calc(100vh - 80px); }
          .feedback-card { padding: 60px; border-radius: 24px; text-align: center; max-width: 600px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
          .notification-info { display: flex; align-items: center; gap: 10px; color: var(--text-muted); background: #f0fff4; padding: 12px 20px; border-radius: 100px; }
          .actions { display: flex; gap: 16px; }
        `}</style>
            </div>
        );
    }

    if (!car) return <div className="loading-spinner">Preparando tu reserva...</div>;

    return (
        <div className="booking-page container">
            <button onClick={() => navigate(-1)} className="back-btn"><ChevronLeft size={20} /> Volver</button>
            <h1>Finaliza tu reserva</h1>

            {bookingResult === 'error' && (
                <div className="error-banner">
                    <p>⚠️ No pudimos completar tu reserva.</p>
                    {errorMsg && <p className="error-detail">{errorMsg}</p>}
                </div>
            )}

            <div className="booking-grid">
                <div className="booking-form-section">
                    <section className="booking-section glass">
                        <h2><Info size={20} /> Tus datos</h2>
                        <div className="user-summary">
                            <div className="field"><label>Nombre completo</label><p>{user?.name || `${user?.firstName} ${user?.lastName}`}</p></div>
                            <div className="field"><label>Correo electrónico</label><p>{user?.email}</p></div>
                        </div>
                    </section>
                    <section className="booking-section glass">
                        <h2><Calendar size={20} /> Fecha de tu viaje</h2>
                        <div className="dates-summary">
                            <div className="booking-date-card">
                                <div className="date-icon-box"><Calendar size={20} /></div>
                                <div className="date-info-box">
                                    <label>Recogida</label>
                                    <p>{startStr || 'No seleccionada'}</p>
                                </div>
                            </div>
                            <div className="booking-date-card">
                                <div className="date-icon-box"><Calendar size={20} /></div>
                                <div className="date-info-box">
                                    <label>Entrega</label>
                                    <p>{endStr || 'No seleccionada'}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <aside className="booking-summary-side">
                    <div className="product-summary-card shadow">
                        <img src={car.images && car.images[0] ? (car.images[0].url || car.images[0]) : ''} alt={car.name} className="p-img" />
                        <div className="p-details">
                            <h3>{car.name}</h3>
                            <div className="p-loc"><MapPin size={14} /> {car.city}</div>
                            <div className="p-price">
                                {startStr && endStr && (
                                    <div className="price-breakdown-mini">
                                        <div className="price-row">
                                            <span>${car.price || 95} x {Math.ceil((new Date(endStr) - new Date(startStr)) / (1000 * 60 * 60 * 24))} días</span>
                                            <span>${(car.price || 95) * Math.ceil((new Date(endStr) - new Date(startStr)) / (1000 * 60 * 60 * 24))}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="price-row total">
                                    <span>Precio Total</span>
                                    <span>${(car.price || 95) * (startStr && endStr ? Math.ceil((new Date(endStr) - new Date(startStr)) / (1000 * 60 * 60 * 24)) : 1)}</span>
                                </div>
                            </div>
                            <button className="btn-primary w-full" onClick={handleBooking} disabled={isProcessing}>
                                {isProcessing ? 'Procesando...' : 'Confirmar reserva'}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
            <style>{`
        .booking-page { padding: 48px 0; }
        .back-btn { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; color: var(--text-muted); font-weight: 600; }
        h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 40px; }
        .booking-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; }
        .error-banner { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 16px; border-radius: 12px; margin-bottom: 24px; font-weight: 600; text-align: center; }
        .error-detail { font-size: 0.8rem; font-weight: 500; margin-top: 4px; opacity: 0.8; }
        .booking-section { padding: 32px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 24px; }
        .booking-section h2 { display: flex; align-items: center; gap: 12px; font-size: 1.3rem; margin-bottom: 24px; }
        .user-summary, .dates-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .booking-date-card { 
            display: flex; 
            align-items: center; 
            gap: 16px; 
            padding: 20px; 
            background: #f8f9fa; 
            border-radius: 12px; 
            border: 1px solid var(--border);
            transition: all 0.2s ease;
        }
        .booking-date-card:hover { border-color: var(--primary); background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .date-icon-box { color: var(--primary); background: rgba(37, 211, 102, 0.1); padding: 10px; border-radius: 10px; }
        .date-info-box { display: flex; flex-direction: column; gap: 4px; }
        .date-info-box label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
        .date-info-box p { font-weight: 700; font-size: 1rem; margin: 0; color: var(--text); }
        
        .field label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
        .product-summary-card { border-radius: 16px; overflow: hidden; background: white; border: 1px solid var(--border); position: sticky; top: 100px; }
        .p-img { width: 100%; height: 200px; object-fit: cover; }
        .p-details { padding: 24px; }
        .p-price { border-top: 1px solid var(--border); margin-top: 16px; padding-top: 16px; }
        .price-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--text-muted); font-size: 0.95rem; }
        .price-row.total { font-weight: 800; font-size: 1.25rem; color: var(--text); border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px; }
        .w-full { width: 100%; padding: 16px; }
      `}</style>
        </div>
    );
};

export default Booking;
