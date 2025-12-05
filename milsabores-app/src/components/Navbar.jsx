import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
        <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
        </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><NavLink to="/inicio" onClick={closeMenu}>Inicio</NavLink></li>
        <li><NavLink to="/quienes_somos" onClick={closeMenu}>Quienes Somos</NavLink></li>
        <li><NavLink to="/catalogo" onClick={closeMenu}>Catálogo</NavLink></li>
        <li><NavLink to="/blog" onClick={closeMenu}>Blog</NavLink></li>
        <li><NavLink to="/contacto" onClick={closeMenu}>Contacto</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
