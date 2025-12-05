import React, { useState } from 'react';
import { crearUsuario } from '../services/UsuariosService';

const Registro = ({ onNavigate }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [passwordUsuario, setPasswordUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const validarCampos = () => {
    if (!nombreUsuario || !apellidoUsuario || !emailUsuario || !passwordUsuario) {
      setMensaje('Completa todos los campos.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailUsuario)) {
      setMensaje('Ingresa un correo electrónico válido.');
      return false;
    }

    if (passwordUsuario.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const registrarUser = async () => {
    setMensaje('');

    if (!validarCampos()) return;

    const nuevoUsuario = {
      nombreUsuario,
      apellidoUsuario,
      emailUsuario,
      passwordUsuario,
      rolUsuario: 'CLIENTE', 
    };

    try {
      setCargando(true);

      const resp = await crearUsuario(nuevoUsuario);
      console.log('Respuesta crearUsuario:', resp);

      alert(`¡Cuenta creada exitosamente para ${nombreUsuario}!`);

      // Si usas onNavigate para cambiar de vista dentro del mismo componente padre:
      if (onNavigate) {
        onNavigate('login-page');
      } else {
        // Alternativa si algún día migras a rutas:
        // window.location.href = '/login?registro=ok';
      }
    } catch (error) {
      console.error('Error al registrar usuario', error);

      const msgBackend = error?.response?.data;
      setMensaje(
        msgBackend && typeof msgBackend === 'string'
          ? msgBackend
          : 'Hubo un problema al crear la cuenta. Intenta nuevamente.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <h2>📝 Crea tu cuenta</h2>

      <input
        type="text"
        placeholder="Nombre(s)"
        value={nombreUsuario}
        onChange={(e) => setNombreUsuario(e.target.value)}
      />

      <input
        type="text"
        placeholder="Apellido(s)"
        value={apellidoUsuario}
        onChange={(e) => setApellidoUsuario(e.target.value)}
      />

      <input
        type="email"
        placeholder="Correo Electrónico"
        value={emailUsuario}
        onChange={(e) => setEmailUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={passwordUsuario}
        onChange={(e) => setPasswordUsuario(e.target.value)}
      />

      <button onClick={registrarUser} disabled={cargando}>
        {cargando ? 'Creando cuenta...' : 'Registrarse'}
      </button>

      <button onClick={() => onNavigate && onNavigate('login-page')}>
        Volver al login
      </button>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default Registro;


