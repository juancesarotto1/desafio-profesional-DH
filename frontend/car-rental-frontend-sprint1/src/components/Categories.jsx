import React from 'react';

const Categories = ({ items = [], onCategorySelect, activeCategory }) => {
  return (
    <section className="categories">
      <h2 className="section-title">Explorar por categoría</h2>
      <div className="category-grid">
        {items.map((cat) => (
          <div
            key={cat.id}
            className={`category-card ${activeCategory === cat.title || activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => onCategorySelect(cat)}
          >
            <img
              src={`${cat.urlImage || cat.image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=75&fm=webp'}`}
              alt={cat.title || cat.name}
              loading="lazy"
            />
            <div className="category-overlay">
              <span>{cat.title || cat.name}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .categories {
          margin-bottom: 48px;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            overflow-x: auto;
            display: flex;
            flex-wrap: nowrap;
            padding-bottom: 10px;
            scrollbar-width: thin;
          }
        }
        .category-card {
          position: relative;
          height: 100px;
          border-radius: var(--radius);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid transparent;
          background: #f0f0f0;
          min-width: 0;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.12);
        }
        .category-card.active {
          border-color: var(--primary);
          transform: translateY(-4px);
          box-shadow: 0 6px 15px rgba(var(--primary-rgb), 0.15);
        }
        .category-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .category-card:hover img {
          transform: scale(1.08);
        }
        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          text-align: center;
          padding: 8px;
          transition: background 0.3s ease;
        }
        .category-overlay span {
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
          word-break: break-word;
        }
      `}</style>
    </section>
  );
};

export default Categories;
