import { useCarrito } from '../context/CarritoContext';
import ProductoCard from '../components/ProductoCard';
import { api } from '../services/ProductosService';
import FiltroCategorias from '../components/FiltroCategorias';
import '../styles/Catalogo.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import { useState, useEffect } from 'react';

function Catalogo() {
  const { agregarCarrito, mostrarMensaje, mensajeTexto } = useCarrito();

  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapa de emojis por categoría (opcional, para mantener tu estética 🧁)
  const emojiPorCategoria = {
    'Tortas Cuadradas': '🍰',
    'Tortas Circulares': '🎂',
    'Postres Individuales': '🍪',
    'Productos Sin Azúcar': '🥯',
    'Pastelería Tradicional': '🥐',
    'Producto Sin Gluten': '🥞',
    'Productos Veganos': '🥕',
    'Tortas Especiales': '🧁',
  };

  useEffect(() => {
    cargarProductosDesdeAPI();
  }, []);

  const cargarProductosDesdeAPI = async () => {
    try {
      setLoading(true);
      console.log('Cargando productos desde API...');

      const productosAPI = await api.getProductos();
      console.log('Productos recibidos desde API:', productosAPI);

      setProductos(productosAPI || []);

      // Categorías dinámicas según lo que venga de la API
      const categoriasUnicas = [
        ...new Set((productosAPI || []).map((p) => p.categProd)),
      ];
      setCategorias(categoriasUnicas);

      console.log('Categorías detectadas:', categoriasUnicas);
    } catch (error) {
      console.error('Error cargando productos desde API (con fallback manejado en service):', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar una sección por categoría
  const renderSeccion = (categoria) => {
    if (categoriaFiltro && categoriaFiltro !== categoria) {
      return null;
    }

    const productosCategoria = productos.filter(
      (producto) => producto.categProd === categoria
    );

    if (productosCategoria.length === 0) return null;

    const emoji = emojiPorCategoria[categoria] || '🍰';

    return (
      <section className="categoria" key={categoria}>
        <h2 className="titulo-categoria">
          {emoji} {categoria} {emoji}
        </h2>
        <div className="grid">
          {productosCategoria.map((producto) => (
            <ProductoCard key={producto.idProd} producto={producto} />
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <HeroBanner
          titulo="Catálogo de Productos"
          subtitulo="Descubre nuestra variedad de pasteles y postres artesanales"
        />
        <div className="cargando">
          <p>🔄 Cargando productos desde la base de datos...</p>
        </div>
        <Footer />
      </>
    );
  }

  const hayProductosEnFiltro =
    !categoriaFiltro ||
    productos.some((p) => p.categProd === categoriaFiltro);

  return (
    <>
      <Header />
      <Navbar />
      <HeroBanner
        titulo="Catálogo de Productos"
        subtitulo="Descubre nuestra variedad de pasteles y postres artesanales"
      />

      <main>
        {/* Filtro en el catálogo */}
        <div className="filtro-catalogo-container">
          <FiltroCategorias
            categorias={categorias}
            categoriaSeleccionada={categoriaFiltro}
            onCategoriaChange={setCategoriaFiltro}
            className="filtro-catalogo"
            label="Filtrar productos:"
          />
          <button onClick={cargarProductosDesdeAPI} className="btn-actualizar">
            🔄 Actualizar productos
          </button>
        </div>

        {/* Secciones por categoría */}
        {categorias.map((categoria) => renderSeccion(categoria))}

        {/* Mensaje si el filtro no tiene resultados */}
        {categoriaFiltro && !hayProductosEnFiltro && (
          <div className="sin-resultados">
            <p>No hay productos en la categoría seleccionada.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Catalogo;
