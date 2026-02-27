import React, { useState, useEffect } from 'react';
import { Plus, Trash2, LayoutDashboard, Car, Layers, CheckSquare, XCircle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // estados de los formularios
    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', images: [], categoryId: '', price: 95, features: [] });
    const [newCategory, setNewCategory] = useState({ title: '', description: '', urlImage: '' });

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    // control de acceso temprano - ahora despues de hooks
    if (!user || user.role !== 'admin') {
        return (
            <div className="admin-denied container">
                <XCircle size={64} color="#ff4d4d" />
                <h1>Acceso Denegado</h1>
                <p>Solo los administradores pueden acceder a este panel.</p>
                <button className="btn-primary" onClick={() => navigate('/')}>Volver al Home</button>
                <style>{`
          .admin-denied { display: flex; flex-direction: column; align-items: center; justify-content: center; height: calc(100vh - 80px); text-align: center; }
          .admin-denied h1 { margin: 24px 0 12px; }
          .admin-denied p { color: var(--text-muted); margin-bottom: 32px; }
        `}</style>
            </div>
        );
    }

    if (loading) return <div className="loading-spinner">Cargando panel...</div>;

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
            setProducts(pRes.data);
            setCategories(cRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newProduct,
                category: { id: newProduct.categoryId }
            };
            await api.post('/products', payload);
            alert('Auto registrado con éxito');
            setShowProductForm(false);
            fetchData();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error al registrar auto');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', newCategory);
            alert('Categoría creada con éxito');
            setShowCategoryForm(false);
            fetchData();
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Error al crear categoría');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('¿Eliminar este producto?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error al eliminar');
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('¿Eliminar esta categoría?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Error al eliminar');
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-layout">
                    <aside className="admin-sidebar glass">
                        <div className="sidebar-header"><LayoutDashboard size={24} /> <span>Admin Panel</span></div>
                        <nav>
                            <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><Car size={18} /> Productos</button>
                            <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}><Layers size={18} /> Categorías</button>
                        </nav>
                    </aside>

                    <main className="admin-main">
                        {activeTab === 'products' ? (
                            <section>
                                <div className="header-row">
                                    <h2>Gestión de Productos</h2>
                                    <button className="btn-primary" onClick={() => setShowProductForm(!showProductForm)}><Plus size={18} /> {showProductForm ? 'Cancelar' : 'Nuevo Auto'}</button>
                                </div>
                                {showProductForm && (
                                    <form className="admin-form glass" onSubmit={handleAddProduct}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Nombre</label>
                                                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Categoría</label>
                                                <select required value={newProduct.categoryId} onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}>
                                                    <option value="">Seleccionar...</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn-primary w-full">Guardar Auto</button>
                                    </form>
                                )}
                                <div className="data-list">
                                    {products.map(p => (
                                        <div key={p.id} className="data-item">
                                            <div className="item-info">
                                                <Car size={20} color="var(--primary)" />
                                                <div><h3>{p.name}</h3><span className="cat-badge">{p.category?.title}</span></div>
                                            </div>
                                            <button className="icon-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section>
                                <div className="header-row">
                                    <h2>Gestión de Categorías</h2>
                                    <button className="btn-primary" onClick={() => setShowCategoryForm(!showCategoryForm)}><Plus size={18} /> {showCategoryForm ? 'Cancelar' : 'Nueva Categoría'}</button>
                                </div>
                                {showCategoryForm && (
                                    <form className="admin-form glass" onSubmit={handleAddCategory}>
                                        <div className="form-group">
                                            <label>Título</label>
                                            <input type="text" required value={newCategory.title} onChange={e => setNewCategory({ ...newCategory, title: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>URL Imagen</label>
                                            <input type="text" required value={newCategory.urlImage} onChange={e => setNewCategory({ ...newCategory, urlImage: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-primary w-full">Crear Categoría</button>
                                    </form>
                                )}
                                <div className="data-list">
                                    {categories.map(c => (
                                        <div key={c.id} className="data-item">
                                            <div className="item-info">
                                                <Layers size={20} color="var(--primary)" />
                                                <div><h3>{c.title}</h3><p>{c.description?.substring(0, 40)}...</p></div>
                                            </div>
                                            <button className="icon-btn delete" onClick={() => handleDeleteCategory(c.id)}><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
            <style>{`
        .admin-page { padding: 40px 0; background: #fefefe; min-height: calc(100vh - 80px); }
        .admin-layout { display: grid; grid-template-columns: 240px 1fr; gap: 40px; }
        .admin-sidebar { padding: 20px; border-radius: var(--radius); border: 1px solid var(--border); }
        .sidebar-header { display: flex; align-items: center; gap: 12px; font-weight: 800; margin-bottom: 32px; }
        .admin-sidebar button { display: flex; align-items: center; gap: 12px; padding: 12px 16px; width: 100%; border-radius: 8px; font-weight: 600; color: var(--text-muted); }
        .admin-sidebar button.active { background: var(--primary); color: white; }
        .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .admin-form { padding: 24px; border-radius: var(--radius); border: 1px solid var(--border); margin-bottom: 32px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.85rem; font-weight: 700; }
        .form-group input, .form-group select { padding: 10px; border-radius: 6px; border: 1px solid var(--border); }
        .data-list { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .data-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--border); background: white; }
        .item-info { display: flex; align-items: center; gap: 16px; }
        .cat-badge { font-size: 0.7rem; color: var(--primary); border: 1px solid var(--primary); padding: 2px 8px; border-radius: 4px; }
        .icon-btn.delete { color: #ff4d4d; }
        .w-full { width: 100%; margin-top: 8px; }
      `}</style>
        </div>
    );
};

export default Admin;
