import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Star, MapPin, ShieldCheck, ChevronLeft, Wifi, Wind, Map as MapIcon, Bluetooth, Heart, Info, ShieldAlert, Clock, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { useFavorites } from '../context/useFavorites';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import es from 'date-fns/locale/es';
import { getCarSpecs } from '../utils/carSpecs';

registerLocale('es', es);

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGallery, setShowGallery] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [occupiedDates, setOccupiedDates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch product details first
                try {
                    const productRes = await api.get(`/products/${id}`);
                    setCar(productRes.data);
                } catch (err) {
                    console.error('Error fetching product details:', err);
                    setError('No se pudo encontrar el auto solicitado.');
                    setLoading(false);
                    return;
                }

                // Fetch occupied dates separately (don't block if it fails)
                try {
                    // NEW: Fetch bookings for this product instead of flat dates
                    console.log(`Fetching bookings for product ${id}...`);
                    const bookingsRes = await api.get(`/bookings/product/${id}`);
                    console.log('Bookings received:', bookingsRes.data);

                    const disabledDates = [];
                    bookingsRes.data.forEach(booking => {
                        // Parse "YYYY-MM-DD" manually to avoid timezone issues
                        const parseDate = (dateStr) => {
                            if (!dateStr) return null;
                            const [year, month, day] = dateStr.split('-').map(Number);
                            return new Date(year, month - 1, day);
                        };

                        const start = parseDate(booking.startDate);
                        const end = parseDate(booking.endDate);

                        if (start && end) {
                            // Loop through dates from start to end and add to disabled list
                            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                                disabledDates.push(new Date(d));
                            }
                        }
                    });

                    console.log('Disabled dates processed:', disabledDates);
                    setOccupiedDates(disabledDates);
                } catch (err) {
                    console.warn('Error fetching occupied dates, using empty list:', err);
                    setOccupiedDates([]);
                }
            } catch (err) {
                console.error('Data fetching error:', err);
                setError('Error al cargar la información del vehículo.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleRating = async (stars) => {
        if (!user) return alert('Inicia sesión para puntuar');

        // Simulación: solo usuarios con reservas finalizadas pueden puntuar
        // En un entorno real, verificaríamos esto con una llamada al API o revisando el contexto de reservas
        try {
            const bookingsRes = await api.get(`/bookings/user/${user.id || user.email}`);
            const carId = car.id || car.productId || car.idProducto;
            const hasFinishedBooking = bookingsRes.data.some(b => {
                const bProdId = b.product?.id || b.product?.productId || b.product?.idProducto;
                return String(bProdId) === String(carId);
            });

            if (!hasFinishedBooking) {
                return alert('Solo puedes puntuar productos que hayas reservado anteriormente.');
            }

            // api.post(`/products/${id}/rate`, { stars });
            setUserRating(stars);
            alert(`¡Gracias por puntuar con ${stars} estrellas!`);
        } catch (error) {
            console.warn('Usando simulación de permisos de puntuación');
            // Como respaldo si el endpoint falla, permitimos puntuar para demostrar la UI
            setUserRating(stars);
            alert(`¡Gracias por puntuar con ${stars} estrellas!`);
        }
    };

    const handleContinueBooking = () => {
        // usar una manera mas robusta de obtener YYYY-MM-DD en local time
        const formatDate = (date) => {
            if (!date) return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const start = formatDate(startDate);
        const end = formatDate(endDate);
        const carId = car.id || car.idProducto || car.productId;
        const bookingPath = `/booking/${carId}?start=${start}&end=${end}`;

        if (!user) {
            console.log('No user found, navigating to login with redirect state');
            navigate('/login', { state: { from: bookingPath } });
        } else {
            console.log('Continuing to booking path:', bookingPath);
            navigate(bookingPath);
        }
    };

    if (loading) return <div className="loading-spinner">Cargando detalles...</div>;
    if (error) return <div className="container" style={{ padding: '100px 0' }}><div className="error-message">{error}</div><button className="btn-primary" onClick={() => navigate('/')}>Volver al inicio</button></div>;
    if (!car) return null;

    // fusionar las especificaciones por defecto con los datos del backend y la mapeo local
    const mappedSpecs = getCarSpecs(car.name);
    const finalSpecs = {
        ...mappedSpecs,
        ...car.specifications
    };

    return (
        <div className="product-detail">
            <div className="container">
                <div className="header-nav">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ChevronLeft size={20} /> Volver
                    </button>
                    <button
                        className={`fav-btn-alt ${isFavorite(car.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(car.id)}
                    >
                        <Heart size={20} fill={isFavorite(car.id) ? "currentColor" : "none"} />
                        {isFavorite(car.id) ? 'Guardado' : 'Guardar'}
                    </button>
                </div>

                <div className="header-section">
                    <div className="title-row">
                        <h1>{car.name}</h1>
                        <div className="rating-system">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star
                                    key={s}
                                    size={24}
                                    className={s <= (userRating || car.rating || 5) ? 'star active' : 'star'}
                                    onClick={() => handleRating(s)}
                                    fill={s <= (userRating || car.rating || 5) ? "currentColor" : "none"}
                                />
                            ))}
                            <span className="rating-count">({car.trips || 0} evaluaciones)</span>
                        </div>
                    </div>
                    <div className="stats">
                        <div className="stat-item"><ShieldCheck size={16} /> Host Verificado</div>
                        <div className="stat-item"><MapPin size={16} /> {car.city || 'Buenos Aires, Argentina'}</div>
                    </div>
                </div>

                <div className="gallery-grid">
                    <div className="main-image" onClick={() => setShowGallery(true)}>
                        <img src={car.images && car.images[0] ? (car.images[0].url || car.images[0]) : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80'} alt={car.name} />
                    </div>
                    <div className="side-images">
                        {car.images && car.images.slice(1, 5).map((img, index) => (
                            <div key={index} className="side-image" onClick={() => setShowGallery(true)}>
                                <img src={img.url || img} alt={car.name} />
                                {index === 3 && car.images.length > 5 && (
                                    <div className="see-more-overlay">
                                        <span>+ {car.images.length - 5} fotos</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {showGallery && (
                    <div className="gallery-modal" onClick={() => setShowGallery(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="close-modal" onClick={() => setShowGallery(false)}>×</button>
                            <div className="modal-scroll">
                                {car.images.map((img, i) => (
                                    <img key={i} src={img.url || img} alt={`${car.name} ${i + 1}`} className="modal-img" />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="detail-layout">
                    <div className="detail-main">
                        <section className="info-block">
                            <h2>Descripción</h2>
                            <p>{car.description}</p>
                        </section>

                        <section className="info-block">
                            <h2>Especificaciones Técnicas</h2>
                            <div className="specs-grid">
                                <div className="spec-card">
                                    <div className="spec-icon"><Wind size={20} /></div>
                                    <div className="spec-info">
                                        <label>Consumo</label>
                                        <span>{finalSpecs.consumption || '15 km/l'}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon"><Clock size={20} /></div>
                                    <div className="spec-info">
                                        <label>Transmisión</label>
                                        <span>{finalSpecs.transmission || 'Automática'}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon"><Wind size={20} /></div>
                                    <div className="spec-info">
                                        <label>Combustible</label>
                                        <span>{finalSpecs.fuelType || 'Gasolina'}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon"><Zap size={20} /></div>
                                    <div className="spec-info">
                                        <label>Motor</label>
                                        <span>{finalSpecs.engine || '2.0 Turbo'}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon"><Zap size={20} /></div>
                                    <div className="spec-info">
                                        <label>Caballos de Fuerza (HP)</label>
                                        <span>{finalSpecs.hp || '250 HP'}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon"><MapIcon size={20} /></div>
                                    <div className="spec-info">
                                        <label>Tracción</label>
                                        <span>{finalSpecs.drivetrain || 'Integral'}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon"><ShieldCheck size={20} /></div>
                                    <div className="spec-info">
                                        <label>Seguridad</label>
                                        <span>{finalSpecs.safety || 'Airbags, ABS'}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon"><Star size={20} /></div>
                                    <div className="spec-info">
                                        <label>Estrellas (Euro NCAP)</label>
                                        <span>{finalSpecs.stars || '5'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="info-block">
                            <div className="features-grid-alt">
                                {car.features && Array.isArray(car.features) ? car.features.map(f => (
                                    <div key={f.id || f} className="feature-pill">
                                        {(f.name || f) === 'WiFi' && <Wifi size={18} />}
                                        {(f.name || f) === 'Aire Acondicionado' && <Wind size={18} />}
                                        {(f.name || f) === 'GPS' && <MapIcon size={18} />}
                                        {(f.name || f) === 'Bluetooth' && <Bluetooth size={18} />}
                                        <span>{f.name || f}</span>
                                    </div>
                                )) : <p>Cargando beneficios...</p>}
                            </div>
                        </section>

                        <section className="info-block">
                            <h2>Disponibilidad</h2>
                            <div className="calendar-legend">
                                <div className="legend-item"><span className="dot available"></span> Disponible</div>
                                <div className="legend-item"><span className="dot occupied"></span> Ocupado</div>
                                <div className="legend-item"><span className="dot selected"></span> Tu selección</div>
                            </div>
                            <div className="calendar-wrapper">
                                <DatePicker
                                    inline
                                    selected={startDate}
                                    onChange={(dates) => {
                                        const [start, end] = dates;
                                        setStartDate(start);
                                        setEndDate(end);
                                    }}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    excludeDates={occupiedDates}
                                    monthsShown={2}
                                    minDate={new Date()}
                                    locale="es"
                                />
                            </div>
                        </section>
                    </div>

                    <aside className="detail-side">
                        <div className="booking-card-v2 glass shadow">
                            <div className="price-tag">
                                <span className="val">${car.price || 95}</span> <span className="period">/ día</span>
                            </div>
                            <div className="date-selection glass shadow-sm">
                                <div className="date-box">
                                    <div className="date-icon"><CalendarIcon size={18} /></div>
                                    <div className="date-info">
                                        <label>RECOGIDA</label>
                                        <span>{startDate ? startDate.toLocaleDateString() : 'Seleccionar'}</span>
                                    </div>
                                </div>
                                <div className="date-box">
                                    <div className="date-icon"><CalendarIcon size={18} /></div>
                                    <div className="date-info">
                                        <label>DEVOLUCIÓN</label>
                                        <span>{endDate ? endDate.toLocaleDateString() : 'Seleccionar'}</span>
                                    </div>
                                </div>
                            </div>

                            {startDate && endDate && (
                                <div className="price-breakdown">
                                    <div className="breakdown-row">
                                        <span>${car.price || 95} x {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} días</span>
                                        <span>${(car.price || 95) * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Total estimado</span>
                                        <span>${(car.price || 95) * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                className="btn-primary w-full large"
                                onClick={handleContinueBooking}
                                disabled={!startDate || !endDate}
                            >
                                Continuar con la reserva
                            </button>
                            <p className="no-charge-txt">No se te cobrará nada todavía</p>
                        </div>
                    </aside>
                </div>

                <section className="policies-section info-block">
                    <h2>Políticas de uso y cuidados</h2>
                    <div className="policies-grid">
                        <div className="policy-col">
                            <h3><Info size={18} /> Normas del sitio</h3>
                            <ul>
                                {car.policies?.filter(p => p.type === 'RULES').map(p => (
                                    <li key={p.id}>{p.description}</li>
                                )) || (
                                        <>
                                            <li>Mínimo 21 años de edad y licencia vigente.</li>
                                            <li>No se permite fumar dentro del vehículo.</li>
                                            <li>Devolver el auto con el mismo nivel de combustible.</li>
                                        </>
                                    )}
                            </ul>
                        </div>
                        <div className="policy-col">
                            <h3><ShieldAlert size={18} /> Salud y seguridad</h3>
                            <ul>
                                {car.policies?.filter(p => p.type === 'SAFETY').map(p => (
                                    <li key={p.id}>{p.description}</li>
                                )) || (
                                        <>
                                            <li>Limpieza intensiva según protocolos.</li>
                                            <li>Uso de cinturón de seguridad obligatorio.</li>
                                            <li>Kit de primeros auxilios y auxilio mecánico.</li>
                                        </>
                                    )}
                            </ul>
                        </div>
                        <div className="policy-col">
                            <h3><Clock size={18} /> Política de cancelación</h3>
                            <ul>
                                {car.policies?.filter(p => p.type === 'CANCELLATION').map(p => (
                                    <li key={p.id}>{p.description}</li>
                                )) || (
                                        <>
                                            <li>Cancelación gratuita hasta 48hs antes.</li>
                                            <li>Posterior a las 48hs se cobrará un 50%.</li>
                                        </>
                                    )}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <style>{`
                .product-detail { padding: 40px 0; background: #fff; }
                .header-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .back-btn, .fav-btn-alt { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--text-muted); }
                .fav-btn-alt.active { color: #ff4d4d; }

                .header-section { margin-bottom: 32px; }
                .title-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
                .title-row h1 { font-size: 2.5rem; font-weight: 900; }
                .rating-system { display: flex; align-items: center; gap: 8px; color: #ffb400; cursor: pointer; }
                .star { transition: transform 0.2s; }
                .star:hover { transform: scale(1.2); }
                .rating-count { color: var(--text-muted); font-size: 0.95rem; font-weight: 500; }
                .stats { display: flex; gap: 24px; color: var(--text-muted); font-size: 0.95rem; }
                .stat-item { display: flex; align-items: center; gap: 6px; }

                .gallery-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; height: 450px; border-radius: 12px; overflow: hidden; margin-bottom: 48px; }
                .main-image, .side-image { cursor: pointer; position: relative; }
                .main-image img, .side-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
                .main-image:hover img, .side-image:hover img { transform: scale(1.02); }
                .side-images { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 12px; }
                
                .see-more-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
                
                .gallery-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 40px; }
                .modal-content { background: white; width: 100%; max-width: 1000px; max-height: 90vh; border-radius: 20px; position: relative; overflow: hidden; }
                .close-modal { position: absolute; top: 20px; right: 20px; background: white; border: none; font-size: 2rem; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .modal-scroll { overflow-y: auto; max-height: 90vh; padding: 40px; display: flex; flex-direction: column; gap: 20px; }
                .modal-img { width: 100%; border-radius: 12px; }

                .detail-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 64px; border-bottom: 1px solid var(--border); padding-bottom: 64px; }
                .info-block { margin-bottom: 48px; }
                .info-block h2 { font-size: 1.6rem; font-weight: 800; margin-bottom: 24px; }
                .info-block p { color: var(--text-muted); line-height: 1.8; font-size: 1.1rem; }

                .features-grid-alt { display: flex; flex-wrap: wrap; gap: 12px; }
                .feature-pill { display: flex; align-items: center; gap: 10px; padding: 10px 18px; border: 1px solid var(--border); border-radius: 100px; font-weight: 600; font-size: 0.95rem; }

                .specs-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
                    gap: 20px; 
                    margin-top: 20px;
                }
                .spec-card { 
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                    padding: 16px; 
                    background: #f8f9fa; 
                    border-radius: 12px; 
                    border: 1px solid #eee;
                    transition: all 0.3s ease;
                }
                .spec-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                    border-color: var(--primary);
                }
                .spec-icon { 
                    color: var(--primary); 
                    background: rgba(37, 211, 102, 0.1); 
                    padding: 10px; 
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .spec-info { display: flex; flex-direction: column; gap: 4px; }
                .spec-info label { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
                .spec-info span { font-size: 1rem; font-weight: 600; color: var(--text); }

                .calendar-wrapper { 
                    border: 1px solid var(--border); 
                    padding: 32px; 
                    border-radius: 16px; 
                    background: white; 
                    display: flex; 
                    justify-content: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    margin-top: 24px;
                }
                
                /* Custom overrides for the inline datepicker */
                .calendar-wrapper .react-datepicker {
                    border: none;
                    font-family: inherit;
                    display: flex;
                    gap: 20px;
                }
                .calendar-wrapper .react-datepicker__month-container {
                    float: none;
                }
                .calendar-wrapper .react-datepicker__header {
                    background: white;
                    border-bottom: none;
                    padding-top: 0;
                }
                .calendar-wrapper .react-datepicker__current-month {
                    font-size: 1.2rem;
                    font-weight: 800;
                    text-transform: capitalize;
                    color: var(--text);
                    margin-bottom: 20px;
                    letter-spacing: -0.5px;
                }
                .calendar-wrapper .react-datepicker__day-name {
                    font-weight: 700;
                    color: #bbb;
                    width: 2.8rem;
                    margin: 0.2rem;
                    font-size: 0.8rem;
                    text-transform: lowercase;
                }
                .calendar-wrapper .react-datepicker__day {
                    width: 2.8rem;
                    line-height: 2.8rem;
                    border-radius: 50%;
                    font-weight: 600;
                    margin: 0.2rem;
                    transition: all 0.2s;
                    color: #444;
                }
                .calendar-wrapper .react-datepicker__day:hover {
                    background-color: #f0fff4;
                    color: var(--primary);
                }
                .calendar-wrapper .react-datepicker__day--selected,
                .calendar-wrapper .react-datepicker__day--in-range,
                .calendar-wrapper .react-datepicker__day--in-selecting-range {
                    background-color: var(--primary) !important;
                    color: white !important;
                    border-radius: 50% !important;
                }
                .calendar-wrapper .react-datepicker__day--disabled {
                    color: #ddd;
                    text-decoration: line-through;
                }
                .calendar-wrapper .react-datepicker__day--keyboard-selected {
                    background-color: transparent;
                }
                .calendar-wrapper .react-datepicker__day--outside-month {
                    color: #eee;
                    pointer-events: none;
                }
                
                .booking-card-v2 { padding: 32px; border: 1px solid var(--border); border-radius: 16px; position: sticky; top: 120px; background: white; }
                .price-tag { margin-bottom: 24px; }
                .price-tag .val { font-size: 2.2rem; font-weight: 900; }
                .date-selection { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    border: 1px solid var(--border); 
                    border-radius: 12px; 
                    overflow: hidden; 
                    margin-bottom: 24px; 
                    background: white;
                    transition: all 0.3s ease;
                }
                .date-selection:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
                .date-box { 
                    padding: 16px; 
                    display: flex; 
                    align-items: center;
                    gap: 12px;
                    border-right: 1px solid var(--border); 
                    transition: background 0.2s;
                    cursor: pointer;
                }
                .date-box:hover { background: #fafafa; }
                .date-box:last-child { border-right: none; }
                .date-icon { color: var(--primary); display: flex; align-items: center; justify-content: center; background: rgba(37, 211, 102, 0.1); padding: 8px; border-radius: 8px; }
                .date-info { display: flex; flex-direction: column; gap: 4px; }
                .date-box label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.05em; }
                .date-box span { font-weight: 700; font-size: 0.9rem; color: var(--text); }
                
                .price-breakdown { margin-bottom: 24px; padding: 0 4px; border-top: 1px solid var(--border); padding-top: 20px; }
                .breakdown-row { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.95rem; margin-bottom: 8px; }
                .total-row { display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; border-top: 2px dashed var(--border); padding-top: 16px; margin-top: 12px; color: var(--text); }

                .btn-primary.large { padding: 18px; font-size: 1.1rem; }
                .no-charge-txt { text-align: center; font-size: 0.85rem; color: var(--text-muted); margin-top: 16px; font-weight: 500; }

                .calendar-legend { display: flex; gap: 24px; margin-bottom: 20px; }
                .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
                .dot { width: 12px; height: 12px; border-radius: 50%; }
                .dot.available { background: #f0f0f0; border: 1px solid #ddd; }
                .dot.occupied { background: #ddd; text-decoration: line-through; }
                .dot.selected { background: var(--primary); }

                .policies-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 32px; }
                .policy-col h3 { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }
                .policy-col ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; }
                .policy-col li { font-size: 0.95rem; color: var(--text-muted); font-weight: 500; line-height: 1.4; }
            `}</style>
        </div>
    );
};

export default ProductDetail;
