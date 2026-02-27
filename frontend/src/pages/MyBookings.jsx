import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Receipt, ChevronRight, Clock, Trash2, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookings/user');
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.')) {
            try {
                await api.delete(`/bookings/${id}`);
                // Optimizar actualizacion local: eliminar de local state
                setBookings(prev => prev.filter(b => b.id !== id));
                alert('Reserva cancelada con éxito.');
            } catch (error) {
                console.error('Error cancelling booking', error);
                alert('No se pudo cancelar la reserva: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const sortedBookings = [...bookings].sort((a, b) => b.id - a.id);

    if (loading) return <div className="loading-spinner">Cargando tu historial...</div>;

    return (
        <div className="my-bookings container">
            <div className="header">
                <h1>Mis Reservas</h1>
                <p>Gestiona y consulta el historial de tus viajes directamente desde el servidor.</p>
            </div>

            <div className="bookings-list">
                {sortedBookings.length === 0 ? (
                    <div className="empty-state glass">
                        <Calendar size={48} color="var(--border)" />
                        <h2>Aún no tienes reservas</h2>
                        <p>Cuando realices una reserva en la plataforma, la verás aquí.</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>Explorar autos</button>
                    </div>
                ) : (
                    sortedBookings.map(b => (
                        <div key={b.id} className="booking-item glass shadow">
                            <div className="item-img">
                                <img src={b.product?.images?.[0]?.url || b.product?.images?.[0] || ''} alt={b.product?.name} />
                            </div>

                            <div className="item-content">
                                <div className="item-header">
                                    <div>
                                        <h3>{b.product?.name}</h3>
                                        <div className="loc"><MapPin size={14} /> {b.product?.city}</div>
                                    </div>
                                    <div className="status-group">
                                        <div className="status-badge">Confirmada</div>
                                        <button className="cancel-pill" onClick={() => handleCancel(b.id)}>
                                            <Trash2 size={12} />
                                            Cancelar
                                        </button>
                                    </div>
                                </div>

                                <div className="item-details">
                                    <div className="detail-box">
                                        <Clock size={16} />
                                        <span>{b.startDate} - {b.endDate}</span>
                                    </div>
                                    <div className="detail-box">
                                        <Receipt size={16} />
                                        <span>Reserva #{b.id}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="view-btn" onClick={() => navigate(`/product/${b.product?.id}`)}>
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .my-bookings { padding: 48px 0; min-height: calc(100vh - 80px); }
        .header { margin-bottom: 40px; }
        .header h1 { font-size: 2.5rem; font-weight: 800; }
        .empty-state { padding: 80px; text-align: center; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; border: 1px solid var(--border); }
        .bookings-list { display: flex; flex-direction: column; gap: 20px; }
        .booking-item { display: flex; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); transition: transform 0.2s; }
        .booking-item:hover { transform: scale(1.01); }
        .item-img { width: 240px; height: 160px; }
        .item-img img { width: 100%; height: 100%; object-fit: cover; }
        .item-content { flex: 1; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
        .status-group { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .status-badge { background: #e6ffed; color: #25d366; padding: 4px 12px; border-radius: 100px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
        .cancel-pill { 
            display: flex; 
            align-items: center; 
            gap: 6px; 
            background: #fff5f5; 
            color: #ff4d4d; 
            border: 1px solid #feb2b2; 
            padding: 4px 10px; 
            border-radius: 100px; 
            font-size: 0.75rem; 
            font-weight: 700; 
            cursor: pointer;
            transition: all 0.2s;
        }
        .cancel-pill:hover { background: #ff4d4d; color: white; border-color: #ff4d4d; }
        .item-details { display: flex; gap: 32px; }
        .detail-box { display: flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 0.9rem; }
        .view-btn { padding: 0 24px; display: flex; align-items: center; background: #f8f8f8; color: var(--text-muted); }
      `}</style>
        </div>
    );
};

export default MyBookings;
