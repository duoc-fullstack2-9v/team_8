import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Catalogo from '../src/pages/Catalogo';

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
      <h4>{producto.nombreProd}</h4>
    </div>
  ),
}));

// Mock de los datos de productos por categoría
vi.mock('../src/data/productos.js', () => ({
  categoriaProductos: {
    "Tortas Cuadradas": [
      { idProd: 1, nombreProd: "Torta Cuadrada de Chocolate" },
      { idProd: 2, nombreProd: "Torta Cuadrada de Frutas" }
    ],
    "Tortas Circulares": [
      { idProd: 3, nombreProd: "Torta Circular de Vainilla" },
      { idProd: 4, nombreProd: "Torta Circular de Manjar" }
    ],
    "Postres Individuales": [
      { idProd: 5, nombreProd: "Mousse de Chocolate" },
      { idProd: 6, nombreProd: "Tiramisú Clásico" }
    ],
    "Productos Sin Azúcar": [
      { idProd: 7, nombreProd: "Torta Sin Azúcar Naranja" },
      { idProd: 8, nombreProd: "Cheesecake Sin Azúcar" }
    ],
    "Pastelería Tradicional": [
      { idProd: 9, nombreProd: "Empanada de Manzana" },
      { idProd: 10, nombreProd: "Tarta de Santiago" }
    ],
    "Producto Sin Gluten": [
      { idProd: 11, nombreProd: "Brownie Sin Gluten" },
      { idProd: 12, nombreProd: "Pan Sin Gluten" }
    ],
    "Productos Veganos": [
      { idProd: 13, nombreProd: "Torta Vegana de Chocolate" },
      { idProd: 14, nombreProd: "Galletas Veganas de Avena" }
    ],
    "Tortas Especiales": [
      { idProd: 15, nombreProd: "Torta Especial de Cumpleaños" },
      { idProd: 16, nombreProd: "Torta Especial de Bodas" }
    ]
  }
}));

describe('Página Catalogo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCatalogo = () => {
    return render(
      <BrowserRouter>
        <Catalogo />
      </BrowserRouter>
    );
  };

  it('renderiza todos los componentes principales', () => {
    renderCatalogo();

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('muestra el hero banner del catálogo', () => {
    renderCatalogo();

    expect(screen.getByText('Catálogo de Productos')).toBeInTheDocument();
    expect(screen.getByText('Descubre nuestra variedad de pasteles y posteres artesanales')).toBeInTheDocument();
  });

  it('muestra todas las categorías de productos', () => {
    renderCatalogo();

    // Verificar que se muestran todas las categorías
    expect(screen.getByText('🍰 Tortas Cuadradas 🍰')).toBeInTheDocument();
    expect(screen.getByText('🎂 Tortas Circulares 🎂')).toBeInTheDocument();
    expect(screen.getByText('🍪 Postres Individuales 🍪')).toBeInTheDocument();
    expect(screen.getByText('🥯 Productos Sin Azúcar 🥯')).toBeInTheDocument();
    expect(screen.getByText('🥐 Pastelería Tradicional 🥐')).toBeInTheDocument();
    expect(screen.getByText('🥞 Producto Sin Gluten 🥞')).toBeInTheDocument();
    expect(screen.getByText('🥕 Productos Veganos 🥕')).toBeInTheDocument();
    expect(screen.getByText('🧁 Tortas Especiales 🧁')).toBeInTheDocument();
  });

  it('renderiza productos en cada categoría', () => {
    renderCatalogo();

    // Verificar que se renderizan productos de cada categoría
    expect(screen.getByTestId('producto-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('producto-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('producto-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('producto-card-4')).toBeInTheDocument();
  });

  it('muestra los nombres de los productos en el catálogo', () => {
    renderCatalogo();

    expect(screen.getByText('Torta Cuadrada de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Torta Cuadrada de Frutas')).toBeInTheDocument();
    expect(screen.getByText('Torta Circular de Vainilla')).toBeInTheDocument();
    expect(screen.getByText('Torta Circular de Manjar')).toBeInTheDocument();
  });
});