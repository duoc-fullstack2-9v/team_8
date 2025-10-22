import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getProductosAdmin, 
  agregarProducto, 
  editarProducto, 
  eliminarProducto, 
  restaurarProductosBase,
  getCategorias 
} from '../services/ProductosService';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    setProductos(getProductosAdmin());
  };

  const categorias = getCategorias();

  const productosFiltrados = filtroCategoria 
    ? productos.filter(p => p.categProd === filtroCategoria)
    : productos;

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const nuevosProductos = eliminarProducto(id);
      setProductos(nuevosProductos);
    }
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const handleRestaurarBase = () => {
    if (window.confirm('¿Restaurar productos originales? Se perderán los cambios.')) {
      const productosBase = restaurarProductosBase();
      setProductos(productosBase);
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('sesionActiva');
    navigate('/');
  };

  return (
    <>
      <Header />
      <Navbar />
      
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>🧁 Panel de Administración - Pastelería Mil Sabores</h1>
          <div className="admin-actions">
            <button onClick={() => navigate('/')} className="btn-secondary">
              ← Volver al Sitio
            </button>
            <button onClick={handleRestaurarBase} className="btn-warning">
              🔄 Restaurar Originales
            </button>
            <button onClick={handleCerrarSesion} className="btn-danger">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="admin-controls">
          <button 
            onClick={() => { setMostrarFormulario(true); setProductoEditando(null); }}
            className="btn-primary"
          >
            ➕ Agregar Producto
          </button>
          
          <select 
            value={filtroCategoria} 
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="filtro-categoria"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <span className="contador-productos">
            📊 {productosFiltrados.length} producto(s)
          </span>
        </div>

        {mostrarFormulario && (
          <ProductoForm 
            producto={productoEditando}
            onSave={(productoData) => {
              if (productoEditando) {
                editarProducto(productoEditando.idProd, productoData);
              } else {
                agregarProducto(productoData);
              }
              cargarProductos();
              setMostrarFormulario(false);
              setProductoEditando(null);
            }}
            onCancel={() => {
              setMostrarFormulario(false);
              setProductoEditando(null);
            }}
          />
        )}

        <div className="productos-grid">
          {productosFiltrados.map(producto => (
            <div key={producto.idProd} className="producto-card-admin">
              <div className="producto-imagen">
                <img src={producto.imagenProd} alt={producto.nombreProd} />
              </div>
              <div className="producto-info">
                <h3>{producto.nombreProd}</h3>
                <p className="categoria-badge">{producto.categProd}</p>
                <p className="descripcion">{producto.descProd}</p>
                <p className="precio">${producto.precioProd.toLocaleString('es-CL')} CLP</p>
              </div>
              <div className="acciones">
                <button 
                  onClick={() => handleEditar(producto)} 
                  className="btn-editar"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleEliminar(producto.idProd)} 
                  className="btn-eliminar"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="sin-productos">
            <p>No hay productos en esta categoría.</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

// Componente Formulario de Producto
const ProductoForm = ({ producto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    categProd: producto?.categProd || '',
    nombreProd: producto?.nombreProd || '',
    descProd: producto?.descProd || '',
    precioProd: producto?.precioProd || '',
    imagenProd: producto?.imagenProd || ''
  });

  const categorias = [
    "Tortas Cuadradas", "Tortas Circulares", "Postres Individuales",
    "Productos Sin Azúcar", "Pastelería Tradicional", "Producto Sin Gluten",
    "Productos Veganos", "Tortas Especiales"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      precioProd: Number(formData.precioProd)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="producto-form">
        <h2>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Categoría:</label>
            <select 
              value={formData.categProd} 
              onChange={(e) => setFormData({...formData, categProd: e.target.value})}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Nombre del producto:</label>
            <input
              type="text"
              placeholder="Ej: Torta de Chocolate Especial"
              value={formData.nombreProd}
              onChange={(e) => setFormData({...formData, nombreProd: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              placeholder="Describe el producto..."
              value={formData.descProd}
              onChange={(e) => setFormData({...formData, descProd: e.target.value})}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Precio (CLP):</label>
            <input
              type="number"
              placeholder="45000"
              value={formData.precioProd}
              onChange={(e) => setFormData({...formData, precioProd: e.target.value})}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>URL de la imagen:</label>
            <input
              type="text"
              placeholder="/src/assets/img/torta-ejemplo.jpg"
              value={formData.imagenProd}
              onChange={(e) => setFormData({...formData, imagenProd: e.target.value})}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              💾 {producto ? 'Actualizar' : 'Crear'} Producto
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;