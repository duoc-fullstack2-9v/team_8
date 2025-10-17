import React, { useState } from 'react';

const Registro = ({ onNavigate }) => {
    const [nomUser, setNomUser] = useState('');
    const [apUser, setApUser] = useState('');
    const [emailUser, setEmailUser] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const registrarUser = () => {
        if (!nomUser || !emailUser || !password) {
            setMensaje('Completa todos los campos.');
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const existeUser = usuarios.some((u) => u.emailUser === emailUser);
        if (existeUser) {
            setMensaje('Este correo electrónico ya está asociado a usuario registrado');
            return;
        }

        usuarios.push({ nomUser, apUser, emailUser, password });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert(`¡Cuenta creada exitosamente para ${nomUser}!`);
        if (onNavigate) onNavigate('login');
    };

    return (
        <div className="registro-container">
            <h2>📝 Crea tu cuenta</h2>
            <input
                type="text"
                placeholder="Nombre(s)"
                value={nomUser}
                onChange={(e) => setNomUser(e.target.value)}
            />
            <input
                type="text"
                placeholder="Apellido(s)"
                value={apUser}
                onChange={(e) => setApUser(e.target.value)}
            />
            <input
                type="email"
                placeholder="Correo Electrónico"
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={registrarUser}>Registrarse</button>
            <button onClick={() => onNavigate('login')}>Volver al login</button>
            <p className="mensaje">{mensaje}</p>
        </div>
    );
};

export default Registro;
