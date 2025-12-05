// tests/Producto.spec.jsx
import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 🔹 Mock de useNavigate / useParams
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
  };
});

// 🔹 Mock de layout (Header / Navbar / Footer)
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

// 🔹 Mock de ProductosService.api.getProductoById
const mockGetProductoById = vi.fn();

vi.mock('../src/services/ProductosService', () => ({
  api: {
    getProductoById: (...args) => mockGetProductoById(...args),
  },
}));

import Producto from '../src/pages/Producto';

const renderProducto = () => render(<Producto />);

describe('Página Producto', () => {
  const mockProducto = {
    idProd: 1,
    nombreProd: 'Torta de Chocolate',
    descProd: 'Deliciosa torta de chocolate con ganache',
    precioProd: 45000,
    imagenProd: '/img/torta-chocolate.jpg',
    categProd: 'Tortas Circulares',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProductoById.mockResolvedValue(mockProducto);
  });

  test('muestra estado de carga y luego los datos del producto', async () => {
    renderProducto();

    // ⏳ Estado de carga
    expect(
      screen.getByText('🔄 Cargando producto...')
    ).toBeInTheDocument();

    // Espera a que se resuelva la llamada a la API
    await waitFor(() => {
      expect(mockGetProductoById).toHaveBeenCalledTimes(1);
      expect(mockGetProductoById).toHaveBeenCalledWith('1');
    });

    // Ya no debería estar el texto de cargando
    expect(
      screen.queryByText('🔄 Cargando producto...')
    ).not.toBeInTheDocument();

    // Muestra información del producto
    expect(
      screen.getByText('Torta de Chocolate')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Deliciosa torta de chocolate con ganache')
    ).toBeInTheDocument();
    expect(
      screen.getByText('$45.000 CLP')
    ).toBeInTheDocument();

    const img = screen.getByAltText('Torta de Chocolate');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img/torta-chocolate.jpg');

    // Layout
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('cuando no se encuentra el producto, muestra mensaje de "Producto no encontrado"', async () => {
    mockGetProductoById.mockResolvedValueOnce(null);

    renderProducto();

    await waitFor(() => {
      expect(mockGetProductoById).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText('Producto no encontrado')
    ).toBeInTheDocument();

    // Botones de navegación
    expect(
      screen.getByRole('button', { name: '×' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Volver al catálogo' })
    ).toBeInTheDocument();
  });

  test('botón "×" vuelve atrás con navigate(-1)', async () => {
    const user = userEvent.setup();
    renderProducto();

    await waitFor(() => {
      expect(mockGetProductoById).toHaveBeenCalledTimes(1);
    });

    const btnCerrar = screen.getByRole('button', { name: '×' });
    await user.click(btnCerrar);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('botón "Volver al catálogo" llama navigate(-1)', async () => {
    const user = userEvent.setup();
    renderProducto();

    await waitFor(() => {
      expect(mockGetProductoById).toHaveBeenCalledTimes(1);
    });

    const btnVolver = screen.getByRole('button', {
      name: 'Volver al catálogo',
    });
    await user.click(btnVolver);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('si la API lanza error, termina en estado "Producto no encontrado"', async () => {
    mockGetProductoById.mockRejectedValueOnce(
      new Error('Error en API')
    );

    renderProducto();

    await waitFor(() => {
      expect(mockGetProductoById).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText('Producto no encontrado')
    ).toBeInTheDocument();
  });
});
