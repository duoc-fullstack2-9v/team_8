import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Registro from '../components/Registro';
import '../styles/RegistroUser.css';
import { useNavigate } from 'react-router-dom';

function RegistroUser() {
    console.log("Página de Registro de Usuarios");

    const navigate = useNavigate();

    const handleNavigate = (destination) => {
        if (destination === 'login-page') {
            navigate('/login');
        }
    };

    return (
        <>
            <Header />
            <Navbar />

            <Registro onNavigate={handleNavigate} />

            <Footer />

        </>
    );
}

export default RegistroUser;