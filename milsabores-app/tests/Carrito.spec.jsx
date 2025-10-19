import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Carrito from '../src/pages/Carrito';

// Mock de componentes
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>
}));

vi.mock('../src/components/HeroBanner', () => ({
  default: ({ titulo, subtitulo }) => (
    <div data-testid="mock-hero-banner">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </div>
  )
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>
}));

// Mock del CarritoContext
vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

import { useCarrito } from '../src/context/CarritoContext';

// Mock implementations - ADAPTADO a tu estructura real
const mockCarritoConProductos = {
  carrito: [
    {
      idProd: 1,
      nombreProd: 'Torta de Chocolate',
      precioProd: 45000,
      cantidad: 2,
      imagenProd: '/img/torta-chocolate.jpg'
    },
    {
      idProd: 2,
      nombreProd: 'Cheesecake',
      precioProd: 47000,
      cantidad: 1,
      imagenProd: '/img/cheesecake.jpg'
    }
  ],
  vaciarCarrito: vi.fn(),
  eliminarProducto: vi.fn(),
  actualizarCantidad: vi.fn(),
  totalPagar: 137000,
  mostrarMensaje: false,
  mensajeTexto: ''
};

const mockCarritoVacio = {
  carrito: [],
  vaciarCarrito: vi.fn(),
  eliminarProducto: vi.fn(),
  actualizarCantidad: vi.fn(),
  totalPagar: 0,
  mostrarMensaje: false,
  mensajeTexto: ''
};

const renderCarrito = () => {
  return render(
    <BrowserRouter>
      <Carrito />
    </BrowserRouter>
  );
};

describe('Página Carrito', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCarrito.mockReturnValue(mockCarritoConProductos);
  });

  test('renderiza todos los componentes principales', () => {
    renderCarrito();
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('muestra el hero banner del carrito', () => {
    renderCarrito();
    
    expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
    expect(screen.getByText('Revisa y gestiona tus productos seleccionados')).toBeInTheDocument();
  });

  test('muestra los productos del carrito cuando hay productos', () => {
    renderCarrito();
    
    expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Cheesecake')).toBeInTheDocument();
  });

  test('muestra las cantidades de productos', () => {
    renderCarrito();
    
    expect(screen.getByText(/Cantidad:.*2/)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad:.*1/)).toBeInTheDocument();
  });

  test('muestra los subtotales de productos', () => {
    renderCarrito();
    
    // CORREGIDO: Usar expresiones regulares para buscar números con puntos
    expect(screen.getByText(/90\.000/)).toBeInTheDocument();
    expect(screen.getByText(/47\.000/)).toBeInTheDocument();
  });

  test('muestra el total del carrito', () => {
    renderCarrito();
    
    // CORREGIDO: Usar expresión regular para buscar el total
    expect(screen.getByText(/137\.000/)).toBeInTheDocument();
  });

  test('muestra botón de vaciar carrito', () => {
    renderCarrito();
    
    expect(screen.getByRole('button', { name: /vaciar carrito/i })).toBeInTheDocument();
  });

  test('muestra botones de acciones para cada producto', () => {
    renderCarrito();
    
    const botonesMenos = screen.getAllByRole('button', { name: '-1' });
    const botonesEliminar = screen.getAllByRole('button', { name: 'Eliminar' });
    const botonesMas = screen.getAllByRole('button', { name: '+1' });
    
    expect(botonesMenos).toHaveLength(2);
    expect(botonesEliminar).toHaveLength(2);
    expect(botonesMas).toHaveLength(2);
  });

  test('llama a vaciarCarrito cuando se hace clic en Vaciar carrito', async () => {
    const user = userEvent.setup();
    renderCarrito();
    
    const botonVaciar = screen.getByRole('button', { name: /vaciar carrito/i });
    await user.click(botonVaciar);
    
    expect(mockCarritoConProductos.vaciarCarrito).toHaveBeenCalledTimes(1);
  });

  test('llama a eliminarProducto cuando se hace clic en Eliminar', async () => {
    const user = userEvent.setup();
    renderCarrito();
    
    const botonesEliminar = screen.getAllByRole('button', { name: 'Eliminar' });
    await user.click(botonesEliminar[0]);
    
    expect(mockCarritoConProductos.eliminarProducto).toHaveBeenCalledWith(1);
  });

  test('llama a actualizarCantidad cuando se hace clic en -1', async () => {
    const user = userEvent.setup();
    renderCarrito();
    
    const botonesMenos = screen.getAllByRole('button', { name: '-1' });
    await user.click(botonesMenos[0]);
    
    expect(mockCarritoConProductos.actualizarCantidad).toHaveBeenCalledWith(1, 1);
  });

  test('llama a actualizarCantidad cuando se hace clic en +1', async () => {
    const user = userEvent.setup();
    renderCarrito();
    
    const botonesMas = screen.getAllByRole('button', { name: '+1' });
    await user.click(botonesMas[0]);
    
    expect(mockCarritoConProductos.actualizarCantidad).toHaveBeenCalledWith(1, 3);
  });

  test('muestra mensaje cuando el carrito está vacío', () => {
    useCarrito.mockReturnValue(mockCarritoVacio);
    renderCarrito();
    
    expect(screen.getByText('No hay productos en el carrito.')).toBeInTheDocument();
  });
});