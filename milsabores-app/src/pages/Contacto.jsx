import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import FormularioContacto from '../components/FormContacto';
function Contacto() {
    return (
        <>
            <Header />
            <Navbar />
            <HeroBanner titulo="Contáctanos 📩" subtitulo="¿Tienes alguna consulta? Completa el siguiente formulario y te contactaremos prontamente 😄" />

            <main className="pagina-contacto">
                <div className="contacto-formulario">
                    <FormularioContacto />
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Contacto;