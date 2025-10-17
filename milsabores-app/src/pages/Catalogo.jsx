import { useCarrito } from '../context/CarritoContext';
import ProductoCard from '../components/ProductoCard';
import { categoriaProductos } from '../data/productos.js'
import '../styles/Catalogo.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';

function Catalogo() {
  const { agregarCarrito, mostrarMensaje, mensajeTexto } = useCarrito();

  return ( 
    <>
        <Header />
        <Navbar />
        <HeroBanner titulo="Catálogo de Productos" subtitulo="Descubre nuestra variedad de pasteles y posteres artesanales" />

        <main>
        <section className="categoria">
            <h2 className="titulo-categoria">🍰 Tortas Cuadradas 🍰</h2>
            <div className="grid">
            {categoriaProductos["Tortas Cuadradas"].map(producto => (
                <ProductoCard
                key={producto.idProd}
                producto={producto}
                />
            ))}
            </div>
        </section>

        <section className="categoria">
            <h2 className="titulo-categoria">🎂 Tortas Circulares 🎂</h2>
            <div className="grid">
            {categoriaProductos["Tortas Circulares"].map(producto => (
                <ProductoCard
                key={producto.idProd}
                producto={producto}
                />
            ))}
            </div>
        </section>

        <section className="categoria">
            <h2 className="titulo-categoria">🍪 Postres Individuales 🍪</h2>
            <div className="grid">
            {categoriaProductos["Postres Individuales"].map(producto => (
                <ProductoCard
                key={producto.idProd}
                producto={producto}
                />
            ))}
            </div>
        </section>

        <section className="categoria">
            <h2 className="titulo-categoria">🥯 Productos Sin Azúcar 🥯</h2>
            <div className="grid">
            {categoriaProductos["Productos Sin Azúcar"].map(producto => (
                <ProductoCard
                key={producto.idProd}
                producto={producto}
                />
            ))}
            </div>
        </section>

        <section className="categoria">
            <h2 className="titulo-categoria">🥐 Pastelería Tradicional 🥐</h2>
            <div className="grid">
            {categoriaProductos["Pastelería Tradicional"].map(producto => (
                <ProductoCard
                key={producto.idProd}
                producto={producto}
                />
            ))}
            </div>
        </section>

        <section className="categoria">
            <h2 className="titulo-categoria">🥞 Producto Sin Gluten 🥞</h2>
            <div className="grid">
            {categoriaProductos["Producto Sin Gluten"].map(producto => (
                <ProductoCard
                key={producto.idProd}
                producto={producto}
                />
            ))}
            </div>
        </section>

        <section className="categoria">
            <h2 className="titulo-categoria">🥕 Productos Veganos 🥕</h2>
            <div className="grid">
            {categoriaProductos["Productos Veganos"].map(producto => (
                <ProductoCard
                key={producto.idProd}
                producto={producto}
                />
            ))}
            </div>
        </section>

        <section className="categoria">
            <h2 className="titulo-categoria">🧁 Tortas Especiales 🧁</h2>
            <div className="grid">
            {categoriaProductos["Tortas Especiales"].map(producto => (
                <ProductoCard
                key={producto.idProd}
                producto={producto}
                />
            ))}
            </div>
        </section>

        {/* Mensaje flotante global */}
        <div id="mensaje-flotante" className={`mensaje-flotante ${mostrarMensaje ? 'mostrar' : ''}`}>
            {mensajeTexto}
        </div>
        </main>

        <Footer />
    </>    
  );
}

export default Catalogo;