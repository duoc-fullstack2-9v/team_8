import React from "react"
import ProductoCard from "../components/ProductoCard"
import { categoriaProductos } from "../data/Productos"   // 👈 Import correcto

const Catalogo = () => {
  return (
    <div className="catalogo">
      <h1>Catálogo</h1>

      {/* Ejemplo de renderizado de categorías */}
      <section>
        <h2 className="titulo-categoria">🍰 Tortas Cuadradas 🍰</h2>
        <div className="grid">
          {categoriaProductos["Tortas Cuadradas"].map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titulo-categoria">🎂 Tortas Circulares 🎂</h2>
        <div className="grid">
          {categoriaProductos["Tortas Circulares"].map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titulo-categoria">🍮 Postres Individuales 🍮</h2>
        <div className="grid">
          {categoriaProductos["Postres Individuales"].map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titulo-categoria">🧁 Productos Sin Azúcar 🧁</h2>
        <div className="grid">
          {categoriaProductos["Productos Sin Azúcar"].map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titulo-categoria">🥐 Pastelería Tradicional 🥐</h2>
        <div className="grid">
          {categoriaProductos["Pastelería Tradicional"].map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titulo-categoria">🌾 Producto Sin Gluten 🌾</h2>
        <div className="grid">
          {categoriaProductos["Producto Sin Gluten"].map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titulo-categoria">🌱 Productos Veganos 🌱</h2>
        <div className="grid">
          {categoriaProductos["Productos Veganos"].map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titulo-categoria">🎉 Tortas Especiales 🎉</h2>
        <div className="grid">
          {categoriaProductos["Tortas Especiales"].map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Catalogo
