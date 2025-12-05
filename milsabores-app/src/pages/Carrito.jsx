import { useCarrito } from '../context/CarritoContext';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Carrito.css';

function Carrito() {
    const {
        carrito,
        totalPagar,
        eliminarProducto,
        actualizarCantidad,
        vaciarCarrito
    } = useCarrito();
    
    const navigate = useNavigate(); 

    const aumentar = (idProd) => {
        const producto = carrito.find(item => item.idProd === idProd);
        if (producto) {
            actualizarCantidad(idProd, producto.cantidad + 1);
        }
    };

    const disminuir = (idProd) => {
        const producto = carrito.find(item => item.idProd === idProd);
        if (producto) {
            actualizarCantidad(idProd, producto.cantidad - 1);
        }
    };

    return (
        <>
            <Header />
            <Navbar />
            <HeroBanner titulo="Carrito de Compras" subtitulo="Revisa y gestiona tus productos seleccionados" />

            <main className='carrito-main'>
                <div className="carrito-container">
                    <div id="carrito-contenido">
                        {carrito.length === 0 ? (
                            <div className="carrito-vacio">
                                <p>🛒 Tu carrito está vacío</p>
                                <p>¡Descubre nuestros deliciosos productos!</p>
                                <button 
                                    className="btn-seguir-comprando"
                                    onClick={() => navigate('/catalogo')}
                                >
                                    🍰 Seguir Comprando
                                </button>
                            </div>
                        ) : (
                            carrito.map((item) => (
                                <div key={item.idProd} className="item-carrito">
                                    <img src={item.imagenProd} alt={item.nombreProd} />
                                    <div className="info">
                                        <h3>{item.nombreProd}</h3>
                                        <p>Cantidad: {item.cantidad}</p>
                                        <p>SubTotal: ${(item.precioProd * item.cantidad).toLocaleString('es-CL')} CLP</p>
                                    </div>
                                    <div className="acciones">
                                        <button onClick={() => disminuir(item.idProd)}>-1</button>
                                        <button onClick={() => eliminarProducto(item.idProd)}>Eliminar</button>
                                        <button onClick={() => aumentar(item.idProd)}>+1</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {carrito.length > 0 && (
                        <>
                            <p className="total">TOTAL: ${totalPagar.toLocaleString('es-CL')} CLP</p>
                            <div className="acciones-finales">
                                <button className="vaciar" onClick={vaciarCarrito}>
                                    🗑️ Vaciar carrito
                                </button>
                                <button 
                                    className="btn-seguir-comprando"
                                    onClick={() => navigate('/catalogo')}
                                >
                                    🛍️ Seguir Comprando
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Carrito;