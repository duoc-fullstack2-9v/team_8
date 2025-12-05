import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import '../styles/Blog.css';
import tortaVegana from '../assets/img/torta-vegana-de-chocolate.jpg';
import equipoMilSabores from '../assets/img/equipo-mil-sabores.png';

function Blog() {
    console.log("Página de Blog");

    const entradasBlog = [
        {
            id: 1,
            titulo: "Receta de la Semana: Torta Casera de Chocolate",
            descripcion: "Con pocos ingredientes y mucho sabor: aprende a preparar una torta de chocolate casera inolvidable.",
            imagen: tortaVegana,
            categoria: "vegana",
            enlace: "#"
        },
        {
            id: 2,
            titulo: "Pastelería Mil Sabores obtuvo el 3er Lugar en la Competencia Regional de Pastelería Tradicional",
            descripcion: "Porque no solo se trata de ganar, sino de dejar huella: nuestra receta conquistó al jurado.",
            imagen: equipoMilSabores,
            categoria: "premio",
            enlace: "#"
        }
    ];

    const handleLeerMas = (entradaId) => {
        console.log(`Navegando a entrada del blog: ${entradaId}`);
    };

    return (
        <>
            <Header />
            <Navbar />
            <HeroBanner 
                titulo="Nuestro Blog" 
                subtitulo="Novedades, recetas y más desde Mil Sabores"
            />
            
            <main className="blog-container">
                <div className="blog-grid">
                    {entradasBlog.map(entrada => (
                        <article 
                            key={entrada.id} 
                            className={`entrada-blog ${entrada.categoria}`}
                        >
                            <img 
                                src={entrada.imagen} 
                                alt={entrada.titulo}
                                className="entrada-imagen"
                            />
                            <h2 className="titulo-entrada">{entrada.titulo}</h2>
                            <p className="descripcion-entrada">{entrada.descripcion}</p>
                            <button 
                                className="boton-leer-mas"
                                onClick={() => handleLeerMas(entrada.id)}
                            >
                                Leer más
                            </button>
                        </article>
                    ))}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Blog;