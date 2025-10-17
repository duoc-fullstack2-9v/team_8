import { useState, useEffect } from 'react'
import Login from './components/Login.jsx'
import Registro from './components/Registro.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Detectar la página actual basado en la URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/registro' || path === '/registro.html') {
      setCurrentPage('registro');
    } else if (path === '/login' || path === '/login.html') {
      setCurrentPage('login');
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Navegación simple
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
  };

  // Renderizar la página actual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'registro':
        return <Registro onNavigate={navigateTo} />;
      case 'login':
        return <Login onNavigate={navigateTo} />;
      default:
        return (
          <div className="home-container">
            <h1>🍰 Pastelería Mil Sabores</h1>
            <p>50 años endulzando tus recuerdos</p>
            <div className="home-buttons">
              <button onClick={() => navigateTo('login')}>
                🔐 Iniciar Sesión
              </button>
              <button onClick={() => navigateTo('registro')}>
                📝 Crear Cuenta
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <div className="App-header">
        <h1>🍰 Pastelería Mil Sabores</h1>
        <p>50 años endulzando tus recuerdos</p>
        <div className="header-buttons">
          <button onClick={() => navigateTo('home')}>
            🏠 Inicio
          </button>
          <button onClick={() => navigateTo('login')}>
            🔐 Login
          </button>
          <button onClick={() => navigateTo('registro')}>
            📝 Registro
          </button>
        </div>
      </div>
      
      {/* Contenido */}
      {renderCurrentPage()}
    </div>
  );
}

export default App
