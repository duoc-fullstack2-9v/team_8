import {Link, NavLink} from 'react-router-dom';

function Navbar() {
    return <nav className='navbar'>
        <ul className="nav-links">
            <li><NavLink to="/inicio">Inicio</NavLink></li>
            <li><NavLink to="/quienes_somos">Quienes Somos</NavLink></li>
            <li><NavLink to="/catalogo">Catalogo</NavLink></li>
            <li><NavLink to="/blog">Blog</NavLink></li>
            <li><NavLink to="/contacto">Contacto</NavLink></li>
        </ul>
    </nav>
}

export default Navbar;