import React from 'react';
import { Newspaper, ArrowRight, Zap, Globe, Star } from 'lucide-react';

const Blog = () => {
    const [subscribed, setSubscribed] = React.useState(false);
    const brands = [
        { name: 'Tesla', logo: 'https://www.logo.wine/a/logo/Tesla%2C_Inc./Tesla%2C_Inc.-Logo.wine.svg' },
        { name: 'BMW', logo: 'https://www.logo.wine/a/logo/BMW/BMW-Logo.wine.svg' },
        { name: 'Ferrari', logo: 'https://www.logo.wine/a/logo/Ferrari/Ferrari-Logo.wine.svg' },
        { name: 'Audi', logo: 'https://www.logo.wine/a/logo/Audi/Audi-Logo.wine.svg' },
        { name: 'Porsche', logo: 'https://www.logo.wine/a/logo/Porsche/Porsche-Logo.wine.svg' },
        { name: 'Mercedes', logo: 'https://www.logo.wine/a/logo/Mercedes-Benz/Mercedes-Benz-Logo.wine.svg' },
    ];

    const posts = [
        {
            id: 1,
            title: "El futuro de la movilidad eléctrica",
            excerpt: "Descubre cómo los nuevos modelos están cambiando las reglas del juego en las ciudades modernas.",
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
            category: "Tendencias",
            date: "30 Ene 2026",
            url: "https://blog.ev-renting.com/futuro-coches-electricos"
        },
        {
            id: 2,
            title: "Las mejores rutas para un Road Trip en Argentina",
            excerpt: "Desde la Patagonia hasta el Norte, te mostramos los caminos más espectaculares para recorrer.",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            category: "Viajes",
            date: "28 Ene 2026",
            url: "https://www.argentina.travel/es/novedades/los-8-mejores-roadtrips-para-hacer-en-la-argentina"
        },
        {
            id: 3,
            title: "Mantenimiento básico: Cuida tu auto",
            excerpt: "Consejos prácticos para mantener tu vehículo en perfectas condiciones y ahorrar dinero.",
            image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80",
            category: "Consejos",
            date: "25 Ene 2026",
            url: "https://www.wurth.com.ar/blog/accesorios-vehiculos/15-consejos-para-mantener-un-auto-en-buen-estado/"
        }
    ];

    return (
        <div className="blog-page">
            {/* Banner de marcas */}
            <div className="brands-marquee-container">
                <div className="marquee-content">
                    {[...brands, ...brands].map((brand, index) => (
                        <div key={index} className="brand-item">
                            <img src={brand.logo} alt={brand.name} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="container">
                <header className="blog-header">
                    <div className="badge-news"><Zap size={14} /> Novedades</div>
                    <h1>CARWOW Blog</h1>
                    <p>Mantente al día con las últimas noticias del mundo automotriz y consejos para tus viajes.</p>
                </header>

                <section className="featured-posts">
                    <div className="posts-grid">
                        {posts.map(post => (
                            <article key={post.id} className="blog-card glass shadow">
                                <div className="card-img">
                                    <img src={post.image} alt={post.title} />
                                    <span className="post-category">{post.category}</span>
                                </div>
                                <div className="card-body">
                                    <span className="post-date">{post.date}</span>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
                                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="read-more">
                                        Leer más <ArrowRight size={16} />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="blog-newsletter glass shadow-sm">
                    {!subscribed ? (
                        <>
                            <div className="newsletter-text">
                                <Globe size={40} className="news-icon" />
                                <h2>Suscríbete a nuestro Newsletter</h2>
                                <p>Recibe las mejores ofertas y noticias directamente en tu correo.</p>
                            </div>
                            <form className="news-form" onSubmit={e => { e.preventDefault(); setSubscribed(true); }}>
                                <input type="email" placeholder="Tu correo electrónico" required />
                                <button className="btn-primary" type="submit">Suscribirme</button>
                            </form>
                        </>
                    ) : (
                        <div className="newsletter-success">
                            <Star size={48} className="success-icon" />
                            <h2>¡Gracias por suscribirte!</h2>
                            <p>Te hemos enviado un correo de bienvenida. ¡Prepárate para las mejores novedades!</p>
                        </div>
                    )}
                </section>
            </div>

            <style>{`
                .blog-page { padding-bottom: 80px; }
                
                /* Brands Marquee Transition */
                .brands-marquee-container {
                    background: white;
                    border-bottom: 1px solid var(--border);
                    padding: 30px 0;
                    margin-bottom: 60px;
                    overflow: hidden;
                    position: relative;
                }
                .marquee-content {
                    display: flex;
                    width: calc(250px * 12);
                    animation: scroll 30s linear infinite;
                }
                .brand-item {
                    width: 250px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 40px;
                }
                .brand-item img {
                    height: 50px;
                    filter: grayscale(1);
                    opacity: 0.5;
                    transition: all 0.3s ease;
                }
                .brand-item:hover img {
                    filter: grayscale(0);
                    opacity: 1;
                    transform: scale(1.1);
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-250px * 6)); }
                }

                .blog-header { text-align: center; margin-bottom: 64px; }
                .badge-news { display: inline-flex; align-items: center; gap: 8px; background: rgba(37, 211, 102, 0.1); color: var(--primary); padding: 8px 16px; border-radius: 100px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 20px; }
                .blog-header h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 16px; letter-spacing: -1px; }
                .blog-header p { color: var(--text-muted); font-size: 1.2rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }

                .posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 32px; margin-bottom: 80px; }
                .blog-card { border-radius: 20px; overflow: hidden; border: 1px solid var(--border); transition: all 0.3s ease; }
                .blog-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
                .card-img { height: 240px; position: relative; overflow: hidden; }
                .card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
                .blog-card:hover .card-img img { transform: scale(1.1); }
                .post-category { position: absolute; top: 20px; right: 20px; background: white; padding: 6px 14px; border-radius: 100px; font-weight: 700; font-size: 0.75rem; color: var(--text); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                
                .card-body { padding: 32px; text-align: left; }
                .post-date { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 12px; }
                .card-body h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; line-height: 1.3; }
                .card-body p { color: var(--text-muted); line-height: 1.6; margin-bottom: 24px; }
                
                .read-more { display: inline-flex; align-items: center; gap: 8px; color: var(--primary); font-weight: 800; font-size: 0.95rem; text-decoration: none; cursor: pointer; transition: gap 0.2s; }
                .read-more:hover { gap: 12px; color: var(--primary-hover); }

                .blog-newsletter { padding: 60px; border-radius: 30px; background: #fafafa; display: flex; align-items: center; justify-content: space-between; gap: 40px; }
                .news-icon { color: var(--primary); }
                .newsletter-text h2 { font-size: 2rem; font-weight: 900; margin-bottom: 8px; }
                .newsletter-text p { color: var(--text-muted); font-size: 1.1rem; }
                .news-form { display: flex; gap: 12px; min-width: 400px; }
                .news-form input { flex: 1; padding: 16px 24px; border-radius: 100px; border: 1px solid var(--border); outline: none; font-size: 1rem; transition: border-color 0.2s; }
                .news-form input:focus { border-color: var(--primary); }
                .news-form button { padding: 0 32px; border-radius: 100px; }

                .newsletter-success { text-align: center; width: 100%; animation: fadeIn 0.5s ease; }
                .success-icon { color: var(--primary); margin-bottom: 20px; }
                .newsletter-success h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 12px; }
                .newsletter-success p { color: var(--text-muted); font-size: 1.1rem; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 992px) {
                    .blog-newsletter { flex-direction: column; text-align: center; padding: 40px; }
                    .news-form { min-width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Blog;
