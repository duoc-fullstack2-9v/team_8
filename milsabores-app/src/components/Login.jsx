import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/AuthService'; // ⬅️ nuevo import

const Login = ({ onNavigate }) => {
    const [emailUser, setEmailUser] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('registro') === 'ok') {
            setMensaje('¡Cuenta creada! Ahora puedes iniciar sesión');
        }
    }, []);

    const validarCampos = () => {
        // Validar que los campos no estén vacíos
        if (!emailUser || !password) {
            setMensaje('Por favor, completa todos los campos.');
            return false;
        }

        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailUser)) {
            setMensaje('Por favor, ingresa un correo electrónico válido.');
            return false;
        }

        // Validar largo mínimo de contraseña
        if (password.length < 6) {
            setMensaje('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        return true;
    };

    const login = async () => {
        // Validar antes de procesar login
        if (!validarCampos()) return;

        try {
            // 🔐 Llamamos al backend (JWT)
            const data = await loginRequest(emailUser, password);

            console.log('Respuesta login backend:', data);

            const token = data.token;              // OK según tu respuesta
            const usuario = data.usuario || {};    // 👈 viene acá
            const rolBackend = usuario.rolUsuario; // "ADMIN" o "CLIENTE"

            console.log('rolBackend recibido:', rolBackend);

            const nombre = usuario.nombreUsuario || emailUser;

            // rolBackend puede ser "ADMIN" (según lo que mostraste)
            const esAdmin =
                rolBackend === 'ADMIN' ||
                rolBackend === 'ROLE_ADMIN';

            // Rol que usará tu frontend (tus guards usan 'admin'/'user')
            const rolFront = esAdmin ? 'admin' : 'user';

            console.log('rolFront asignado:', rolFront);

            // Guardar datos en localStorage (para toda la app)
            localStorage.setItem('token', token); // para axios + SecurityConfig

            // Para mantener compatibilidad con tu lógica antigua:
            if (rolFront === 'admin') {
                localStorage.setItem('sesionActiva', 'admin'); // antes lo hacías así
            } else {
                localStorage.setItem('sesionActiva', emailUser);
            }

            localStorage.setItem('userRole', rolFront); // 'admin' o 'user'

            if (rolFront === 'admin') {
                alert('¡Bienvenido Administrador!');
                // 👇 usa la ruta REAL de tu dashboard:
                navigate('/admin_dashboard'); // o '/admin' si tu ruta es esa
            } else {
                alert(`¡Bienvenido ${nombre}!`);
                navigate('/');
            }
        } catch (error) {
            console.error('Error en login', error);
            setMensaje('Correo y/o contraseña incorrecta. Intente nuevamente.');
        }
    };


    return (
        <div className="login-container">
            <h2>🔐 Inicia Sesión</h2>
            
            <input
                type="email"
                placeholder="Correo electrónico"
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            
            <button onClick={login}>Ingresar</button>
            <button onClick={() => onNavigate('registro')}>Crear cuenta</button>
            
            <div className="admin-access" style={{ opacity: 0.3, fontSize: '12px', marginTop: '10px' }}>
                <span>
                    Acceso Administrador (usa tu cuenta ADMIN registrada)
                </span>
            </div>

            {mensaje && (
                <p className="mensaje" style={{ color: 'crimson', fontWeight: 'bold' }}>
                    {mensaje}
                </p>
            )}
        </div>
    );
};

export default Login;
