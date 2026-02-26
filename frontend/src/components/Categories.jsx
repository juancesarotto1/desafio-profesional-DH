import React from 'react';

const Categories = ({ items = [], onCategorySelect, activeCategory }) => {
  const categoriesList = items && items.length > 0 ? items : [];

  // Habilitamos el marquee siempre que haya más de una categoría, como pidió el usuario.
  const useMarquee = categoriesList.length > 1;

  // Si hay muy poquitas categorías, las repetimos más veces para que el scroll sea infinito y sin saltos
  // Especialmente útil en pantallas anchas.
  const displayItems = categoriesList.length > 0 ? (
    categoriesList.length < 5 ? [...categoriesList, ...categoriesList, ...categoriesList, ...categoriesList] : [...categoriesList, ...categoriesList]
  ) : [];

  return (
    <section className="categories">
      <h2 className="section-title">Explorar por categoría</h2>

      <div className={`categories-wrapper ${useMarquee ? 'has-marquee' : ''}`}>
        <div className={`category-grid ${useMarquee ? 'marquee-content' : ''}`}>
          {displayItems.map((cat, index) => (
            <div
              key={`${cat.id || cat.name || cat.title}-${index}`}
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
      </div>

      <style>{`
        .categories {
          margin-bottom: 48px;
          overflow: hidden;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        
        .categories-wrapper {
          width: 100%;
          position: relative;
        }
        
        /* Máscaras laterales para suavizar el marquee */
        .categories-wrapper.has-marquee::before,
        .categories-wrapper.has-marquee::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 10;
          pointer-events: none;
        }
        
        .categories-wrapper.has-marquee::before {
          left: 0;
          background: linear-gradient(to right, white 10%, transparent);
        }
        
        .categories-wrapper.has-marquee::after {
          right: 0;
          background: linear-gradient(to left, white 10%, transparent);
        }
        
        .category-grid {
          display: flex;
          flex-wrap: nowrap;
          gap: 16px;
          width: max-content;
          justify-content: flex-start;
          align-items: stretch;
          padding: 10px 0;
        }
        
        /* Marquee animation */
        .has-marquee .marquee-content {
          animation: carouselScroll 50s linear infinite;
        }
        
        .categories-wrapper:hover .marquee-content {
          animation-play-state: paused;
        }
        
        @keyframes carouselScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .category-card {
          position: relative;
          height: 120px;
          flex: 0 0 180px;
          min-width: 160px;
          border-radius: var(--radius);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid transparent;
          background: #f0f0f0;
          opacity: 0;
          animation: fadeInScale 0.5s ease forwards;
        }
        
        .category-card:nth-child(1) { animation-delay: 0.05s; }
        .category-card:nth-child(2) { animation-delay: 0.1s; }
        .category-card:nth-child(3) { animation-delay: 0.15s; }
        .category-card:nth-child(4) { animation-delay: 0.2s; }
        .category-card:nth-child(n+5) { animation-delay: 0.25s; }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .category-card:hover {
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          z-index: 10;
          border-color: rgba(var(--primary-rgb), 0.3);
        }
        .category-card.active {
          border-color: var(--primary);
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.25);
          z-index: 10;
        }
        .category-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .category-card:hover img {
          transform: scale(1.15);
        }
        .category-card.active img {
          transform: scale(1.1);
        }
        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          color: white;
          font-weight: 750;
          font-size: 0.95rem;
          text-align: center;
          padding: 16px;
          transition: all 0.4s ease;
        }
        .category-card:hover .category-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
        }
        .category-card.active .category-overlay {
          background: linear-gradient(to top, rgba(var(--primary-rgb), 0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
        }
        .category-overlay span {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          word-break: break-word;
          transition: transform 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .category-grid:not(.marquee-content) {
            overflow-x: auto;
            padding-bottom: 12px;
            scrollbar-width: none;
          }
          .category-grid:not(.marquee-content)::-webkit-scrollbar {
            display: none;
          }
          .category-card {
            flex: 0 0 140px !important;
            height: 100px;
          }
          .category-overlay {
            font-size: 0.85rem;
            padding: 10px;
          }
        }
      `}</style>
    </section>
  );
};

export default Categories;
