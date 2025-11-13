import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Producto from '../src/pages/Producto';

// Mocks
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>
}));

// Mock de useParams y useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
  };
});

// Mock de ProductosService
const mockProducto = {
  idProd: 1,
  nombreProd: 'Torta de Chocolate',
  precioProd: 45000,
  descProd: 'Deliciosa torta de chocolate',
  imagenProd: '/img/torta-chocolate.jpg'
};

vi.mock('../src/services/ProductosService', () => ({
  getProductosAdmin: vi.fn(() => [mockProducto])
}));

const renderProducto = () => {
  return render(
    <BrowserRouter>
      <Producto />
    </BrowserRouter>
  );
};

describe('Página Producto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza todos los componentes principales', () => {
    renderProducto();
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('muestra los detalles del producto', () => {
    renderProducto();
    
    expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Deliciosa torta de chocolate')).toBeInTheDocument();
    expect(screen.getByText(/\$45\.000/)).toBeInTheDocument();
    expect(screen.getByAltText('Torta de Chocolate')).toBeInTheDocument();
  });

  test('muestra botón volver al catálogo', () => {
    renderProducto();
    
    expect(screen.getByText('Volver al catálogo')).toBeInTheDocument();
  });

  test('navega hacia atrás cuando se hace clic en volver', () => {
    renderProducto();
    
    const botonVolver = screen.getByText('Volver al catálogo');
    botonVolver.click();
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});