import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import '../styles/QuienesSomos.css';

function QuienesSomos() {
    console.log("Página de Quienes Somos");

    return (
        <>
            <Header />
            <Navbar />
            <HeroBanner titulo="Un poco de nosotros..." subtitulo="Conoce la dulce historia de un lugar que entrega alegría y sabor a tus preciados momentos" />
            <main>
                <section className="historia">
                    <h2 className='titulo'>Nuestra Historia ⏳</h2>
                    <p className='parrafo'>
                        <strong>Pastelería Mil Sabores</strong> abrió sus puertas un lluvioso día de septiembre de 1974,
                        cuando Doña Margarita, una apasionada repostera de corazón, decidió convertir su talento familiar
                        en un sueño compartido. Ubicándonos a pasos del histórico Parque Italia en el pintoresco cerro
                        Alegre de Valparaíso, comenzamos siendo una pequeña vitrina donde el aroma a vainilla recién
                        horneada se mezclaba con la brisa marina.
                    </p>

                    <p className='parrafo'>
                        Lo que empezó como un modesto local familiar pronto se convirtió en <strong>referencia porteña</strong>.
                        Nuestro secreto siempre fue simple: <strong>recetas heredadas de abuelas</strong>, ingredientes
                        seleccionados a mano y ese toque de amor que transforma un postre en un recuerdo.
                    </p>

                    <h3 className='subtitulo'>El Momento que Nos Puso en el Libro de los Récords 📚</h3>
                    <p className='parrafo'>
                        El <strong>orgullo más dulce de nuestra trayectoria</strong> llegó en 1995, cuando participamos
                        en la confección de <strong>"La Torta Más Grande del Mundo"</strong>, estableciendo un Récord Guinness.
                        Durante tres días y tres noches, nuestro equipo trabajó incansablemente creando una monumental
                        torta de 15 metros de largo que alimentó a miles de personas y demostró que en Valparaíso,
                        los sueños más grandes sí se pueden hornear.
                    </p>

                    <h3 className='subtitulo'>50 Años Endulzando Momentos 🎂🕰️</h3>
                    <p className='parrafo'>
                        Hoy, después de <strong>cinco décadas</strong>, seguimos en el mismo barrio que nos vio nacer,
                        pero ahora endulzamos <strong>tres generaciones</strong> de familias porteñas. Desde la primera
                        torta de cumpleaños de un niño hasta la celebración de bodas de oro, hemos sido testigos
                        de que <strong>cada momento importante merece un dulce recuerdo</strong>.
                    </p>

                </section>
                <section className="grid-info">
                    <div className="mision">
                        <h2>Nuestra misión</h2>
                        <p className='parrafo'>
                            Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos
                            de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces
                            históricas y fomentamos la creatividad en la repostería.
                        </p>
                    </div>
                    <div className="vision">
                        <h2>Nuestra visión</h2>
                        <p className='parrafo'>
                            Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra
                            innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos
                            talentos en gastronomía.
                        </p>
                    </div>

                </section>
            </main>

            <Footer />

        </>
    );
}

export default QuienesSomos;