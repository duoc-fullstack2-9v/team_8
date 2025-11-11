import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const login = () => {
        // Validar antes de procesar login
        if (!validarCampos()) return;

        const adminCredentials = {
            email: 'admin@milsabores.cl',
            password: 'admin123'
        };

        if (emailUser === adminCredentials.email && password === adminCredentials.password) {
            localStorage.setItem('sesionActiva', 'admin');
            localStorage.setItem('userRole', 'admin');
            alert('¡Bienvenido Administrador!');
            navigate('/admin_dashboard');
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioEncontrado = usuarios.find(
            (u) => u.emailUser === emailUser && u.password === password
        );

        if (usuarioEncontrado) {
            localStorage.setItem('sesionActiva', emailUser);
            localStorage.setItem('userRole', 'user');
            alert(`¡Bienvenido ${usuarioEncontrado.nomUser}!`);
            navigate('/');
        } else {
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
                <span title="Credenciales: admin@milsabores.cl / admin123">
                    Acceso Administrador
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
