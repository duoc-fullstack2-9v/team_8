import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductoCard from '../src/components/ProductoCard';

// Mock del contexto del carrito
const mockAgregarCarrito = vi.fn();
const mockMostrarMensajeTemporal = vi.fn();

vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: () => ({
    agregarCarrito: mockAgregarCarrito,
    mostrarMensajeTemporal: mockMostrarMensajeTemporal,
  }),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de la imagen missing
vi.mock('../assets/img/missing-image-1.png', () => ({ default: 'mock-missing-image.png' }));

describe('Componente ProductoCard', () => {
  const mockProducto = {
    idProd: 1,
    nombreProd: 'Torta de Chocolate',
    descProd: 'Deliciosa torta de chocolate con capas de ganache',
    precioProd: 45000,
    imagenProd: '/src/assets/img/torta-chocolate.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderProductoCard = (producto = mockProducto) => {
    return render(
      <BrowserRouter>
        <ProductoCard producto={producto} />
      </BrowserRouter>
    );
  };

  it('renderiza la información del producto correctamente', () => {
    renderProductoCard();
    
    expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument();
    expect(screen.getByText(/Deliciosa torta de chocolate/i)).toBeInTheDocument();
    expect(screen.getByText('$45.000 CLP')).toBeInTheDocument();
  });

  it('muestra los botones de cantidad y agregar al carrito', () => {
    renderProductoCard();
    
    expect(screen.getByText('Agregar al Carrito')).toBeInTheDocument();
    expect(screen.getByLabelText(/Disminuir cantidad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aumentar cantidad/i)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Cantidad inicial
  });

  it('aumenta y disminuye la cantidad correctamente', async () => {
    const user = userEvent.setup();
    renderProductoCard();
    
    const btnAumentar = screen.getByLabelText(/Aumentar cantidad/i);
    const btnDisminuir = screen.getByLabelText(/Disminuir cantidad/i);
    const cantidadDisplay = screen.getByText('0');

    // Aumentar cantidad
    await user.click(btnAumentar);
    expect(cantidadDisplay).toHaveTextContent('1');

    await user.click(btnAumentar);
    expect(cantidadDisplay).toHaveTextContent('2');

    // Disminuir cantidad
    await user.click(btnDisminuir);
    expect(cantidadDisplay).toHaveTextContent('1');
  });

  it('no permite cantidad negativa', async () => {
    const user = userEvent.setup();
    renderProductoCard();
    
    const btnDisminuir = screen.getByLabelText(/Disminuir cantidad/i);
    const cantidadDisplay = screen.getByText('0');

    // Intentar disminuir cuando es 0
    await user.click(btnDisminuir);
    expect(cantidadDisplay).toHaveTextContent('0'); // Sigue en 0
    expect(btnDisminuir).toBeDisabled();
  });
});