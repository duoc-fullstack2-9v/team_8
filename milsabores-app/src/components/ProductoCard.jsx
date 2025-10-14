import { useState } from 'react';

function ProductoCard({ producto, onAgregarCarrito}) {
    const [cantidad, setCantidad] = useState(0);
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    const handleAgregar = () => {
        if (cantidad > 0) {
            onAgregarCarrito(producto, cantidad);
            setCantidad(0);
        } else {
            setMostrarMensaje(true);
            setTimeout(() => setMostrarMensaje(false), 2000);
        }
    };

    const aumentarCantidad = () => {
        setCantidad(prev => prev +1);
    };

    const disminuirCantidad = () => {
        setCantidad(prev => Math.max(0, prev -1)); 
    };

    return (
        <div className = "card">
            <img src={producto.imagenProd} alt={producto.nombreProd} onError={(e) => { e.target.src = '/src/assets/img/placeholder.jpg'; }}/>
            <h3>{producto.nombreProd}</h3>
            <p className="descripcion">{producto.descProd}</p>
            <p className="precio">${producto.precioProd.toLocaleString('es-CL')} CLP</p>

                <div className="control-cantidad">
                    <button className="btn-menos" onClick={disminuirCantidad} aria-label="Disminuir cantidad" disabled={cantidad === 0}>-</button>
                    <span className="num">{cantidad}</span>
                    <button className="btn-mas" onClick={aumentarCantidad} aria-label="Aumentar cantidad">+</button>
                </div>
                <button className="agregar" onClick={handleAgregar}>Agregar al Carrito</button>
  
            <div id="mensaje-flotante" className={`mensaje-flotante ${mostrarMensaje ? 'mostrar' : ''}`}>
                ⚠️ Selecciona al menos 1 unidad
            </div>
        </div>
    );

}

export default ProductoCard;