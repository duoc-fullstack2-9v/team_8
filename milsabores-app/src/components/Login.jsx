import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onNavigate }) => {
    const [emailUser, setEmailUser] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si viene del registro exitoso
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('registro') === 'ok') {
            setMensaje('¡Cuenta creada! Ahora puedes iniciar sesión');
        }
    }, []);

    const login = () => {
        // Verificación credenciales admin
        const adminCredentials = {
            email: 'admin@milsabores.cl',
            password: 'admin123'
        };

        if (emailUser === adminCredentials.email && password === adminCredentials.password) {
            localStorage.setItem('sesionActiva', 'admin');
            localStorage.setItem('userRole', 'admin');
            alert('¡Bienvenido Administrador!');
            navigate('/admin_dashboard')
            return;
        }

        // Verificación credenciales clientes
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
            
            {/* Acceso admin discreto - solo visible si se hace hover */}
            <div className="admin-access" style={{opacity: 0.3, fontSize: '12px', marginTop: '10px'}}>
                <span title="Credenciales: admin@milsabores.com / admin123">
                  Acceso Administrador
                </span>
            </div>
            
            <p className="mensaje">{mensaje}</p>
        </div>
    );
};

export default Login;