import { useCarrito } from '../context/CarritoContext';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import '../styles/Carrito.css';

function Carrito() {
    const {
        carrito,
        totalPagar,
        eliminarProducto,
        actualizarCantidad,
        vaciarCarrito,
        mostrarMensaje,
        mensajeTexto
    } = useCarrito();

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
                            <p>No hay productos en el carrito.</p>
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
                            <button className="vaciar" onClick={vaciarCarrito}>
                                Vaciar carrito
                            </button>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Carrito;