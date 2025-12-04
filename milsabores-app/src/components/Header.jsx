import { useCarrito } from '../context/CarritoContext';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo_milsabores from '../assets/img/pasteleria-mil-sabores-logo-1.svg';
import cartIcon from '../assets/img/shopping-cart.svg';
import userIcon from '../assets/img/user-icon.png';

function Header() {
  const { totalItems, carrito } = useCarrito();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  console.log('CARRITO EN HEADER:', carrito);
  console.log('TOTAL ITEMS EN HEADER:', totalItems);

  // 🔐 Datos de sesión guardados en localStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');          // 'admin' o 'user'
  const userName = localStorage.getItem('userName') 
                || localStorage.getItem('sesionActiva');      // fallback al correo
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('userName');
    setMenuAbierto(false);
    navigate('/');
  };

  const handleClickPerfil = () => {
    setMenuAbierto(false);
    // TODO: cuando tengas vista de perfil, ajusta esta ruta
    navigate('/perfil'); 
  };

  const handleClickAdmin = () => {
    setMenuAbierto(false);
    navigate('/admin_dashboard');
  };

  return (
    <header>
      <div className="logo-container">
        <Link to="/" className="logo-container">
          <img width="120px" src={logo_milsabores} alt="Logo Pastelería Mil Sabores" />
        </Link>
      </div>

      <div className="title">
        <Link to="/">
          <h1>Pastelería Mil Sabores</h1>
          <p>50 años endulzando tus recuerdos</p>
        </Link>
      </div>

      <div className="icons">
        <div className="cart-icon">
          <Link to="/carrito" className="cart-icon">
            <img src={cartIcon} alt="Logo carrito" />
            <span id="cart-count">{totalItems}</span>
          </Link>
        </div>

        {!isLoggedIn ? (
          <div className="user-icon">
            <Link to="/login" className="user-icon-link">
              <img width="50px" src={userIcon} alt="Logo Usuario" />
              <span className="user-label">Iniciar sesión</span>
            </Link>
          </div>
        ) : (
          <div className="user-menu-container">
            <button
              type="button"
              className="user-menu-trigger"
              onClick={() => setMenuAbierto((prev) => !prev)}
            >
              <img width="40px" src={userIcon} alt="Logo Usuario" />
              <span className="user-label">
                Hola, {userName || 'usuario'}
              </span>
            </button>

            {menuAbierto && (
              <div className="user-menu-dropdown">
                <button
                  type="button"
                  className="user-menu-item"
                  onClick={handleClickPerfil}
                >
                  Mi perfil
                </button>

                {userRole === 'admin' && (
                  <button
                    type="button"
                    className="user-menu-item"
                    onClick={handleClickAdmin}
                  >
                    Panel de administración
                  </button>
                )}

                <button
                  type="button"
                  className="user-menu-item user-menu-logout"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
