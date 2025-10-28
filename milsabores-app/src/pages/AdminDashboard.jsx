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
import FiltroCategorias from '../components/FiltroCategorias'; 
import ProductoForm from '../components/ProductoForm'; 
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      alert('Acceso denegado. Solo administradores pueden acceder.');
      navigate('/login');
    }
  }, [navigate]);

  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');

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
          
          <FiltroCategorias 
            categorias={categorias}
            categoriaSeleccionada={filtroCategoria}
            onCategoriaChange={setFiltroCategoria}
            className="filtro-dashboard"
          />

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


export default AdminDashboard;