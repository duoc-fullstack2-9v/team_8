import { useCarrito } from '../context/CarritoContext';
import ProductoCard from '../components/ProductoCard';
import { getProductosAdmin, getProductosByCategoria } from '../services/ProductosService';
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

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // Función para cargar productos
  const cargarProductos = () => {
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
    
    return (
      <section className="categoria" key={categoria}>
        <h2 className="titulo-categoria">{emoji} {titulo} {emoji}</h2>
        <div className="grid">
          {categoriaProductos[categoria].map(producto => (
            <ProductoCard
              key={producto.idProd}
              producto={producto}
            />
          ))}
        </div>
      </section>
    );
  };

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
          <button onClick={cargarProductos} className="btn-actualizar">
            🔄 Actualizar
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