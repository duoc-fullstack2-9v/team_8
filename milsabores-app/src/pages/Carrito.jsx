import React from "react"
import { useCarrito } from "../context/CarritoContext"

const Carrito = () => {
  const { carrito, vaciarCarrito, totalPagar } = useCarrito()

  return (
    <>
      <section className="hero">
        <h2>Carrito de Compras</h2>
        <p>Revisa y gestiona tus productos seleccionados</p>
      </section>

      <main className="carrito-main">
        <div className="carrito-container">
          <div id="carrito-contenido">
            {carrito.length === 0 ? (
              <p>No hay productos en el carrito.</p>
            ) : (
              carrito.map((producto) => (
                <div className="item-carrito" key={producto.id}>
                  <img alt={producto.nombreProd} />
                  <div className="info">
                    <h3>{producto.nombreProd}</h3>
                    <p>Cantidad: {producto.cantidad}</p>
                    <p>
                      SubTotal: ${producto.precio * producto.cantidad} CLP
                    </p>
                  </div>
                  <div className="acciones">
                    <button>-1</button>
                    <button>Eliminar</button>
                    <button>+1</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {carrito.length > 0 && (
            <>
              <p className="total">
                TOTAL: ${totalPagar.toLocaleString("es-CL")} CLP
              </p>
              <button className="vaciar" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default Carrito
