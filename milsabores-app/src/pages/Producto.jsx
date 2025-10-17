import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../data/productos';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Producto.css';

function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const producto = productos.find(p => p.idProd === parseInt(id));

  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="producto-detalle-overlay">
        <div className="producto-detalle-modal">
          <button className="cerrar-modal" onClick={() => navigate(-1)}>×</button>
          <img src={producto.imagenProd} alt={producto.nombreProd} />
          <h2>{producto.nombreProd}</h2>
          <p className="descripcion">{producto.descProd}</p>
          <p className="precio">${producto.precioProd.toLocaleString('es-CL')} CLP</p>
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