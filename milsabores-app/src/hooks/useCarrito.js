import { useState, useEffect } from 'react';

export function useCarrito() {
    const [carrito, setCarrito] = useState([]);
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [mensajeTexto, setMensajeTexto] = useState('');

    useEffect(() => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    const mostrarMensajeTemporal = (mensaje) => {
        setMensajeTexto(mensaje);
        setMostrarMensaje(true);
        setTimeout(() => {
            setMostrarMensaje(false);
        }, 3000);
    }

    const agregarCarrito = (producto, cantidad) => {
        setCarrito(prev => {
            const prodExistente = prev.find(item => item.idProd === producto.idProd);
            if (prodExistente) {
                const nuevoCarrito = prev.map(item => 
                    item.idProd === producto.idProd 
                    ? {...item, cantidad: item.cantidad + cantidad}
                : item
            );
            mostrarMensajeTemporal(`✅ Agregaste ${cantidad} más de ${producto.nombreProd}`);
            return nuevoCarrito;
            }

            mostrarMensajeTemporal(`✅ Agregaste ${cantidad} ${producto.nombreProd} al carrito`);
            return [...prev, {...producto, cantidad}];

        });
    };

    const eliminarProducto = (productoId) => {
        setCarrito(prev => prev.filter(item => item.idProd !== productoId));
        mostrarMensajeTemporal('❌ Producto eliminado del carrito');
    }

    const actualizarCantidad = (productoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            eliminarProducto(productoId);
            return;
        }

        setCarrito( prev =>
            prev.map(item =>
                item.idProd === productoId ? { ...item, cantidad: nuevaCantidad } : item
            )
        );
        mostrarMensajeTemporal('✏️ Cantidad actualizada');
    };

    const vaciarCarrito = () => {
        setCarrito([]);
        mostrarMensajeTemporal('🗑️ Carrito vaciado');
    };

    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const totalPagar = carrito.reduce((total, item) => total + item.cantidad * item.precioProd, 0);

    return {
        carrito,
        mostrarMensaje,
        mensajeTexto,
        totalItems,
        totalPagar,
        agregarCarrito,
        eliminarProducto,
        actualizarCantidad,
        vaciarCarrito
    };
}