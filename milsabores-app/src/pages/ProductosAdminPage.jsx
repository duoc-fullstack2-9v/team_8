import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminProductosApi } from '../services/ProductosService';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FiltroCategorias from '../components/FiltroCategorias';
import ProductoForm from '../components/ProductoForm';
import '../styles/AdminDashboard.css';

const ProductosAdminDashboard = () => {
  const navigate = useNavigate();

  // ===== PROTECCIÓN DE RUTA =====
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      alert('Acceso denegado. Solo administradores pueden acceder.');
      navigate('/login');
    }
  }, [navigate]);

  // ===== ESTADOS =====
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // ===== CARGAR PRODUCTOS DESDE API =====
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const productosAPI = await adminProductosApi.getAll();
      setProductos(productosAPI);
    } catch (error) {
      console.error('Error al cargar productos desde API:', error);
      alert('No se pudieron cargar los productos desde la base de datos.');
    } finally {
      setCargando(false);
    }
  };

  // ===== CATEGORÍAS DINÁMICAS =====
  const categorias = [...new Set(productos.map((p) => p.categProd))];

  const productosFiltrados = filtroCategoria
    ? productos.filter((p) => p.categProd === filtroCategoria)
    : productos;

  // ===== CRUD =====
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await adminProductosApi.remove(id);
      await cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto.');
    }
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sesionActiva');
    navigate('/');
  };

  const handleVolver = () => navigate('/admin_dashboard');

  // ===== RENDER =====
  return (
    <>
      <Header />
      <Navbar />

      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>🧁 Panel de Administración - Productos</h1>
          <div className="admin-actions">
            <button onClick={handleVolver} className="btn-secondary">
              ← Volver al Dashboard
            </button>
            <button onClick={handleCerrarSesion} className="btn-danger">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="admin-controls">
          <button
            onClick={() => {
              setMostrarFormulario(true);
              setProductoEditando(null);
            }}
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

        {cargando && (
          <div className="sin-productos">
            <p>🔄 Cargando productos desde la base de datos...</p>
          </div>
        )}

        {mostrarFormulario && (
          <ProductoForm
            producto={productoEditando}
            onSave={async (productoData) => {
              try {
                if (productoEditando) {
                  await adminProductosApi.update(productoEditando.idProd, productoData);
                } else {
                  await adminProductosApi.create(productoData);
                }

                await cargarProductos();
                setMostrarFormulario(false);
                setProductoEditando(null);
              } catch (error) {
                console.error('Error al guardar producto:', error);
                alert('No se pudo guardar el producto.');
              }
            }}
            onCancel={() => {
              setMostrarFormulario(false);
              setProductoEditando(null);
            }}
          />
        )}

        <div className="productos-grid">
          {productosFiltrados.map((producto) => (
            <div key={producto.idProd} className="producto-card-admin">
              <div className="producto-imagen">
                <img src={producto.imagenProd} alt={producto.nombreProd} />
              </div>
              <div className="producto-info">
                <h3>{producto.nombreProd}</h3>
                <p className="categoria-badge">{producto.categProd}</p>
                <p className="Descripcion">{producto.descProd}</p>
                <p className="precio">
                  ${producto.precioProd.toLocaleString('es-CL')} CLP
                </p>
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

        {!cargando && productosFiltrados.length === 0 && (
          <div className="sin-productos">
            <p>No hay productos en esta categoría.</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProductosAdminDashboard;
