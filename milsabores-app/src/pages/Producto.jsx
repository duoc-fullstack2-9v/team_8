import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/ProductosService';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Producto.css';

function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);
        console.log(`🔎 Cargando producto ${id} desde API...`);

        const productoAPI = await api.getProductoById(id);
        console.log('✅ Producto recibido:', productoAPI);

        setProducto(productoAPI || null);
      } catch (error) {
        console.error('❌ Error cargando producto:', error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="producto-detalle-overlay">
          <div className="producto-detalle-modal">
            <p>🔄 Cargando producto...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!producto) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="producto-detalle-overlay">
          <div className="producto-detalle-modal">
            <button className="cerrar-modal" onClick={() => navigate(-1)}>
              ×
            </button>
            <h2>Producto no encontrado</h2>
            <button className="btn-volver" onClick={() => navigate(-1)}>
              Volver al catálogo
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="producto-detalle-overlay">
        <div className="producto-detalle-modal">
          <button className="cerrar-modal" onClick={() => navigate(-1)}>
            ×
          </button>
          <img src={producto.imagenProd} alt={producto.nombreProd} />
          <h2>{producto.nombreProd}</h2>
          <p className="descripcion">{producto.descProd}</p>
          <p className="precio">
            ${producto.precioProd.toLocaleString('es-CL')} CLP
          </p>
          <button className="btn-volver" onClick={() => navigate(-1)}>
            Volver al catálogo
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Producto;
