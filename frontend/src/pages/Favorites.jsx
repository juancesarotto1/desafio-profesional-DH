import React, { useState, useEffect } from 'react';
import { useFavorites } from '../context/useFavorites';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader } from 'lucide-react';
import api from '../services/api';

const Favorites = () => {
    const { favorites, toggleFavorite } = useFavorites();
    const [favoriteCars, setFavoriteCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (favorites.length === 0) {
                setFavoriteCars([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Fetch all products and filter locally for simplicity and correctness
                const response = await api.get('/products');
                const products = response.data;
                const filtered = products.filter(car => {
                    const carId = car.id || car.productId || car.idProducto || car.id_producto;
                    return favorites.includes(String(carId));
                });
                setFavoriteCars(filtered);
            } catch (error) {
                console.error('Error fetching favorite cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [favorites]);

    if (loading) return (
        <div className="favorites-page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader className="animate-spin" size={48} color="var(--primary)" />
        </div>
    );

    return (
        <div className="favorites-page container">
            <div className="fav-header">
                <h1>Mis Favoritos</h1>
                <p>{favoriteCars.length} autos guardados</p>
            </div>

            {favoriteCars.length === 0 ? (
                <div className="empty-favs glass">
                    <Heart size={48} color="var(--border)" />
                    <h2>Aún no tienes favoritos</h2>
                    <p>Explora nuestros autos y guarda los que más te gusten.</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>Explorar autos</button>
                </div>
            ) : (
                <div className="car-grid">
                    {favoriteCars.map(car => (
                        <div key={car.id} className="car-card" onClick={() => navigate(`/product/${car.id}`)}>
                            <div className="car-image">
                                <img src={car.images && car.images[0] ? (car.images[0].url || car.images[0]) : 'https://via.placeholder.com/400x300?text=No+Image'} alt={car.name} />
                                <button
                                    className="favorite-btn active"
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(car.id); }}
                                >
                                    <Heart size={18} fill="currentColor" />
                                </button>
                            </div>
                            <div className="car-info">
                                <h3>{car.name}</h3>
                                <p className="description">{car.description}</p>
                                <p className="price">Desde <strong>${car.price || 95}</strong> / día</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .favorites-page { padding: 48px 0; min-height: calc(100vh - 80px); }
        .fav-header { margin-bottom: 40px; }
        .fav-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 8px; }
        .fav-header p { color: var(--text-muted); font-size: 1.1rem; }

        .empty-favs {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          border-radius: var(--radius);
          text-align: center;
          gap: 16px;
        }
        .empty-favs h2 { font-size: 1.5rem; }
        .empty-favs p { color: var(--text-muted); margin-bottom: 12px; }

        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .car-card {
          background: white;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .car-card:hover { transform: translateY(-4px); }
        .car-image { position: relative; height: 200px; }
        .car-image img { width: 100%; height: 100%; object-fit: cover; }
        .favorite-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.9);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff4d4d;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .car-info { padding: 16px; }
        .car-info h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
        .description { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px; }
        .price { font-size: 0.95rem; }
        .price strong { font-size: 1.1rem; color: var(--text); }
      `}</style>
        </div>
    );
};

export default Favorites;
