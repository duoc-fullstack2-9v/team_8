import instagramLogo from '../assets/img/instagram-logo-glyph.svg';
import tiktokLogo from '../assets/img/logo-tiktok.svg';
import whatsappLogo from '../assets/img/whatsapp-glyph-black-logo.svg';

function Footer() {
    return <footer>
        <p>&copy; 2024 Pastelería 1000 Sabores. Todos los derechos reservados.</p>
        <p><a href="#">Políticas de Privacidad</a> | <a href="#">Términos y Condiciones</a></p>
        <p>Síguenos en redes sociales</p>
        <div className="rrss-icono">
        <img width="20px" src={instagramLogo} alt="Instagram" />
        <img width="20px" src={tiktokLogo} alt="TikTok" />
        <img width="20px" src={whatsappLogo} alt="WhatsApp" />
        </div>
    </footer>
}

export default Footer;