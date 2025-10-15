function HeroBanner(props) {
    return <section className="hero">
        <h2>{props.titulo}</h2>
        <p>{props.subtitulo}</p>
    </section>
}

export default HeroBanner;