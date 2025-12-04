import { useCarrito } from '../context/CarritoContext';
import ProductoCard from '../components/ProductoCard';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import { api } from '../services/ProductosService'; 
import '../styles/Inicio.css';
import '../styles/Catalogo.css';
import { useState, useEffect } from 'react';

function Inicio() {
  console.log("Página de Inicio");
  const { agregarCarrito, mostrarMensaje, mensajeTexto } = useCarrito();

  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductosDestacados = async () => {
      try {
        setLoading(true);
        console.log('🎯 Cargando productos destacados desde API (con fallback en service)...');
        
        // 👉 Este getProductos YA hace fallback a productosLocales si la API falla
        const todosLosProductos = await api.getProductos();
        console.log('📦 Total productos recibidos:', todosLosProductos.length);
        
        const destacados = todosLosProductos.filter(
          (producto) => producto.productoDestacado === true
        );

        console.log('⭐ Productos destacados encontrados:', destacados.length);
        console.log('🏷️ IDs de productos destacados:', destacados.map((p) => p.idProd));
        
        setProductosDestacados(destacados);
      } catch (error) {
        console.error('❌ Error inesperado cargando productos destacados:', error);
        setProductosDestacados([]);
      } finally {
        setLoading(false);
      }
    };

    cargarProductosDestacados();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <HeroBanner
          titulo="Bienvenidos a Pastelería Mil Sabores"
          subtitulo="¡Ahora estamos a un paso más cerca de ti!"
        />
        <div className="cargando">
          <p>🔄 Cargando productos destacados...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <HeroBanner
        titulo="Bienvenidos a Pastelería Mil Sabores"
        subtitulo="¡Ahora estamos a un paso más cerca de ti!"
      />
      <main>
        <div className="contenedor">
          <section className="destacados">
            <h3>Productos Destacados</h3>
            <div className="productos">
              {productosDestacados.map((producto) => (
                <div key={producto.idProd} className="producto">
                  <ProductoCard
                    producto={producto}
                    onAgregarCarrito={agregarCarrito}
                  />
                </div>
              ))}
            </div>

            {productosDestacados.length === 0 && (
              <div className="sin-destacados">
                <p>No hay productos destacados en este momento.</p>
              </div>
            )}
          </section>

          <aside className="playlistMensual">
            <h3>Mil Sabores de: Septiembre 2025 🎶</h3>
            <p>Playlist mensual curada por nuestro #TeamMilSabores en Valparaíso, Chile.</p>
            <p>
              Visita nuestras sucursales ubicadas en la quinta costa, tal vez escuches una de estas canciones...
            </p>
            <iframe
              data-testid="embed-iframe"
              style={{ marginTop: '30px', borderRadius: '12px' }}
              src="https://open.spotify.com/embed/playlist/0zu1O3HiwPYjV2hy9xHYOm?utm_source=generator"
              width="390px"
              height="450px"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Playlist Spotify Mil Sabores"
            />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Inicio;
