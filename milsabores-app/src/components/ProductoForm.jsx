import React, { useState, useEffect } from 'react';
import '../styles/ProductoForm.css';

const ProductoForm = ({ producto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreProd: '',
    descProd: '',
    precioProd: '',
    categProd: '',
    imagenProd: ''
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombreProd: producto.nombreProd || '',
        descProd: producto.descProd || '',
        precioProd: producto.precioProd || '',
        categProd: producto.categProd || '',
        imagenProd: producto.imagenProd || ''
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombreProd || !formData.precioProd || !formData.categProd) {
      alert('Por favor completa los campos obligatorios: Nombre, Precio y Categoría');
      return;
    }

    // Convertir precio a número
    const productoData = {
      ...formData,
      precioProd: Number(formData.precioProd)
    };

    onSave(productoData);
  };

  const categorias = [
    'Tortas Cuadradas',
    'Tortas Circulares', 
    'Postres Individuales',
    'Productos Sin Azúcar',
    'Pastelería Tradicional',
    'Producto Sin Gluten',
    'Productos Veganos',
    'Tortas Especiales'
  ];

  return (
    <div className="producto-form-overlay">
      <div className="producto-form-modal">
        <h2>{producto ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}</h2>
        
        <form onSubmit={handleSubmit} className="producto-form">
          <div className="form-group">
            <label>Nombre del Producto *</label>
            <input
              type="text"
              name="nombreProd"
              value={formData.nombreProd}
              onChange={handleChange}
              placeholder="Ej: Torta de Chocolate"
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descProd"
              value={formData.descProd}
              onChange={handleChange}
              placeholder="Describe el producto..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Precio (CLP) *</label>
            <input
              type="number"
              name="precioProd"
              value={formData.precioProd}
              onChange={handleChange}
              placeholder="45000"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría *</label>
            <select
              name="categProd"
              value={formData.categProd}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>URL de la Imagen</label>
            <input
              type="text"
              name="imagenProd"
              value={formData.imagenProd}
              onChange={handleChange}
              placeholder="/img/nombre-imagen.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {producto ? '💾 Guardar Cambios' : '➕ Agregar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoForm;