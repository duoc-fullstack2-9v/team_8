import React from 'react';
import '../styles/FiltroCategorias.css';

const FiltroCategorias = ({ 
  categorias, 
  categoriaSeleccionada, 
  onCategoriaChange,
  mostrarTodas = true,
  className = '',
  label = "Filtrar por categoría:"
}) => {
  return (
    <div className={`filtro-container ${className}`}>
      <label className="filtro-label">{label}</label>
      <select 
        value={categoriaSeleccionada} 
        onChange={(e) => onCategoriaChange(e.target.value)}
        className="filtro-categoria"
      >
        {mostrarTodas && <option value="">Todas las categorías</option>}
        {categorias.map(categoria => (
          <option key={categoria} value={categoria}>
            {categoria}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltroCategorias;