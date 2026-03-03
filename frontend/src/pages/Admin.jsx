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
<<<<<<< HEAD
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', images: [], categoryId: '', price: 95, features: [], imageUrl: '' });
    const [newCategory, setNewCategory] = useState({ title: '', description: '', urlImage: '' });
    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);

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
=======
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
>>>>>>> origin/master

    const fetchData = async () => {
        try {
            setLoading(true);
<<<<<<< HEAD
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(dedupeById(productsRes.data));
            setCategories(dedupeById(categoriesRes.data));
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error al cargar los datos');
=======
            const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
            setProducts(pRes.data);
            setCategories(cRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
>>>>>>> origin/master
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    useEffect(() => {
        if (user && user.role?.toUpperCase() === 'ADMIN') {
            fetchData();
        }
    }, [user]);

    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();
        
        // Validar que haya una imagen
        if (!newProduct.imageUrl || newProduct.imageUrl.trim() === '') {
            alert('Por favor, ingresa una URL de imagen para el auto');
            return;
        }
        
        try {
            const payload = {
                ...newProduct,
                category: { id: newProduct.categoryId },
                images: newProduct.imageUrl ? [{ url: newProduct.imageUrl, title: newProduct.name + ' Main' }] : []
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
=======
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
>>>>>>> origin/master
        }
    };

    const handleDeleteCategory = async (id) => {
<<<<<<< HEAD
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
        try {
            await api.delete(`/categories/${id}`);
            alert('Categoría eliminada con éxito');
            fetchData();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error al eliminar categoría');
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

=======
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

>>>>>>> origin/master
    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-layout">
<<<<<<< HEAD
                    {/* Sidebar code remains same */}
=======
>>>>>>> origin/master
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
<<<<<<< HEAD
                                    <button className="btn-primary" onClick={() => {
                                        setEditingProduct(null);
                                        setNewProduct({ name: '', description: '', images: [], categoryId: '', price: 95, features: [], imageUrl: '' });
                                        setShowProductForm(!showProductForm);
                                    }}><Plus size={18} /> {showProductForm ? 'Cancelar' : 'Nuevo Auto'}</button>
                                </div>
                                {showProductForm && (
                                    <form className="admin-form glass" onSubmit={handleAddOrUpdateProduct}>
                                        <h3>{editingProduct ? 'Editar Producto' : 'Crear Producto'}</h3>
=======
                                    <button className="btn-primary" onClick={() => setShowProductForm(!showProductForm)}><Plus size={18} /> {showProductForm ? 'Cancelar' : 'Nuevo Auto'}</button>
                                </div>
                                {showProductForm && (
                                    <form className="admin-form glass" onSubmit={handleAddProduct}>
>>>>>>> origin/master
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
<<<<<<< HEAD
                                            <div className="form-group">
                                                <label>Descripción</label>
                                                <input type="text" required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Precio</label>
                                                <input type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
                                            </div>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label>URL de Imagen Principal <span style={{ color: '#ff4d4d' }}>*</span></label>
                                                <input 
                                                    type="url" 
                                                    required 
                                                    placeholder="https://ejemplo.com/imagen.jpg" 
                                                    value={newProduct.imageUrl || ''} 
                                                    onChange={e => {
                                                        const imageUrl = e.target.value;
                                                        setNewProduct({ 
                                                            ...newProduct, 
                                                            imageUrl: imageUrl,
                                                            images: imageUrl ? [{ url: imageUrl, title: newProduct.name + ' Main' }] : []
                                                        });
                                                    }} 
                                                />
                                                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                                                    La imagen es obligatoria para crear un auto
                                                </small>
                                                {newProduct.imageUrl && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <img 
                                                            src={newProduct.imageUrl} 
                                                            alt="Vista previa" 
                                                            style={{ 
                                                                width: '100%', 
                                                                maxWidth: '300px', 
                                                                height: '200px', 
                                                                objectFit: 'cover', 
                                                                borderRadius: '8px',
                                                                border: '2px solid var(--border)'
                                                            }} 
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn-primary w-full">{editingProduct ? 'Actualizar' : 'Guardar'}</button>
=======
                                        </div>
                                        <button type="submit" className="btn-primary w-full">Guardar Auto</button>
>>>>>>> origin/master
                                    </form>
                                )}
                                <div className="data-list">
                                    {products.map(p => (
                                        <div key={p.id} className="data-item">
                                            <div className="item-info">
                                                <Car size={20} color="var(--primary)" />
                                                <div><h3>{p.name}</h3><span className="cat-badge">{p.category?.title}</span></div>
                                            </div>
<<<<<<< HEAD
                                            <div className="actions">
                                                <button className="icon-btn edit" onClick={() => startEditProduct(p)} style={{ color: 'var(--primary)', marginRight: '10px' }}>Editar</button>
                                                <button className="icon-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={18} /></button>
                                            </div>
=======
                                            <button className="icon-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={18} /></button>
>>>>>>> origin/master
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section>
                                <div className="header-row">
                                    <h2>Gestión de Categorías</h2>
<<<<<<< HEAD
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
=======
                                    <button className="btn-primary" onClick={() => setShowCategoryForm(!showCategoryForm)}><Plus size={18} /> {showCategoryForm ? 'Cancelar' : 'Nueva Categoría'}</button>
                                </div>
                                {showCategoryForm && (
                                    <form className="admin-form glass" onSubmit={handleAddCategory}>
>>>>>>> origin/master
                                        <div className="form-group">
                                            <label>Título</label>
                                            <input type="text" required value={newCategory.title} onChange={e => setNewCategory({ ...newCategory, title: e.target.value })} />
                                        </div>
                                        <div className="form-group">
<<<<<<< HEAD
                                            <label>Descripción</label>
                                            <input type="text" required value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>URL Imagen</label>
                                            <input type="text" required value={newCategory.urlImage} onChange={e => setNewCategory({ ...newCategory, urlImage: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-primary w-full">{editingCategory ? 'Actualizar' : 'Crear'}</button>
=======
                                            <label>URL Imagen</label>
                                            <input type="text" required value={newCategory.urlImage} onChange={e => setNewCategory({ ...newCategory, urlImage: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-primary w-full">Crear Categoría</button>
>>>>>>> origin/master
                                    </form>
                                )}
                                <div className="data-list">
                                    {categories.map(c => (
                                        <div key={c.id} className="data-item">
                                            <div className="item-info">
                                                <Layers size={20} color="var(--primary)" />
                                                <div><h3>{c.title}</h3><p>{c.description?.substring(0, 40)}...</p></div>
                                            </div>
<<<<<<< HEAD
                                            <div className="actions">
                                                {user && user.role?.toUpperCase() === 'ADMIN' && (
                                                    <>
                                                        <button className="icon-btn edit" onClick={() => startEditCategory(c)} style={{ color: 'var(--primary)', marginRight: '10px' }}>Editar</button>
                                                        <button className="icon-btn delete" onClick={() => handleDeleteCategory(c.id)}><Trash2 size={18} /></button>
                                                    </>
                                                )}
                                            </div>
=======
                                            <button className="icon-btn delete" onClick={() => handleDeleteCategory(c.id)}><Trash2 size={18} /></button>
>>>>>>> origin/master
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
<<<<<<< HEAD
        .admin-sidebar button { display: flex; align-items: center; gap: 12px; padding: 12px 16px; width: 100%; border-radius: 8px; font-weight: 600; color: var(--text-muted); border: 1px solid transparent; }
        .admin-sidebar button:hover { background: #f0f0ff; color: var(--primary); }
        .admin-sidebar button.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(89, 60, 251, 0.2); }
=======
        .admin-sidebar button { display: flex; align-items: center; gap: 12px; padding: 12px 16px; width: 100%; border-radius: 8px; font-weight: 600; color: var(--text-muted); }
        .admin-sidebar button.active { background: var(--primary); color: white; }
>>>>>>> origin/master
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
<<<<<<< HEAD
        .actions { display: flex; align-items: center; }
        .icon-btn.edit { font-weight: 600; font-size: 0.9rem; background: none; border: none; cursor: pointer; }
        
        @media (max-width: 768px) {
            .admin-layout { grid-template-columns: 1fr; gap: 20px; }
            .admin-sidebar { margin-bottom: 20px; }
            .sidebar-header { justify-content: center; }
            .admin-sidebar nav { display: flex; gap: 10px; overflow-x: auto; }
            .admin-sidebar button { justify-content: center; white-space: nowrap; }
        }
=======
>>>>>>> origin/master
      `}</style>
        </div>
    );
};

export default Admin;
