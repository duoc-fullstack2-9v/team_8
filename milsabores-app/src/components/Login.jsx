import React, { useState, useEffect } from 'react';

const Login = ({ onNavigate }) => {
    const [emailUser, setEmailUser] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        // Verificar si viene del registro exitoso
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('registro') === 'ok') {
            setMensaje('¡Cuenta creada! Ahora puedes iniciar sesión');
        }
    }, []);

    const login = () => {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioEncontrado = usuarios.find(
            (u) => u.emailUser === emailUser && u.password === password
        );

        if (usuarioEncontrado) {
            localStorage.setItem('sesionActiva', emailUser);
            alert(`¡Bienvenido ${usuarioEncontrado.nomUser}!`);
            if (onNavigate) onNavigate('home');
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
            <p className="mensaje">{mensaje}</p>
        </div>
    );
};

export default Login;
