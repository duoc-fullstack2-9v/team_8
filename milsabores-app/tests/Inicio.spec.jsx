import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Inicio from '../src/pages/Inicio';

// Mock de useCarrito
const mockUseCarrito = {
  agregarCarrito: vi.fn(),
  mostrarMensaje: false,
  mensajeTexto: '',
};

vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: () => mockUseCarrito,
}));

// Mock de componentes hijos
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

vi.mock('../src/components/HeroBanner', () => ({
  default: ({ titulo, subtitulo }) => (
    <div data-testid="mock-hero-banner">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </div>
  ),
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

vi.mock('../src/components/ProductoCard', () => ({
  default: ({ producto }) => (
    <div data-testid={`producto-card-${producto.idProd}`}>
      <h3>{producto.nombreProd}</h3>
      <p>${producto.precioProd}</p>
    </div>
  ),
}));

// Mock de los datos de productos
vi.mock('../src/data/productos.js', () => ({
  productos: [
    { idProd: 2, nombreProd: 'Torta Cuadrada de Frutas', precioProd: 50000 },
    { idProd: 4, nombreProd: 'Torta Circular de Manjar', precioProd: 42000 },
    { idProd: 7, nombreProd: 'Torta Sin Azúcar Naranja', precioProd: 48000 },
    { idProd: 8, nombreProd: 'Cheesecake Sin Azúcar', precioProd: 47000 },
    { idProd: 9, nombreProd: 'Empanada de Manzana', precioProd: 3000 },
    { idProd: 14, nombreProd: 'Galletas Veganas de Avena', precioProd: 4500 },
  ],
}));

describe('Página Inicio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderInicio = () => {
    return render(
      <BrowserRouter>
        <Inicio />
      </BrowserRouter>
    );
  };

  it('renderiza todos los componentes principales', () => {
    renderInicio();

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('muestra el hero banner con título y subtítulo correctos', () => {
    renderInicio();

    expect(screen.getByText('Bienvenidos a Pastelería Mil Sabores')).toBeInTheDocument();
    expect(screen.getByText('¡Ahora estamos a un paso más cerca de ti!')).toBeInTheDocument();
  });

  it('muestra la sección de productos destacados', () => {
    renderInicio();

    expect(screen.getByText('Productos Destacados')).toBeInTheDocument();
  });

  it('renderiza los 6 productos destacados', () => {
    renderInicio();

    // Verificar que se renderizan los 6 productos destacados
    expect(screen.getByTestId('producto-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('producto-card-4')).toBeInTheDocument();
    expect(screen.getByTestId('producto-card-7')).toBeInTheDocument();
    expect(screen.getByTestId('producto-card-8')).toBeInTheDocument();
    expect(screen.getByTestId('producto-card-9')).toBeInTheDocument();
    expect(screen.getByTestId('producto-card-14')).toBeInTheDocument();
  });

  it('muestra los nombres de los productos destacados', () => {
    renderInicio();

    expect(screen.getByText('Torta Cuadrada de Frutas')).toBeInTheDocument();
    expect(screen.getByText('Torta Circular de Manjar')).toBeInTheDocument();
    expect(screen.getByText('Torta Sin Azúcar Naranja')).toBeInTheDocument();
    expect(screen.getByText('Cheesecake Sin Azúcar')).toBeInTheDocument();
    expect(screen.getByText('Empanada de Manzana')).toBeInTheDocument();
    expect(screen.getByText('Galletas Veganas de Avena')).toBeInTheDocument();
  });

  it('muestra el iframe de Spotify', () => {
    renderInicio();

    const iframe = screen.getByTitle('Playlist Spotify Mil Sabores');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://open.spotify.com/embed/playlist/0zu1O3HiwPYjV2hy9xHYOm?utm_source=generator');
  });

  it('muestra la descripción de la playlist', () => {
    renderInicio();

    expect(screen.getByText(/Playlist mensual curada por nuestro #TeamMilSabores/i)).toBeInTheDocument();
    expect(screen.getByText(/Visita nuestras sucursales ubicadas en la quinta costa/i)).toBeInTheDocument();
  });
});