import { Link } from "react-router-dom";
import { useCarrito } from '../hooks/useCarrito.js';
import logo_milsabores from '../assets/img/pasteleria-mil-sabores-logo-1.svg';
import cartIcon from '../assets/img/shopping-cart.svg';
import userIcon from '../assets/img/user-icon.png';

function Header() {
    const { totalItems } = useCarrito();

    return <header>
        <div className="logo-container">
            <Link to="/" className="logo-container">
                <img width="120px" src={logo_milsabores} alt="Logo Pasteleria Mil Sabores"/>
            </Link>
        </div>
        <div className="title">
            <h1>Pastelería Mil Sabores</h1>
            <p>50 años endulzando tus recuerdos</p>
        </div>
        <div className="icons">
            <div className="cart-icon">
                <Link to="/carrito" className="cart-icon">
                    <img src={cartIcon} alt="Logo carrito"/>
                    <span id="cart-count">{totalItems}</span>
                </Link>
            </div>
            <div className="user-icon">
                <Link to="/login" className="user-icon">
                    <img width="50px" src={userIcon} alt="Logo Usuario"/>
                </Link>
            </div>
        </div>
    </header>
}

export default Header;