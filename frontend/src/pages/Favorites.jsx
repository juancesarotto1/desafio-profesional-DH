import React from 'react';
import { useFavorites } from '../context/useFavorites';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

// usando mock data para simulacion
const mockCars = [
    { id: 1, name: 'Tesla Model 3', description: 'Eléctrico, Autopilot, Premium', price: 95, rating: 4.9, images: ['https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=500&q=80'] },
    { id: 2, name: 'Porsche 911', description: 'Deportivo, Icónico, Veloz', price: 250, rating: 5.0, images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80'] },
    { id: 3, name: 'Jeep Wrangler', description: 'Todoterreno, Aventura, Convertible', price: 120, rating: 4.8, images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80'] },
    { id: 4, name: 'BMW M4', description: 'Lujo, Potencia, Confort', price: 180, rating: 4.7, images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=500&q=80'] },
    { id: 5, name: 'Audi R8', description: 'Superdeportivo, V10, Exclusivo', price: 350, rating: 5.0, images: ['https://images.unsplash.com/photo-1603553329412-429a3a60a76a?auto=format&fit=crop&w=500&q=80'] },
    { id: 6, name: 'Ford Mustang', description: 'Muscle car, Clásico, Potente', price: 130, rating: 4.6, images: ['https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=500&q=80'] },
    { id: 7, name: 'Mercedes G-Class', description: 'Lujo extremo, Todoterreno', price: 400, rating: 4.9, images: ['https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=500&q=80'] },
    { id: 8, name: 'Range Rover', description: 'Elegancia, Espacio, Confort', price: 220, rating: 4.8, images: ['https://images.unsplash.com/photo-1506469717960-433cebe3f181?auto=format&fit=crop&w=500&q=80'] },
    { id: 9, name: 'Mini Cooper', description: 'Urbano, Divertido, Estilo', price: 75, rating: 4.7, images: ['https://images.unsplash.com/photo-1581405232675-927362a229fa?auto=format&fit=crop&w=500&q=80'] },
    { id: 10, name: 'Toyota Supra', description: 'JDM, Leyenda, Turbo', price: 200, rating: 4.9, images: ['https://images.unsplash.com/photo-1617469767053-d3b508a0d7a5?auto=format&fit=crop&w=500&q=80'] },
];

const Favorites = () => {
    const { favorites, toggleFavorite } = useFavorites();
    const navigate = useNavigate();

    const favoriteCars = mockCars.filter(car => favorites.includes(car.id));

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
                                <img src={car.images[0]} alt={car.name} />
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
                                <p className="price">Desde <strong>${car.price}</strong> / día</p>
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
