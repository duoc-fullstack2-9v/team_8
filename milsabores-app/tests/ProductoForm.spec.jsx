import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductoForm from '../src/components/ProductoForm.jsx';

describe('Componente ProductoForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    producto: null,
  };

  const renderProductoForm = (props = {}) => {
    return render(<ProductoForm {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el formulario para agregar nuevo producto', () => {
    renderProductoForm();

    expect(
      screen.getByText('➕ Agregar Nuevo Producto')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Nombre del Producto/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Descripción/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Precio \(CLP\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Categoría/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/URL de la Imagen/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Marcar como producto destacado/i)
    ).toBeInTheDocument();
  });

  test('renderiza el formulario para editar producto', () => {
    const productoEditando = {
      nombreProd: 'Torta de Chocolate',
      descProd: 'Deliciosa torta',
      precioProd: 45000,
      categProd: 'Tortas Circulares',
      imagenProd: '/img/torta.jpg',
      productoDestacado: true,
    };

    renderProductoForm({ producto: productoEditando });

    expect(
      screen.getByText('✏️ Editar Producto')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Torta de Chocolate')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Deliciosa torta')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('45000')
    ).toBeInTheDocument();

    // checkbox debe venir marcado
    const checkboxDestacado = screen.getByLabelText(
      /Marcar como producto destacado/i
    );
    expect(checkboxDestacado).toBeChecked();
  });

  test('permite escribir en los campos del formulario', async () => {
    const user = userEvent.setup();
    renderProductoForm();

    await user.type(
      screen.getByLabelText(/Nombre del Producto/i),
      'Nueva Torta'
    );
    await user.type(
      screen.getByLabelText(/Descripción/i),
      'Descripción prueba'
    );
    await user.type(
      screen.getByLabelText(/Precio \(CLP\)/i),
      '50000'
    );

    expect(
      screen.getByLabelText(/Nombre del Producto/i)
    ).toHaveValue('Nueva Torta');
    expect(
      screen.getByLabelText(/Descripción/i)
    ).toHaveValue('Descripción prueba');
    expect(
      screen.getByLabelText(/Precio \(CLP\)/i)
    ).toHaveValue(50000);
  });

  test('permite marcar y desmarcar "producto destacado"', async () => {
    const user = userEvent.setup();
    renderProductoForm();

    const checkboxDestacado = screen.getByLabelText(
      /Marcar como producto destacado/i
    );

    expect(checkboxDestacado).not.toBeChecked();

    await user.click(checkboxDestacado);
    expect(checkboxDestacado).toBeChecked();

    await user.click(checkboxDestacado);
    expect(checkboxDestacado).not.toBeChecked();
  });

  test('llama a onSave con los datos del formulario (incluyendo productoDestacado)', async () => {
    const user = userEvent.setup();
    renderProductoForm();

    await user.type(
      screen.getByLabelText(/Nombre del Producto/i),
      'Cheesecake'
    );
    await user.selectOptions(
      screen.getByLabelText(/Categoría/i),
      'Postres Individuales'
    );
    await user.type(
      screen.getByLabelText(/Precio \(CLP\)/i),
      '47000'
    );
    await user.type(
      screen.getByLabelText(/Descripción/i),
      'Suave cheesecake de frutos rojos'
    );

    // marcar como destacado
    const checkboxDestacado = screen.getByLabelText(
      /Marcar como producto destacado/i
    );
    await user.click(checkboxDestacado);

    await user.click(
      screen.getByRole('button', { name: /Agregar Producto/i })
    );

    expect(mockOnSave).toHaveBeenCalledWith({
      nombreProd: 'Cheesecake',
      descProd: 'Suave cheesecake de frutos rojos',
      precioProd: 47000,
      categProd: 'Postres Individuales',
      imagenProd: '',
      productoDestacado: true,
    });
  });

  test('muestra alerta cuando faltan campos obligatorios y no llama a onSave', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderProductoForm();

    await user.click(
      screen.getByRole('button', { name: /agregar producto/i })
    );

    expect(mockOnSave).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });


  test('llama a onCancel cuando se hace clic en Cancelar', async () => {
    const user = userEvent.setup();
    renderProductoForm();

    await user.click(
      screen.getByRole('button', { name: /Cancelar/i })
    );

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('convierte el precio a número al guardar', async () => {
    const user = userEvent.setup();
    renderProductoForm();

    await user.type(
      screen.getByLabelText(/Nombre del Producto/i),
      'Test'
    );
    await user.selectOptions(
      screen.getByLabelText(/Categoría/i),
      'Tortas Circulares'
    );
    await user.type(
      screen.getByLabelText(/Precio \(CLP\)/i),
      '42000'
    );

    await user.click(
      screen.getByRole('button', { name: /Agregar Producto/i })
    );

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        precioProd: 42000,          // número
        productoDestacado: false,   // valor por defecto
      })
    );
  });
});
