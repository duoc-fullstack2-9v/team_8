import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';

function Blog() {
    console.log("Página de Blog");

    return (
        <>
            <Header />
            <Navbar />
            <HeroBanner titulo="Nuestro Blog" subtitulo="Novedades, recetas y más desde Mil Sabores"/>
            <Footer />

        </>
    );
}

export default Blog;