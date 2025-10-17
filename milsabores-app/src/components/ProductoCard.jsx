import { useCarrito } from '../context/CarritoContext';
import { useState } from 'react';
import missingImage from '../assets/img/missing-image-1.png'
import { useNavigate } from 'react-router-dom';

function ProductoCard({ producto }) {
    const [cantidad, setCantidad] = useState(0);
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const { agregarCarrito, mostrarMensajeTemporal } = useCarrito();
    const navigate = useNavigate();

    const verDetalleProd = () => {
        navigate(`/producto/${producto.idProd}`);
    }

    const handleAgregar = () => {
        console.log(`Intentando agregar ${cantidad} de ${producto.nombreProd} al carrito`);
        if (cantidad > 0) {
            console.log('EJECUTANDO agregarCarrito...')
            agregarCarrito(producto, cantidad);
            setCantidad(0);
        } else {
            console.log('CANTIDAD CERO - MOSTRANDO MENSAJE');
            mostrarMensajeTemporal('⚠️ Selecciona al menos 1 unidad');
        }
    };

    const aumentarCantidad = () => {
        setCantidad(prev => prev +1);
    };

    const disminuirCantidad = () => {
        setCantidad(prev => Math.max(0, prev -1)); 
    };

    return (
        <div className='card'>
            <div className='imagen-container' onClick={verDetalleProd} style={{ cursor: 'pointer' }}>
                <img src={producto.imagenProd} alt={producto.nombreProd} onError={(e) => { e.target.src = missingImage; }}/>
                <div className='overlay-imagen'>
                    <span>Ver detalles</span>
                </div>
            </div>
            <h3>{producto.nombreProd}</h3>

            <p className="descripcion">
                {producto.descProd.lenght > 100
                    ? `${producto.descProd.substring(0, 100)}...`
                    : producto.descProd
                }
            </p>
            <p className='precio'>${producto.precioProd.toLocaleString('es-CL')} CLP</p>

            <div className="control-cantidad">
                <button className="btn-menos" onClick={disminuirCantidad} aria-label="Disminuir cantidad" disabled={cantidad === 0}>-</button>
                <span className="num">{cantidad}</span>
                <button className="btn-mas" onClick={aumentarCantidad} aria-label="Aumentar cantidad">+</button>
            </div>
            <button className="agregar" onClick={handleAgregar}>Agregar al Carrito</button>

        </div>
    );

}

export default ProductoCard;