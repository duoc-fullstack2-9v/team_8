import React, { useState, useEffect } from 'react';
import '../styles/ProductoForm.css';

const ProductoForm = ({ producto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreProd: '',
    descProd: '',
    precioProd: '',
    categProd: '',
    imagenProd: '',
    productoDestacado: false, // ✅ nuevo campo para el home
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombreProd: producto.nombreProd || '',
        descProd: producto.descProd || '',
        precioProd: producto.precioProd ?? '', // si viene número, lo mostramos igual
        categProd: producto.categProd || '',
        imagenProd: producto.imagenProd || '',
        productoDestacado: Boolean(producto.productoDestacado), // asegura boolean
      });
    } else {
      setFormData({
        nombreProd: '',
        descProd: '',
        precioProd: '',
        categProd: '',
        imagenProd: '',
        productoDestacado: false,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombreProd || !formData.precioProd || !formData.categProd) {
      alert('Por favor completa los campos obligatorios: Nombre, Precio y Categoría');
      return;
    }

    const productoData = {
      ...formData,
      precioProd: Number(formData.precioProd), // ✅ número para el backend
      productoDestacado: Boolean(formData.productoDestacado),
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
    'Tortas Especiales',
  ];

  return (
    <div className="producto-form-overlay">
      <div className="producto-form-modal">
        <h2>{producto ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}</h2>

        <form onSubmit={handleSubmit} className="producto-form">
          <div className="form-group">
            <label htmlFor="nombreProd">Nombre del Producto *</label>
            <input
              id="nombreProd"
              type="text"
              name="nombreProd"
              value={formData.nombreProd}
              onChange={handleChange}
              placeholder="Ej: Torta de Chocolate"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descProd">Descripción</label>
            <textarea
              id="descProd"
              name="descProd"
              value={formData.descProd}
              onChange={handleChange}
              placeholder="Describe el producto..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="precioProd">Precio (CLP) *</label>
            <input
              id="precioProd"
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
            <label htmlFor="categProd">Categoría *</label>
            <select
              id="categProd"
              name="categProd"
              value={formData.categProd}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imagenProd">URL de la Imagen</label>
            <input
              id="imagenProd"
              type="text"
              name="imagenProd"
              value={formData.imagenProd}
              onChange={handleChange}
              placeholder="/img/nombre-imagen.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productoDestacado">
              <input
                id="productoDestacado"
                type="checkbox"
                name="productoDestacado"
                checked={formData.productoDestacado}
                onChange={handleChange}
              />{' '}
              Marcar como producto destacado (aparece en la página de inicio)
            </label>
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
