import { useCarrito } from '../context/CarritoContext';
import ProductoCard from '../components/ProductoCard';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import { productos } from '../data/productos.js';
import '../styles/Inicio.css';

const productosDestacadosIds = [4, 2, 8, 14, 9, 7];

function Inicio() {
    console.log("Página de Inicio");
    const { agregarCarrito, mostrarMensaje, mensajeTexto } = useCarrito();


    const productosDestacados = productos.filter(producto => productosDestacadosIds.includes(producto.idProd));

    return (
        <>
            <Header />
            <Navbar />
            <HeroBanner titulo="Bienvenidos a Pastelería Mil Sabores" subtitulo="¡Ahora estamos a un paso más cerca de ti!" />
            <main>
                <div className="contenedor">
                    <section className="destacados">
                        <h3>Productos Destacados</h3>
                        <div className="productos">
                            {productosDestacados.map(producto => (
                                <div key={producto.idProd} className="producto">
                                    <ProductoCard
                                        producto={producto}
                                        onAgregarCarrito={agregarCarrito}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <aside className="playlistMensual">
                        <h3>Mil Sabores de: Septiembre 2025 🎶</h3>
                        <p>Playlist mensual curada por nuestro #TeamMilSabores en Valparaíso, Chile.</p>
                        <p>Visita nuestras sucursales ubicadas en la quinta costa, tal vez escuches una de estas canciones...</p>
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
                        >
                        </iframe>
                    </aside>
                </div>
            </main>
            <Footer />

        </>
    );
}

export default Inicio;