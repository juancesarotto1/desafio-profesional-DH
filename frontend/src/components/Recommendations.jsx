import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const Recommendations = ({ items = [] }) => {
    const navigate = useNavigate();

    return (
        <section className="recommendations">
            <div className="car-grid">
                {items.map((car) => (
                    <div key={car.id} className="car-card" onClick={() => navigate(`/product/${car.id}`)}>
                        <div className="car-image">
                            <img
                                src={`${car.images && car.images[0] ? (car.images[0].url || car.images[0]) : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d'}?auto=format,compress&fit=crop&w=600&q=75&fm=webp`}
                                alt={car.name}
                                loading="lazy"
                            />
                        </div>
                        <div className="car-info">
                            <div className="car-header">
                                <h3>{car.name}</h3>
                                <div className="rating">
                                    <Star size={14} fill="currentColor" />
                                    <span>{car.rating || 5.0}</span>
                                </div>
                            </div>
                            <p className="description">{car.description}</p>
                            <p className="price">Desde <strong>${car.price || 95}</strong> / día</p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        .recommendations { margin-bottom: 64px; }
        .car-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .car-card { background: white; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); cursor: pointer; transition: transform 0.2s ease; border: 1px solid var(--border); }
        .car-card:hover { transform: translateY(-4px); }
        .car-image { position: relative; height: 200px; }
        .car-image img { width: 100%; height: 100%; object-fit: cover; }
        .favorite-btn { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.8); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.2s; }
        .favorite-btn:hover { transform: scale(1.1); background: white; }
        .favorite-btn.active { color: #ff4d4d; }
        .car-info { padding: 16px; }
        .car-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
        .car-header h3 { font-size: 1.1rem; font-weight: 700; }
        .rating { display: flex; align-items: center; gap: 4px; font-weight: 600; font-size: 0.9rem; color: #ffb400; }
        .description { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .price { font-size: 0.95rem; }
        .price strong { font-size: 1.1rem; color: var(--text); }
      `}</style>
        </section>
    );
};

export default Recommendations;
