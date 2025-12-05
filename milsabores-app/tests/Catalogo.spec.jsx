import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// 🧁 Mock de CarritoContext
vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: () => ({
    agregarCarrito: vi.fn(),
    mostrarMensaje: vi.fn(),
    mensajeTexto: '',
  }),
}));

// 🧁 Mock de componentes de layout
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
    <div data-testid="mock-hero">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </div>
  ),
}));

// 🧁 Mock de ProductoCard (solo muestra el nombre)
vi.mock('../src/components/ProductoCard', () => ({
  default: ({ producto }) => (
    <div data-testid="producto-card">{producto.nombreProd}</div>
  ),
}));

// 🧁 Mock de FiltroCategorias con 2 botones para cambiar el filtro
vi.mock('../src/components/FiltroCategorias', () => ({
  default: ({ categorias, onCategoriaChange, label }) => (
    <div data-testid="mock-filtro">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onCategoriaChange(categorias[0] || '')}
      >
        Filtrar primera categoría
      </button>
      <button
        type="button"
        onClick={() => onCategoriaChange('INEXISTENTE')}
      >
        Filtrar inexistente
      </button>
    </div>
  ),
}));

// 🧁 Mock de api (ProductosService)
const mockGetProductos = vi.fn();

vi.mock('../src/services/ProductosService', () => ({
  api: {
    getProductos: () => mockGetProductos(),
  },
}));

import Catalogo from '../src/pages/Catalogo';

const renderCatalogo = () =>
  render(
    <BrowserRouter>
      <Catalogo />
    </BrowserRouter>
  );

describe('Página Catalogo', () => {
  const mockProductos = [
    {
      idProd: 1,
      nombreProd: 'Torta Cuadrada Chocolate',
      descProd: 'Deliciosa torta',
      precioProd: 12000,
      categProd: 'Tortas Cuadradas',
      imagenProd: '/img/torta1.jpg',
    },
    {
      idProd: 2,
      nombreProd: 'Cheesecake Frutilla',
      descProd: 'Postre rico',
      precioProd: 15000,
      categProd: 'Postres Individuales',
      imagenProd: '/img/cheesecake.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProductos.mockResolvedValue(mockProductos);
  });

  test('muestra estado de carga y luego el catálogo con productos', async () => {
    renderCatalogo();

    // ⏳ Primero: estado de carga
    expect(
      screen.getByText('🔄 Cargando productos desde la base de datos...')
    ).toBeInTheDocument();

    // Esperamos a que termine la carga (loading = false)
    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    // 🧁 Hero renderizado
    expect(
      screen.getByText('Catálogo de Productos')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Descubre nuestra variedad de pasteles y postres artesanales')
    ).toBeInTheDocument();

    // Productos renderizados (a través del mock de ProductoCard)
    expect(
      screen.getByText('Torta Cuadrada Chocolate')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Cheesecake Frutilla')
    ).toBeInTheDocument();
  });

  test('llama a api.getProductos al montar y al hacer clic en "Actualizar productos"', async () => {
    const user = userEvent.setup();
    renderCatalogo();

    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    const btnActualizar = await screen.findByRole('button', {
      name: /actualizar productos/i,
    });

    await user.click(btnActualizar);

    // Se vuelve a llamar al cargar de nuevo
    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(2);
    });
  });

  test('muestra secciones por categoría y permite filtrar por la primera categoría', async () => {
    const user = userEvent.setup();
    renderCatalogo();

    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    // Ambas tarjetas visibles inicialmente
    expect(
      screen.getByText('Torta Cuadrada Chocolate')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Cheesecake Frutilla')
    ).toBeInTheDocument();

    // Filtrar por la primera categoría (Tortas Cuadradas)
    const btnFiltrarPrimera = screen.getByRole('button', {
      name: /filtrar primera categoría/i,
    });
    await user.click(btnFiltrarPrimera);

    // Debe quedar solo la de esa categoría
    expect(
      screen.getByText('Torta Cuadrada Chocolate')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Cheesecake Frutilla')
    ).not.toBeInTheDocument();
  });

  test('muestra mensaje cuando el filtro no tiene resultados', async () => {
    const user = userEvent.setup();
    renderCatalogo();

    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    const btnFiltrarInexistente = screen.getByRole('button', {
      name: /filtrar inexistente/i,
    });

    await user.click(btnFiltrarInexistente);

    // No hay productos en la categoría seleccionada
    expect(
      screen.getByText('No hay productos en la categoría seleccionada.')
    ).toBeInTheDocument();

    // Y no se muestran tarjetas de producto
    expect(screen.queryByTestId('producto-card')).not.toBeInTheDocument();
  });

  test('renderiza el filtro de categorías con el label correcto', async () => {
    renderCatalogo();

    await waitFor(() => {
      expect(mockGetProductos).toHaveBeenCalledTimes(1);
    });

    const filtro = screen.getByTestId('mock-filtro');
    expect(filtro).toBeInTheDocument();
    expect(
      screen.getByText('Filtrar productos:')
    ).toBeInTheDocument();
  });
});
