import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductoForm from '../src/components/ProductoForm.jsx';

describe('Componente ProductoForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    producto: null
  };

  const renderProductoForm = (props = {}) => {
    return render(<ProductoForm {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el formulario para agregar nuevo producto', () => {
    renderProductoForm();
    
    expect(screen.getByText('➕ Agregar Nuevo Producto')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del producto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url de la imagen/i)).toBeInTheDocument();
  });

  test('renderiza el formulario para editar producto', () => {
    const productoEditando = {
      nombreProd: 'Torta de Chocolate',
      descProd: 'Deliciosa torta',
      precioProd: 45000,
      categProd: 'Tortas Circulares',
      imagenProd: '/img/torta.jpg'
    };
    
    renderProductoForm({ producto: productoEditando });
    
    expect(screen.getByText('✏️ Editar Producto')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Torta de Chocolate')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Deliciosa torta')).toBeInTheDocument();
    expect(screen.getByDisplayValue('45000')).toBeInTheDocument();
  });

  test('permite escribir en los campos del formulario', async () => {
    const user = userEvent.setup();
    renderProductoForm();
    
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Nueva Torta');
    await user.type(screen.getByLabelText(/descripción/i), 'Descripción prueba');
    await user.type(screen.getByLabelText(/precio/i), '50000');
    
    expect(screen.getByLabelText(/nombre del producto/i)).toHaveValue('Nueva Torta');
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Descripción prueba');
    expect(screen.getByLabelText(/precio/i)).toHaveValue(50000);
  });

  test('llama a onSave con los datos del formulario', async () => {
    const user = userEvent.setup();
    renderProductoForm();
    
    // Llenar formulario
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Cheesecake');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Postres Individuales');
    await user.type(screen.getByLabelText(/precio/i), '47000');
    
    // Enviar formulario
    await user.click(screen.getByRole('button', { name: /agregar producto/i }));
    
    expect(mockOnSave).toHaveBeenCalledWith({
      nombreProd: 'Cheesecake',
      descProd: '',
      precioProd: 47000,
      categProd: 'Postres Individuales',
      imagenProd: ''
    });
  });

  test('muestra alerta cuando faltan campos obligatorios', async () => {
    const user = userEvent.setup();
    
    renderProductoForm();
    
    // Intentar enviar sin llenar campos obligatorios
    await user.click(screen.getByRole('button', { name: /agregar producto/i }));
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText(/agregar nuevo producto/i)).toBeInTheDocument();
  });

  test('llama a onCancel cuando se hace clic en Cancelar', async () => {
    const user = userEvent.setup();
    renderProductoForm();
    
    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('convierte el precio a número', async () => {
    const user = userEvent.setup();
    renderProductoForm();
    
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Test');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Tortas Circulares');
    await user.type(screen.getByLabelText(/precio/i), '42000');
    
    await user.click(screen.getByRole('button', { name: /agregar producto/i }));
    
    // Verificar que el precio se convirtió a número
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        precioProd: 42000 // Número, no string
      })
    );
  });
});