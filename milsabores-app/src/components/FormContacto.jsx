import { useState } from 'react';
import '../styles/Contacto.css';

function FormularioContacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [mostrarExito, setMostrarExito] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mostrar mensaje de éxito
    setMostrarExito(true);
    
    // Resetear formulario
    setFormData({
      nombre: '',
      email: '',
      mensaje: ''
    });

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      setMostrarExito(false);
    }, 5000);
  };

  return (
    <div className="form-container">
      <form id="form-contacto" className="form-contacto" onSubmit={handleSubmit}>
        <div className="form-grupo">
          <label htmlFor="nombre">Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            value={formData.nombre}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-grupo">
          <label htmlFor="email">Correo Electrónico:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="form-grupo">
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea 
            id="mensaje" 
            name="mensaje" 
            rows="5" 
            value={formData.mensaje}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <button type="submit" className="btn-enviar">Enviar</button>
      </form>

      {mostrarExito && (
        <p id="mensaje-exito" style={{ display: 'block', color: 'green', textAlign: 'center', marginTop: '15px' }}>
          ✅ ¡Gracias por contactarnos! Responderemos a tu consulta prontamente 😄
        </p>
      )}
    </div>
  );
}

export default FormularioContacto;