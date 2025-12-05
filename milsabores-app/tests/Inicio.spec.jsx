import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// 🧁 Mock del CarritoContext
vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: () => ({
    agregarCarrito: vi.fn(),
    mostrarMensaje: vi.fn(),
    mensajeTexto: '',
  }),
}));

// 🧁 Mock de layout (Header / Navbar / Footer / HeroBanner)
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

vi.mock('../src/components/HeroBanner', () => ({
  default: ({ titulo, subtitulo }) => (
    <section data-testid="mock-hero">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </section>
  ),
}));

// 🧁 Mock de ProductoCard
vi.mock('../src/components/ProductoCard', () => ({
  default: ({ producto }) => (
    <div data-testid="producto-card">{producto.nombreProd}</div>
  ),
}));

// 🧁 Mock de api (ProductosService)
const mockGetProductos = vi.fn();

vi.mock('../src/services/ProductosService', () => ({
  api: {
    getProductos: () => mockGetProductos(),
  },
}));

import Inicio from '../src/pages/Inicio';

const renderInicio = () =>
  render(
    <BrowserRouter>
      <Inicio />
    </BrowserRouter>
  );

describe('Página Inicio', () => {
  const mockProductos = [
    {
      idProd: 1,
      nombreProd: 'Torta Destacada',
      descProd: 'Torta super rica',
      precioProd: 10000,
      imagenProd: '/img/torta1.jpg',
      productoDestacado: true,
      categProd: 'Tortas Circulares',
    },
    {
      idProd: 2,
      nombreProd: 'Kuchen No Destacado',
      descProd: 'Kuchen normal',
      precioProd: 8000,
      imagenProd: '/img/kuchen.jpg',
      productoDestacado: false,
      categProd: 'Pastelería Tradicional',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProductos.mockResolvedValue(mockProductos);
  });

  test('muestra estado de carga y luego los productos destacados', async () => {
    renderInicio();

    // ⏳ Estado de carga inicial
    expect(
      screen.getByText('🔄 Cargando productos destacados...')
    ).toBeInTheDocument();

    // Esperar a que se resuelva la llamada a la API
    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    // Hero correcto
    expect(
      screen.getByText('Bienvenidos a Pastelería Mil Sabores')
    ).toBeInTheDocument();
    expect(
      screen.getByText('¡Ahora estamos a un paso más cerca de ti!')
    ).toBeInTheDocument();

    // Título de sección destacados
    expect(
      screen.getByText('Productos Destacados')
    ).toBeInTheDocument();

    // Solo el producto destacado debe aparecer en la sección
    expect(
      screen.getByText('Torta Destacada')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Kuchen No Destacado')
    ).not.toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay productos destacados', async () => {
    // 🔁 Sobrescribimos el mock para este test
    mockGetProductos.mockResolvedValueOnce([
      { ...mockProductos[0], productoDestacado: false },
      { ...mockProductos[1], productoDestacado: false },
    ]);

    renderInicio();

    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText('No hay productos destacados en este momento.')
    ).toBeInTheDocument();

    // No debería haber tarjetas de producto destacadas
    expect(screen.queryByTestId('producto-card')).not.toBeInTheDocument();
  });

  test('renderiza la sección de playlist con el iframe de Spotify', async () => {
    renderInicio();

    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText('Mil Sabores de: Septiembre 2025 🎶')
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Playlist mensual curada por nuestro #TeamMilSabores/i)
    ).toBeInTheDocument();

    const iframe = screen.getByTestId('embed-iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      'https://open.spotify.com/embed/playlist/0zu1O3HiwPYjV2hy9xHYOm?utm_source=generator'
    );
  });

  test('renderiza Header, Navbar y Footer', async () => {
    renderInicio();

    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
});
