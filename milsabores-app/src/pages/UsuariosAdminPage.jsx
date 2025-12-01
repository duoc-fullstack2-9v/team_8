// src/pages/UsuariosAdminPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from '../services/UsuariosService';
import '../styles/AdminDashboard.css';

const UsuariosAdminPage = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formUsuario, setFormUsuario] = useState({
    nombreUsuario: '',
    apellidoUsuario: '',
    emailUsuario: '',
    passwordUsuario: '',
    rolUsuario: 'CLIENTE',
  });

  // ---- Control de sesión (mismo patrón que el dashboard) ----
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const sesionActiva = localStorage.getItem('sesionActiva');

    if (!sesionActiva || userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios', error);
      alert('No se pudieron cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setFormUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();

    if (
      !formUsuario.nombreUsuario ||
      !formUsuario.apellidoUsuario ||
      !formUsuario.emailUsuario ||
      !formUsuario.passwordUsuario
    ) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (usuarioEditando) {
        await actualizarUsuario(usuarioEditando.idUsuario, formUsuario);
      } else {
        await crearUsuario(formUsuario);
      }
      setUsuarioEditando(null);
      setFormUsuario({
        nombreUsuario: '',
        apellidoUsuario: '',
        emailUsuario: '',
        passwordUsuario: '',
        rolUsuario: 'CLIENTE',
      });
      await cargarUsuarios();
    } catch (error) {
      console.error('Error al guardar usuario', error);
      alert('Hubo un error al guardar el usuario.');
    }
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setFormUsuario({
      nombreUsuario: usuario.nombreUsuario,
      apellidoUsuario: usuario.apellidoUsuario,
      emailUsuario: usuario.emailUsuario,
      passwordUsuario: '', // tu API no devuelve password
      rolUsuario: usuario.rolUsuario,
    });
  };

  const handleEliminarUsuario = async (usuario) => {
    if (!window.confirm(`¿Eliminar al usuario "${usuario.nombreUsuario}"?`)) return;

    try {
      await eliminarUsuario(usuario.idUsuario);
      await cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario', error);
      alert('Hubo un error al eliminar el usuario.');
    }
  };

  const handleCancelarEdicion = () => {
    setUsuarioEditando(null);
    setFormUsuario({
      nombreUsuario: '',
      apellidoUsuario: '',
      emailUsuario: '',
      passwordUsuario: '',
      rolUsuario: 'CLIENTE',
    });
  };

  return (
    <>
      <Header />
      <Navbar />

      <main className="admin-dashboard">
        <div className="admin-header">
          <h1>👥 Mantenedor de Usuarios</h1>

          <div className="admin-actions">
            <button 
              onClick={() => navigate('/admin_dashboard')} 
              className="btn-secondary"
            >
              ← Volver al Dashboard
            </button>

            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('sesionActiva');
                navigate('/');
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>


        <section className="admin-section">
          <div className="admin-toolbar">
            <h2>Formulario de usuario</h2>
            {usuarioEditando && (
              <span className="badge-editando">
                Editando: {usuarioEditando.nombreUsuario} {usuarioEditando.apellidoUsuario}
              </span>
            )}
          </div>

          <form className="form-usuario" onSubmit={handleSubmitUsuario}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombreUsuario">Nombre</label>
                <input
                  id="nombreUsuario"
                  name="nombreUsuario"
                  type="text"
                  value={formUsuario.nombreUsuario}
                  onChange={handleChangeUsuario}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellidoUsuario">Apellido</label>
                <input
                  id="apellidoUsuario"
                  name="apellidoUsuario"
                  type="text"
                  value={formUsuario.apellidoUsuario}
                  onChange={handleChangeUsuario}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emailUsuario">Correo</label>
                <input
                  id="emailUsuario"
                  name="emailUsuario"
                  type="email"
                  value={formUsuario.emailUsuario}
                  onChange={handleChangeUsuario}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passwordUsuario">Contraseña</label>
                <input
                  id="passwordUsuario"
                  name="passwordUsuario"
                  type="password"
                  value={formUsuario.passwordUsuario}
                  onChange={handleChangeUsuario}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rolUsuario">Rol</label>
                <select
                  id="rolUsuario"
                  name="rolUsuario"
                  value={formUsuario.rolUsuario}
                  onChange={handleChangeUsuario}
                  required
                >
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              {usuarioEditando && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancelarEdicion}
                >
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn-save">
                {usuarioEditando ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </form>
        </section>

        <section className="admin-section">
          <div className="admin-toolbar">
            <h2>Usuarios registrados</h2>
            <span className="contador-productos">Total: {usuarios.length}</span>
          </div>

          {cargando ? (
            <p>Cargando usuarios...</p>
          ) : usuarios.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.idUsuario}>
                    <td>{u.idUsuario}</td>
                    <td>
                      {u.nombreUsuario} {u.apellidoUsuario}
                    </td>
                    <td>{u.emailUsuario}</td>
                    <td>{u.rolUsuario}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-secundario"
                        onClick={() => handleEditarUsuario(u)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn-peligro"
                        onClick={() => handleEliminarUsuario(u)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default UsuariosAdminPage;
