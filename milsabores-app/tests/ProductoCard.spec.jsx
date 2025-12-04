import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import ProductoCard from '../src/components/ProductoCard';

// 🛒 Mock del contexto del carrito
const mockAgregarCarrito = vi.fn();
const mockMostrarMensajeTemporal = vi.fn();

vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: () => ({
    agregarCarrito: mockAgregarCarrito,
    mostrarMensajeTemporal: mockMostrarMensajeTemporal,
  }),
}));

// 🔀 Mock de useNavigate (react-router-dom)
let mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { BrowserRouter } from 'react-router-dom';

// 🖼️ Mock de la imagen missing
vi.mock('../src/assets/img/missing-image-1.png', () => ({
  default: 'mock-missing-image.png',
}));

describe('Componente ProductoCard', () => {
  const mockProducto = {
    idProd: 1,
    nombreProd: 'Torta de Chocolate',
    descProd: 'Deliciosa torta de chocolate con capas de ganache',
    precioProd: 45000,
    imagenProd: '/src/assets/img/torta-chocolate.jpg',
  };

  const renderProductoCard = (producto = mockProducto) => {
    return render(
      <BrowserRouter>
        <ProductoCard producto={producto} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn();
  });

  it('renderiza la información del producto correctamente', () => {
    renderProductoCard();

    expect(
      screen.getByText('Torta de Chocolate')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deliciosa torta de chocolate/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText('$45.000 CLP')
    ).toBeInTheDocument();
  });

  it('muestra los botones de cantidad y el botón "Agregar al Carrito"', () => {
    renderProductoCard();

    expect(
      screen.getByRole('button', { name: /Agregar al Carrito/i })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Disminuir cantidad/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Aumentar cantidad/i)
    ).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // cantidad inicial
  });

  it('aumenta y disminuye la cantidad correctamente', async () => {
    const user = userEvent.setup();
    renderProductoCard();

    const btnAumentar = screen.getByLabelText(/Aumentar cantidad/i);
    const btnDisminuir = screen.getByLabelText(/Disminuir cantidad/i);
    const cantidadDisplay = screen.getByText('0');

    await user.click(btnAumentar);
    expect(cantidadDisplay).toHaveTextContent('1');

    await user.click(btnAumentar);
    expect(cantidadDisplay).toHaveTextContent('2');

    await user.click(btnDisminuir);
    expect(cantidadDisplay).toHaveTextContent('1');
  });

  it('no permite cantidad negativa y el botón "-" se desactiva en 0', async () => {
    const user = userEvent.setup();
    renderProductoCard();

    const btnDisminuir = screen.getByLabelText(/Disminuir cantidad/i);
    const cantidadDisplay = screen.getByText('0');

    await user.click(btnDisminuir);
    expect(cantidadDisplay).toHaveTextContent('0');
    expect(btnDisminuir).toBeDisabled();
  });

  it('si la cantidad es 0, muestra mensaje de advertencia y NO agrega al carrito', async () => {
    const user = userEvent.setup();
    renderProductoCard();

    const btnAgregar = screen.getByRole('button', {
      name: /Agregar al Carrito/i,
    });

    await user.click(btnAgregar);

    expect(mockAgregarCarrito).not.toHaveBeenCalled();
    expect(mockMostrarMensajeTemporal).toHaveBeenCalledWith(
      '⚠️ Selecciona al menos 1 unidad'
    );
  });

  it('si la cantidad es mayor que 0, llama a agregarCarrito y resetea la cantidad', async () => {
    const user = userEvent.setup();
    renderProductoCard();

    const btnAumentar = screen.getByLabelText(/Aumentar cantidad/i);
    const btnAgregar = screen.getByRole('button', {
      name: /Agregar al Carrito/i,
    });
    const cantidadDisplay = screen.getByText('0');

    await user.click(btnAumentar); // cantidad = 1
    await user.click(btnAgregar);

    expect(mockAgregarCarrito).toHaveBeenCalledWith(
      mockProducto,
      1
    );
    expect(mockMostrarMensajeTemporal).not.toHaveBeenCalled();
    expect(cantidadDisplay).toHaveTextContent('0'); // reseteada
  });

  it('al hacer click en la imagen navega al detalle del producto', async () => {
    const user = userEvent.setup();
    renderProductoCard();

    const imagen = screen.getByAltText('Torta de Chocolate');
    await user.click(imagen);

    expect(mockNavigate).toHaveBeenCalledWith('/producto/1');
  });
});
