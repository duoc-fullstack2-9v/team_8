import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const sesionActiva = localStorage.getItem('sesionActiva');

    if (!sesionActiva || userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sesionActiva');
    navigate('/');
  };

  return (
    <>
      <Header />
      <Navbar />

      <main className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-top">
            <h1>Panel de Administración</h1>
            <button
              type="button"
              className="btn-cerrar-sesion"
              onClick={handleCerrarSesion}
            >
              Cerrar Sesión
            </button>
          </div>
          <p>Selecciona una sección para administrar.</p>
        </header>

        <section className="admin-access-grid">
          <div
            className="admin-access-card"
            onClick={() => navigate('/admin/productos')}
          >
            <h2>Productos</h2>
            <p>Gestiona el catálogo de productos de la pastelería.</p>
            <span className="admin-access-link">Ir al mantenedor de productos →</span>
          </div>

          <div
            className="admin-access-card"
            onClick={() => navigate('/admin/usuarios')}
          >
            <h2>Usuarios</h2>
            <p>Administra cuentas, roles y correos de los usuarios.</p>
            <span className="admin-access-link">Ir al mantenedor de usuarios →</span>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AdminDashboard;
