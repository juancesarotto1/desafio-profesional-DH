import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Recommendations from '../components/Recommendations';
import api from '../services/api';

<<<<<<< HEAD
// Deduplica elementos por nombre o título (más robusto si el backend manda el mismo auto con IDs distintos)
const dedupeItems = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    const result = [];
    for (const item of list) {
        if (!item) continue;
        const key = (item.name || item.title || item.id || '').toString().toLowerCase().trim();
        if (key && !seen.has(key)) {
            seen.add(key);
            result.push(item);
        }
    }
    return result;
};

=======
>>>>>>> origin/master
const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
<<<<<<< HEAD
=======
                console.log('Fetching products and categories...');
>>>>>>> origin/master
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
<<<<<<< HEAD
                setProducts(dedupeItems(productsRes.data));
                setCategories(dedupeItems(categoriesRes.data));
=======
                console.log('Products API response:', productsRes.data);
                console.log('Categories API response:', categoriesRes.data);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
>>>>>>> origin/master
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.code === 'ERR_NETWORK') {
                    setError('Error de Red: El servidor backend no responde. Asegúrate de que esté corriendo en el puerto 8080.');
                } else {
                    setError(`Error del Servidor: ${error.message || 'No se pudo cargar la información.'}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategorySelect = async (category) => {
        const categoryName = category.title || category.name;

        if (selectedCategory === categoryName) {
            // deseleccionar categoria: mostrar todos los productos
            try {
                setLoading(true);
                const response = await api.get('/products');
<<<<<<< HEAD
                setProducts(dedupeItems(response.data));
=======
                setProducts(response.data);
>>>>>>> origin/master
                setSelectedCategory(null);
            } catch (err) {
                console.error('Error fetching all products:', err);
                setError('No se pudieron cargar los autos.');
            } finally {
                setLoading(false);
            }
        } else {
            // seleccionar categoria: fetch desde el backend
            try {
                setLoading(true);
                console.log(`Fetching products for category ${category.id} (${categoryName})...`);
                const response = await api.get(`/products/category/${category.id}`);
<<<<<<< HEAD
                setProducts(dedupeItems(response.data));
=======
                setProducts(response.data);
>>>>>>> origin/master
                setSelectedCategory(categoryName);
            } catch (err) {
                console.error('Error fetching category products:', err);
                setError(`No se pudieron cargar los autos de la categoría ${categoryName}.`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClearFilter = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
<<<<<<< HEAD
            setProducts(dedupeItems(response.data));
=======
            setProducts(response.data);
>>>>>>> origin/master
            setSelectedCategory(null);
        } catch (err) {
            console.error('Error clearing filter:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products; // productos ya estan filtrados por el server

    return (
        <div className="home-page">
            <Hero onSearchResults={(results) => {
<<<<<<< HEAD
                setProducts(dedupeItems(results || []));
                setSelectedCategory(null);
=======
                console.log('Search results received:', results);
                setProducts(results);
                setSelectedCategory(null); // borrar filtro de categoria al buscar
>>>>>>> origin/master
            }} />

            <div className="container">
                {error && (
                    <div style={{
                        background: '#fff0f0',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '2px solid #ff4d4d',
                        marginBottom: '40px'
                    }}>
                        <h2 style={{ color: '#ff4d4d', marginTop: 0 }}>⚠️ Error de Conexión</h2>
                        <p>{error}</p>
                        <hr />
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>
                            <strong>Sugerencia:</strong> Verifica que el backend esté corriendo en <a href="http://localhost:8080/api/products" target="_blank">http://localhost:8080/api/products</a>.
                        </p>
                    </div>
                )}

                {loading ? (
                    <div className="loading-spinner">Cargando experiencias...</div>
                ) : (
                    <>
                        <Categories
                            items={categories || []}
                            onCategorySelect={handleCategorySelect}
                            activeCategory={selectedCategory}
                        />

                        <div className="recommendations-header">
                            <h2 className="section-title" style={{ marginBottom: 0 }}>
                                {selectedCategory ? `Explorando ${selectedCategory}` : 'Recomendaciones para ti'}
                            </h2>
                            {selectedCategory && (
                                <button
                                    onClick={handleClearFilter}
                                    className="clear-filter-btn"
                                >
                                    Ver todos los autos
                                </button>
                            )}
                        </div>

                        <Recommendations items={filteredProducts || []} />

                        {((!filteredProducts || filteredProducts.length === 0) && !loading && !error) && (
                            <div className="empty-state">
                                <p>No se encontraron autos en esta categoría.</p>
                                {selectedCategory && <button onClick={() => setSelectedCategory(null)} className="btn btn-primary" style={{ marginTop: '16px' }}>Ver todas las categorías</button>}
                            </div>
                        )}
                    </>
                )}
            </div>
            <style>{`
                .recommendations-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 8px;
                }
                .clear-filter-btn {
                    background: transparent;
                    color: var(--primary);
                    font-weight: 700;
                    padding: 8px 16px;
                    border-radius: var(--radius);
                    transition: all 0.2s;
                }
                .clear-filter-btn:hover {
                    background: rgba(var(--primary-rgb), 0.1);
                    text-decoration: underline;
                }
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    background: #f9f9f9;
                    border-radius: var(--radius);
                    border: 2px dashed var(--border);
                }
            `}</style>
        </div>
    );
};

export default Home;
