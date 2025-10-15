import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Login from '../components/Login';
import '../styles/Login-style.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    console.log("Página de Inicio Sesión");

    const navigate = useNavigate();
    const handleNavigate = (destination) => {
        if (destination === 'registro') {
            navigate('/registro_user');
        } 
    };    

    return (
        <>
            <Header />
            <Navbar />

            <Login onNavigate={handleNavigate}/>
            
            <Footer />

        </>
    );
}

export default LoginPage;