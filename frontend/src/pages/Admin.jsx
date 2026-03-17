import React, { useState, useEffect } from 'react';
import { Plus, Trash2, LayoutDashboard, Car, Layers, CheckSquare, XCircle, Image as ImageIcon, Zap, Users } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [features, setFeatures] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // estados de los formularios
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingFeature, setEditingFeature] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', images: [], categoryId: '', price: 95, features: [], imageUrl: '' });
    const [newCategory, setNewCategory] = useState({ title: '', description: '', urlImage: '' });
    const [newFeature, setNewFeature] = useState({ name: '', icon: '', description: '' });
    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showFeatureForm, setShowFeatureForm] = useState(false);

    useEffect(() => {
        // Verificar si el usuario es admin antes de permitir acceso
        if (!user || user.role?.toUpperCase() !== 'ADMIN') {
            navigate('/');
            return;
        }
    }, [user, navigate]);

    const dedupeById = (list) => {
        if (!Array.isArray(list)) return [];
        return Array.from(new Map(list.filter(item => item && item.id != null).map(item => [item.id, item])).values());
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes, featuresRes, usersRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories'),
                api.get('/features'),
                api.get('/users')
            ]);
            setProducts(dedupeById(productsRes.data));
            setCategories(dedupeById(categoriesRes.data));
            setFeatures(dedupeById(featuresRes.data));
            setUsers(dedupeById(usersRes.data));
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role?.toUpperCase() === 'ADMIN') {
            fetchData();
        }
    }, [user]);

    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();

        // Validar que haya al menos 5 imágenes
        if (newProduct.images.length < 5) {
            alert('Por favor, ingresa al menos 5 imágenes para el auto');
            return;
        }

        try {
            const payload = {
                ...newProduct,
                category: { id: newProduct.categoryId },
                // images prop already contains the array of image objects with url and title
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                alert('Auto actualizado con éxito');
            } else {
                await api.post('/products', payload);
                alert('Auto registrado con éxito');
            }

            setShowProductForm(false);
            setEditingProduct(null);
            setNewProduct({ name: '', description: '', images: [], categoryId: '', price: 95, features: [], imageUrl: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar auto');
        }
    };

    const handleAddOrUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            // Asegurarse de que el payload tenga el formato correcto
            const payload = {
                title: newCategory.title,
                description: newCategory.description,
                urlImage: newCategory.urlImage
            };

            console.log('Enviando categoría:', payload);

            if (editingCategory) {
                const response = await api.put(`/categories/${editingCategory.id}`, payload);
                console.log('Respuesta del servidor:', response.data);
                alert('Categoría actualizada con éxito');
            } else {
                const response = await api.post('/categories', payload);
                console.log('Respuesta del servidor:', response.data);
                alert('Categoría creada con éxito');
            }
            setShowCategoryForm(false);
            setEditingCategory(null);
            setNewCategory({ title: '', description: '', urlImage: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving category:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al guardar categoría';
            alert(`Error al guardar categoría: ${errorMessage}`);
        }
    };

    const startEditProduct = (product) => {
        setEditingProduct(product);
        const mainImage = product.images && product.images.length > 0 ? product.images[0].url : '';
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.category?.id || '',
            images: product.images || [],
            features: product.features || [],
            imageUrl: mainImage
        });
        setShowProductForm(true);
    };

    const startEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({
            title: category.title,
            description: category.description,
            urlImage: category.urlImage
        });
        setShowCategoryForm(true);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este auto?')) return;
        try {
            await api.delete(`/products/${id}`);
            alert('Auto eliminado con éxito');
            fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar auto');
        }
    };

    const handleAddOrUpdateFeature = async (e) => {
        e.preventDefault();
        try {
            if (editingFeature) {
                await api.put(`/features/${editingFeature.id}`, newFeature);
                alert('Característica actualizada con éxito');
            } else {
                await api.post('/features', newFeature);
                alert('Característica creada con éxito');
            }
            setShowFeatureForm(false);
            setEditingFeature(null);
            setNewFeature({ name: '', icon: '', description: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving feature:', error);
            alert('Error al guardar la característica');
        }
    };

    const startEditFeature = (feature) => {
        setEditingFeature(feature);
        setNewFeature({ name: feature.name, icon: feature.icon || '', description: feature.description || '' });
        setShowFeatureForm(true);
    };

    const handleDeleteFeature = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta característica?')) return;
        try {
            await api.delete(`/features/${id}`);
            alert('Característica eliminada con éxito');
            fetchData();
        } catch (error) {
            console.error('Error deleting feature:', error);
            alert('Error al eliminar la característica');
        }
    };

    const handleChangeRole = async (id, role) => {
        try {
            await api.put(`/users/${id}/role`, { role });
            setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
        } catch (error) {
            console.error('Error changing role:', error);
            alert('Error al cambiar el rol del usuario');
        }
    };

    const [confirmingDeleteCategoryId, setConfirmingDeleteCategoryId] = useState(null);

    const handleDeleteCategory = async (id) => {
        // Alerta preventiva específica solicitada por el usuario
        alert('El administrador realizará una revisión previa a la eliminación');

        if (confirmingDeleteCategoryId !== id) {
            setConfirmingDeleteCategoryId(id);
            // Autoreset after 3 seconds
            setTimeout(() => setConfirmingDeleteCategoryId(null), 3000);
            return;
        }

        try {
            await api.delete(`/categories/${id}`);
            alert('Categoría eliminada con éxito');
            setConfirmingDeleteCategoryId(null);
            fetchData();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error al eliminar categoría. Verifique que no tenga productos asociados.');
        }
    };

    if (!user || user.role?.toUpperCase() !== 'ADMIN') {
        return null;
    }

    if (loading) {
        return (
            <div className="admin-page">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-layout">
                    {/* Sidebar code remains same */}
                    <aside className="admin-sidebar glass">
                        <div className="sidebar-header"><LayoutDashboard size={24} /> <span>Admin Panel</span></div>
                        <nav>
                            <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><Car size={18} /> Productos</button>
                            <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}><Layers size={18} /> Categorías</button>
                            <button className={activeTab === 'features' ? 'active' : ''} onClick={() => setActiveTab('features')}><Zap size={18} /> Características</button>
                            <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}><Users size={18} /> Usuarios</button>
                        </nav>
                    </aside>

                    <main className="admin-main">
                        {activeTab === 'products' && (
                            <section>
                                <div className="header-row">
                                    <h2>Gestión de Productos</h2>
                                    <button className="btn-primary" onClick={() => {
                                        setEditingProduct(null);
                                        setNewProduct({ name: '', description: '', images: [], categoryId: '', price: 95, features: [], imageUrl: '' });
                                        setShowProductForm(!showProductForm);
                                    }}><Plus size={18} /> {showProductForm ? 'Cancelar' : 'Nuevo Auto'}</button>
                                </div>
                                {showProductForm && (
                                    <form className="admin-form glass" onSubmit={handleAddOrUpdateProduct}>
                                        <h3>{editingProduct ? 'Editar Producto' : 'Crear Producto'}</h3>
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
                                            <div className="form-group">
                                                <label>Descripción</label>
                                                <input type="text" required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Precio</label>
                                                <input type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
                                            </div>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label>Imágenes del Vehículo (Mínimo 5) <span style={{ color: '#ff4d4d' }}>*</span></label>

                                                <div className="image-input-container" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                                    <input
                                                        type="url"
                                                        placeholder="https://ejemplo.com/imagen.jpg"
                                                        id="new-image-url"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const url = e.target.value;
                                                                if (url && url.trim() !== '') {
                                                                    setNewProduct({
                                                                        ...newProduct,
                                                                        images: [...(newProduct.images || []), { url: url, title: `Image ${newProduct.images.length + 1}` }]
                                                                    });
                                                                    e.target.value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-secondary"
                                                        onClick={() => {
                                                            const input = document.getElementById('new-image-url');
                                                            const url = input.value;
                                                            if (url && url.trim() !== '') {
                                                                setNewProduct({
                                                                    ...newProduct,
                                                                    images: [...(newProduct.images || []), { url: url, title: `Image ${newProduct.images.length + 1}` }]
                                                                });
                                                                input.value = '';
                                                            }
                                                        }}
                                                    >
                                                        <Plus size={18} /> Agregar
                                                    </button>
                                                </div>

                                                <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginBottom: '12px' }}>
                                                    {newProduct.images.length < 5
                                                        ? `Faltan ${5 - newProduct.images.length} imágenes para poder guardar.`
                                                        : '¡Listo! Tienes suficientes imágenes.'}
                                                </small>

                                                <div className="images-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                                                    {newProduct.images && newProduct.images.map((img, index) => (
                                                        <div key={index} className="image-preview-item" style={{ position: 'relative', aspectRatio: '16/9' }}>
                                                            <img
                                                                src={img.url || img}
                                                                alt={`Preview ${index}`}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newImages = [...newProduct.images];
                                                                    newImages.splice(index, 1);
                                                                    setNewProduct({ ...newProduct, images: newImages });
                                                                }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '-8px',
                                                                    right: '-8px',
                                                                    background: '#ff4d4d',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '50%',
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn-primary w-full"
                                            disabled={newProduct.images.length < 5}
                                            style={{ opacity: newProduct.images.length < 5 ? 0.6 : 1, cursor: newProduct.images.length < 5 ? 'not-allowed' : 'pointer' }}
                                        >
                                            {editingProduct ? 'Actualizar' : 'Guardar'}
                                        </button>
                                    </form>
                                )}
                                <div className="data-list">
                                    {products.map(p => (
                                        <div key={p.id} className="data-item">
                                            <div className="item-info">
                                                <Car size={20} color="var(--primary)" />
                                                <div><h3>{p.name}</h3><span className="cat-badge">{p.category?.title}</span></div>
                                            </div>
                                            <div className="actions">
                                                <button className="icon-btn edit" onClick={() => startEditProduct(p)} style={{ color: 'var(--primary)', marginRight: '10px' }}>Editar</button>
                                                <button className="icon-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {activeTab === 'categories' && (
                            <section>
                                <div className="header-row">
                                    <h2>Gestión de Categorías</h2>
                                    {user && user.role?.toUpperCase() === 'ADMIN' && (
                                        <button className="btn-primary" onClick={() => {
                                            setEditingCategory(null);
                                            setNewCategory({ title: '', description: '', urlImage: '' });
                                            setShowCategoryForm(!showCategoryForm);
                                        }}><Plus size={18} /> {showCategoryForm ? 'Cancelar' : 'Nueva Categoría'}</button>
                                    )}
                                </div>
                                {showCategoryForm && user && user.role?.toUpperCase() === 'ADMIN' && (
                                    <form className="admin-form glass" onSubmit={handleAddOrUpdateCategory}>
                                        <h3>{editingCategory ? 'Editar Categoría' : 'Crear Categoría'}</h3>
                                        <div className="form-group">
                                            <label>Título</label>
                                            <input type="text" required value={newCategory.title} onChange={e => setNewCategory({ ...newCategory, title: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Descripción</label>
                                            <input type="text" required value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>URL Imagen</label>
                                            <input type="text" required value={newCategory.urlImage} onChange={e => setNewCategory({ ...newCategory, urlImage: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-primary w-full">{editingCategory ? 'Actualizar' : 'Crear'}</button>
                                    </form>
                                )}
                                <div className="data-list">
                                    {categories.map(c => (
                                        <div key={c.id} className="data-item">
                                            <div className="item-info">
                                                <Layers size={20} color="var(--primary)" />
                                                <div><h3>{c.title}</h3><p>{c.description?.substring(0, 40)}...</p></div>
                                            </div>
                                            <div className="actions">
                                                {user && user.role?.toUpperCase() === 'ADMIN' && (
                                                    <>
                                                        <button className="icon-btn edit" onClick={() => startEditCategory(c)} style={{ color: 'var(--primary)', marginRight: '10px' }}>Editar</button>
                                                        <button
                                                            className={`icon-btn delete ${confirmingDeleteCategoryId === c.id ? 'confirming' : ''}`}
                                                            onClick={() => handleDeleteCategory(c.id)}
                                                            style={confirmingDeleteCategoryId === c.id ? { background: '#ff4d4d', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' } : {}}
                                                        >
                                                            {confirmingDeleteCategoryId === c.id ? '¿Confirma?' : <Trash2 size={18} />}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {activeTab === 'features' && (
                            <section>
                                <div className="header-row">
                                    <h2>Gestión de Características</h2>
                                    <button className="btn-primary" onClick={() => {
                                        setEditingFeature(null);
                                        setNewFeature({ name: '', icon: '', description: '' });
                                        setShowFeatureForm(!showFeatureForm);
                                    }}><Plus size={18} /> {showFeatureForm ? 'Cancelar' : 'Nueva Característica'}</button>
                                </div>
                                {showFeatureForm && (
                                    <form className="admin-form glass" onSubmit={handleAddOrUpdateFeature}>
                                        <h3>{editingFeature ? 'Editar Característica' : 'Crear Característica'}</h3>
                                        <div className="form-group">
                                            <label>Nombre</label>
                                            <input type="text" required value={newFeature.name} onChange={e => setNewFeature({ ...newFeature, name: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Ícono (emoji o texto)</label>
                                            <input type="text" placeholder="ej: 🔥 o fa-wifi" value={newFeature.icon} onChange={e => setNewFeature({ ...newFeature, icon: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Descripción</label>
                                            <input type="text" value={newFeature.description} onChange={e => setNewFeature({ ...newFeature, description: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-primary w-full">{editingFeature ? 'Actualizar' : 'Crear'}</button>
                                    </form>
                                )}
                                <div className="data-list">
                                    {features.map(f => (
                                        <div key={f.id} className="data-item">
                                            <div className="item-info">
                                                <span style={{ fontSize: '1.5rem', minWidth: '32px', textAlign: 'center' }}>{f.icon || '⚡'}</span>
                                                <div>
                                                    <h3>{f.name}</h3>
                                                    {f.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{f.description.substring(0, 60)}{f.description.length > 60 ? '...' : ''}</p>}
                                                </div>
                                            </div>
                                            <div className="actions">
                                                <button className="icon-btn edit" onClick={() => startEditFeature(f)} style={{ color: 'var(--primary)', marginRight: '10px' }}>Editar</button>
                                                <button className="icon-btn delete" onClick={() => handleDeleteFeature(f.id)}><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {activeTab === 'users' && (
                            <section>
                                <div className="header-row">
                                    <h2>Gestión de Usuarios</h2>
                                </div>
                                <div className="data-list">
                                    {users.map(u => (
                                        <div key={u.id} className="data-item">
                                            <div className="item-info">
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                                                    {(u.name?.charAt(0) || '').toUpperCase()}{(u.lastname?.charAt(0) || '').toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3>{u.name} {u.lastname}</h3>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</p>
                                                </div>
                                            </div>
                                            <div className="actions" style={{ gap: '12px', display: 'flex', alignItems: 'center' }}>
                                                <span className="cat-badge" style={{ color: u.role === 'ADMIN' ? '#e67e22' : 'var(--primary)', borderColor: u.role === 'ADMIN' ? '#e67e22' : 'var(--primary)' }}>{u.role}</span>
                                                <select
                                                    value={u.role}
                                                    onChange={e => handleChangeRole(u.id, e.target.value)}
                                                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem', cursor: 'pointer' }}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </div>
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
        .admin-sidebar button { display: flex; align-items: center; gap: 12px; padding: 12px 16px; width: 100%; border-radius: 8px; font-weight: 600; color: var(--text-muted); border: 1px solid transparent; }
        .admin-sidebar button:hover { background: #f0f0ff; color: var(--primary); }
        .admin-sidebar button.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(89, 60, 251, 0.2); }
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
        .actions { display: flex; align-items: center; }
        .icon-btn.edit { font-weight: 600; font-size: 0.9rem; background: none; border: none; cursor: pointer; }
        
        @media (max-width: 768px) {
            .admin-layout { grid-template-columns: 1fr; gap: 20px; }
            .admin-sidebar { margin-bottom: 20px; }
            .sidebar-header { justify-content: center; }
            .admin-sidebar nav { display: flex; gap: 10px; overflow-x: auto; }
            .admin-sidebar button { justify-content: center; white-space: nowrap; }
        }
      `}</style>
        </div>
    );
};

export default Admin;
