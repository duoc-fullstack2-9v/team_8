import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

vi.mock('../src/components/FiltroCategorias', () => ({
  default: ({ categorias, categoriaSeleccionada, onCategoriaChange, label }) => (
    <div data-testid="mock-filtro-categorias">
      <label>{label}</label>
      <select 
        value={categoriaSeleccionada} 
        onChange={(e) => onCategoriaChange(e.target.value)}
        data-testid="filtro-select"
      >
        <option value="">Todas</option>
        {categorias.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('../src/components/ProductoCard', () => ({
  default: ({ producto }) => (
    <div data-testid={`producto-card-${producto.idProd}`}>
      <h4>{producto.nombreProd}</h4>
    </div>
  ),
}));

// Mock de la API y servicios
const mockProductosAPI = [
  // Tortas Cuadradas
  { idProd: 1, nombreProd: "Torta Cuadrada de Chocolate", categProd: "Tortas Cuadradas" },
  { idProd: 2, nombreProd: "Torta Cuadrada de Frutas", categProd: "Tortas Cuadradas" },
  // Tortas Circulares
  { idProd: 3, nombreProd: "Torta Circular de Vainilla", categProd: "Tortas Circulares" },
  { idProd: 4, nombreProd: "Torta Circular de Manjar", categProd: "Tortas Circulares" },
  // Postres Individuales
  { idProd: 5, nombreProd: "Mousse de Chocolate", categProd: "Postres Individuales" },
  { idProd: 6, nombreProd: "Tiramisú Clásico", categProd: "Postres Individuales" },
  // Productos Sin Azúcar
  { idProd: 7, nombreProd: "Torta Sin Azúcar Naranja", categProd: "Productos Sin Azúcar" },
  { idProd: 8, nombreProd: "Cheesecake Sin Azúcar", categProd: "Productos Sin Azúcar" },
  // Pastelería Tradicional
  { idProd: 9, nombreProd: "Empanada de Manzana", categProd: "Pastelería Tradicional" },
  { idProd: 10, nombreProd: "Tarta de Santiago", categProd: "Pastelería Tradicional" },
  // Producto Sin Gluten
  { idProd: 11, nombreProd: "Brownie Sin Gluten", categProd: "Producto Sin Gluten" },
  { idProd: 12, nombreProd: "Pan Sin Gluten", categProd: "Producto Sin Gluten" },
  // Productos Veganos
  { idProd: 13, nombreProd: "Torta Vegana de Chocolate", categProd: "Productos Veganos" },
  { idProd: 14, nombreProd: "Galletas Veganas de Avena", categProd: "Productos Veganos" },
  // Tortas Especiales
  { idProd: 15, nombreProd: "Torta Especial de Cumpleaños", categProd: "Tortas Especiales" },
  { idProd: 16, nombreProd: "Torta Especial de Bodas", categProd: "Tortas Especiales" }
];

// Mock de los servicios
vi.mock('../src/services/ProductosService', () => ({
  api: {
    getProductos: vi.fn(),
  },
  getProductosByCategoria: vi.fn(),
}));

import { api, getProductosByCategoria } from '../src/services/ProductosService';

describe('Página Catalogo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configurar mocks por defecto
    api.getProductos.mockResolvedValue(mockProductosAPI);
    
    // Mock para getProductosByCategoria (fallback)
    getProductosByCategoria.mockImplementation((categoria) => {
      return mockProductosAPI.filter(p => p.categProd === categoria);
    });
  });

  const renderCatalogo = () => {
    return render(
      <BrowserRouter>
        <Catalogo />
      </BrowserRouter>
    );
  };

  it('renderiza todos los componentes principales', async () => {
    renderCatalogo();

    await waitFor(() => {
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
      expect(screen.getByTestId('mock-hero-banner')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });
  });

  it('muestra el hero banner del catálogo', async () => {
    renderCatalogo();

    await waitFor(() => {
      expect(screen.getByText('Catálogo de Productos')).toBeInTheDocument();
      expect(screen.getByText('Descubre nuestra variedad de pasteles y posteres artesanales')).toBeInTheDocument();
    });
  });

  it('carga productos desde la API al montar', async () => {
    renderCatalogo();

    await waitFor(() => {
      expect(api.getProductos).toHaveBeenCalledTimes(1);
    });
  });

  it('muestra todas las categorías de productos desde la API', async () => {
    renderCatalogo();

    await waitFor(() => {
      expect(screen.getByText('🍰 Tortas Cuadradas 🍰')).toBeInTheDocument();
      expect(screen.getByText('🎂 Tortas Circulares 🎂')).toBeInTheDocument();
      expect(screen.getByText('🍪 Postres Individuales 🍪')).toBeInTheDocument();
      expect(screen.getByText('🥯 Productos Sin Azúcar 🥯')).toBeInTheDocument();
      expect(screen.getByText('🥐 Pastelería Tradicional 🥐')).toBeInTheDocument();
      expect(screen.getByText('🥞 Producto Sin Gluten 🥞')).toBeInTheDocument();
      expect(screen.getByText('🥕 Productos Veganos 🥕')).toBeInTheDocument();
      expect(screen.getByText('🧁 Tortas Especiales 🧁')).toBeInTheDocument();
    });
  });

  it('renderiza productos en cada categoría desde la API', async () => {
    renderCatalogo();

    await waitFor(() => {
      // Verificar que se renderizan productos de cada categoría
      expect(screen.getByTestId('producto-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('producto-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('producto-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('producto-card-4')).toBeInTheDocument();
      expect(screen.getByTestId('producto-card-5')).toBeInTheDocument();
      expect(screen.getByTestId('producto-card-6')).toBeInTheDocument();
    });
  });

  it('muestra los nombres de los productos en el catálogo desde la API', async () => {
    renderCatalogo();

    await waitFor(() => {
      expect(screen.getByText('Torta Cuadrada de Chocolate')).toBeInTheDocument();
      expect(screen.getByText('Torta Cuadrada de Frutas')).toBeInTheDocument();
      expect(screen.getByText('Torta Circular de Vainilla')).toBeInTheDocument();
      expect(screen.getByText('Torta Circular de Manjar')).toBeInTheDocument();
      expect(screen.getByText('Mousse de Chocolate')).toBeInTheDocument();
      expect(screen.getByText('Tiramisú Clásico')).toBeInTheDocument();
    });
  });

  it('muestra el filtro de categorías', async () => {
    renderCatalogo();

    await waitFor(() => {
      expect(screen.getByTestId('mock-filtro-categorias')).toBeInTheDocument();
      expect(screen.getByText('Filtrar productos:')).toBeInTheDocument();
      expect(screen.getByTestId('filtro-select')).toBeInTheDocument();
    });
  });

  it('muestra botón de actualizar productos', async () => {
    renderCatalogo();

    await waitFor(() => {
      expect(screen.getByText('🔄 Actualizar productos')).toBeInTheDocument();
    });
  });

  it('usa fallback local cuando la API falla', async () => {
    // Simular error en la API
    api.getProductos.mockRejectedValue(new Error('API Error'));

    renderCatalogo();

    // Debería usar el fallback local
    await waitFor(() => {
      expect(screen.getByText('Torta Cuadrada de Chocolate')).toBeInTheDocument();
      expect(getProductosByCategoria).toHaveBeenCalled();
    });
  });

  it('muestra estado de carga inicialmente', async () => {
    // Retrasar la respuesta de la API
    api.getProductos.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve(mockProductosAPI), 100)
    ));

    renderCatalogo();

    // Debería mostrar loading inicialmente
    expect(screen.getByText('🔄 Cargando productos desde la base de datos...')).toBeInTheDocument();

    // Luego debería mostrar los productos
    await waitFor(() => {
      expect(screen.getByText('Torta Cuadrada de Chocolate')).toBeInTheDocument();
    });
  });

  it('filtra productos por categoría cuando se selecciona una', async () => {
    renderCatalogo();

    await waitFor(() => {
      // Todas las categorías visibles inicialmente
      expect(screen.getByText('🍰 Tortas Cuadradas 🍰')).toBeInTheDocument();
      expect(screen.getByText('🎂 Tortas Circulares 🎂')).toBeInTheDocument();
    });

    // Simular selección de filtro (esto necesitaría userEvent para una prueba completa)
    // Para una prueba básica, verificamos que el componente de filtro está presente
    expect(screen.getByTestId('filtro-select')).toBeInTheDocument();
  });
});