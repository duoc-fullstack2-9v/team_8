import { useCarrito } from '../context/CarritoContext';
import ProductoCard from '../components/ProductoCard';
import { getProductosByCategoria, api } from '../services/ProductosService';
import FiltroCategorias from '../components/FiltroCategorias'; 
import '../styles/Catalogo.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import { useState, useEffect } from 'react';

function Catalogo() {
  const { agregarCarrito, mostrarMensaje, mensajeTexto } = useCarrito();
  
  // Estado para el filtro
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [categoriaProductos, setCategoriaProductos] = useState({
    "Tortas Cuadradas": [],
    "Tortas Circulares": [],
    "Postres Individuales": [],
    "Productos Sin Azúcar": [],
    "Pastelería Tradicional": [],
    "Producto Sin Gluten": [],
    "Productos Veganos": [],
    "Tortas Especiales": []
  });
  const [loading, setLoading] = useState(true);

  // Cargar productos desde la API al montar el componente
  useEffect(() => {
    cargarProductosDesdeAPI();
  }, []);

  // Función para cargar productos desde la API
  const cargarProductosDesdeAPI = async () => {
    try {
      setLoading(true);
      console.log('Cargando productos desde API...');
      
      // Obtener todos los productos de la API
      const productosAPI = await api.getProductos();
      console.log('Productos recibidos desde API:', productosAPI);

      if(productosAPI && productosAPI.length > 0) {
        // Agrupar por categorías solo usando datos API
        const categoriasAgrupadas = {
          "Tortas Cuadradas": productosAPI.filter(p => p.categProd === "Tortas Cuadradas"),
          "Tortas Circulares": productosAPI.filter(p => p.categProd === "Tortas Circulares"),
          "Postres Individuales": productosAPI.filter(p => p.categProd === "Postres Individuales"),
          "Productos Sin Azúcar": productosAPI.filter(p => p.categProd === "Productos Sin Azúcar"),
          "Pastelería Tradicional": productosAPI.filter(p => p.categProd === "Pastelería Tradicional"),
          "Producto Sin Gluten": productosAPI.filter(p => p.categProd === "Producto Sin Gluten"),
          "Productos Veganos": productosAPI.filter(p => p.categProd === "Productos Veganos"),
          "Tortas Especiales": productosAPI.filter(p => p.categProd === "Tortas Especiales")
        };

        setCategoriaProductos(categoriasAgrupadas);
        console.log('Productos agrupados por categoría desde API:', categoriasAgrupadas);
      } else {
        // Solo si la API falla completamente, usar datos locales
        console.log('API devolvió datos vacíos, usando datos locales');
        cargarProductosLocales();
      }      
    } catch (error) {
      console.error('Error cargando productos desde API:', error);
      // Fallback a datos locales
      console.log('Usando datos locales como fallback...');
      cargarProductosLocales();
    } finally {
      setLoading(false);
    }
  };

  // Función fallback para cargar productos locales
  const cargarProductosLocales = () => {
    setCategoriaProductos({
      "Tortas Cuadradas": getProductosByCategoria("Tortas Cuadradas"),
      "Tortas Circulares": getProductosByCategoria("Tortas Circulares"), 
      "Postres Individuales": getProductosByCategoria("Postres Individuales"),
      "Productos Sin Azúcar": getProductosByCategoria("Productos Sin Azúcar"),
      "Pastelería Tradicional": getProductosByCategoria("Pastelería Tradicional"),
      "Producto Sin Gluten": getProductosByCategoria("Producto Sin Gluten"),
      "Productos Veganos": getProductosByCategoria("Productos Veganos"),
      "Tortas Especiales": getProductosByCategoria("Tortas Especiales")
    });
  };

  // Función para renderizar sección condicionalmente
  const renderSeccion = (categoria, titulo, emoji) => {
    if (categoriaFiltro && categoriaFiltro !== categoria) {
      return null;
    }
    
    const productosCategoria = categoriaProductos[categoria] || [];
    
    return (
      <section className="categoria" key={categoria}>
        <h2 className="titulo-categoria">{emoji} {titulo} {emoji}</h2>
        <div className="grid">
          {productosCategoria.map(producto => (
            <ProductoCard
              key={producto.idProd}
              producto={producto}
            />
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
        <HeroBanner titulo="Catálogo de Productos" subtitulo="Descubre nuestra variedad de pasteles y posteres artesanales" />
        <div className="cargando">
          <p>🔄 Cargando productos desde la base de datos...</p>
        </div>
        <Footer />
      </>
    );
  }

  return ( 
    <>
      <Header />
      <Navbar />
      <HeroBanner titulo="Catálogo de Productos" subtitulo="Descubre nuestra variedad de pasteles y posteres artesanales" />

      <main>
        {/* ✅ Filtro en el catálogo */}
        <div className="filtro-catalogo-container">
          <FiltroCategorias 
            categorias={Object.keys(categoriaProductos)}
            categoriaSeleccionada={categoriaFiltro}
            onCategoriaChange={setCategoriaFiltro}
            className="filtro-catalogo"
            label="Filtrar productos:"
          />
          <button onClick={cargarProductosDesdeAPI} className="btn-actualizar">
            🔄 Actualizar productos
          </button>
        </div>

        {renderSeccion("Tortas Cuadradas", "Tortas Cuadradas", "🍰")}
        {renderSeccion("Tortas Circulares", "Tortas Circulares", "🎂")}
        {renderSeccion("Postres Individuales", "Postres Individuales", "🍪")}
        {renderSeccion("Productos Sin Azúcar", "Productos Sin Azúcar", "🥯")}
        {renderSeccion("Pastelería Tradicional", "Pastelería Tradicional", "🥐")}
        {renderSeccion("Producto Sin Gluten", "Producto Sin Gluten", "🥞")}
        {renderSeccion("Productos Veganos", "Productos Veganos", "🥕")}
        {renderSeccion("Tortas Especiales", "Tortas Especiales", "🧁")}

        {categoriaFiltro && categoriaProductos[categoriaFiltro]?.length === 0 && (
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