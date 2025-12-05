import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltroCategorias from '../src/components/FiltroCategorias.jsx';

describe('Componente FiltroCategorias', () => {
  const categoriasMock = ['Tortas', 'Postres', 'Galletas', 'Kuchen'];
  const mockOnCategoriaChange = vi.fn();

  const defaultProps = {
    categorias: categoriasMock,
    categoriaSeleccionada: '',
    onCategoriaChange: mockOnCategoriaChange,
  };

  const renderFiltro = (props = {}) => {
    return render(<FiltroCategorias {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el componente correctamente', () => {
    renderFiltro();
    
    expect(
      screen.getByText('Filtrar por categoría:')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox')
    ).toBeInTheDocument();
  });

  test('muestra la opción "Todas las categorías" por defecto', () => {
    renderFiltro();
    
    expect(
      screen.getByText('Todas las categorías')
    ).toBeInTheDocument();
  });

  test('puede ocultar la opción "Todas las categorías"', () => {
    renderFiltro({ mostrarTodas: false });
    
    expect(
      screen.queryByText('Todas las categorías')
    ).not.toBeInTheDocument();
  });

  test('muestra todas las categorías proporcionadas', () => {
    renderFiltro();
    
    categoriasMock.forEach((categoria) => {
      expect(screen.getByText(categoria)).toBeInTheDocument();
    });
  });

  test('selecciona la categoría correcta', () => {
    renderFiltro({ categoriaSeleccionada: 'Postres' });
    
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('Postres');
  });

  test('llama a onCategoriaChange cuando se selecciona una categoría', async () => {
    const user = userEvent.setup();
    renderFiltro();
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Tortas');
    
    expect(mockOnCategoriaChange).toHaveBeenCalledWith('Tortas');
  });

  test('permite personalizar el label', () => {
    renderFiltro({ label: 'Filtrar por:' });
    
    expect(
      screen.getByText('Filtrar por:')
    ).toBeInTheDocument();
  });

  test('aplica className personalizado', () => {
    const { container } = renderFiltro({ className: 'filtro-personalizado' });
    
    const filtroContainer = container.querySelector('.filtro-container');
    expect(filtroContainer).toHaveClass('filtro-personalizado');
  });

  // ✅ Nuevo test: comportamiento cuando no hay categorías
  test('muestra mensaje cuando no hay categorías disponibles', () => {
    render(
      <FiltroCategorias
        categorias={[]}
        categoriaSeleccionada=""
        onCategoriaChange={mockOnCategoriaChange}
      />
    );

    // Se sigue mostrando "Todas las categorías" por defecto
    expect(
      screen.getByText('Todas las categorías')
    ).toBeInTheDocument();

    // Y además el mensaje de sin categorías
    const opcionSinCategorias = screen.getByText('(Sin categorías disponibles)');
    expect(opcionSinCategorias).toBeInTheDocument();
    expect(opcionSinCategorias).toHaveAttribute('disabled');
  });
});
