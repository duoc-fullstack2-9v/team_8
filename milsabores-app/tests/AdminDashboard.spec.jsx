import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../src/pages/AdminDashboard.jsx';

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

vi.mock('../src/components/FiltroCategorias', () => ({
  default: ({ categorias, categoriaSeleccionada, onCategoriaChange }) => (
    <div data-testid="mock-filtro">
      <select 
        value={categoriaSeleccionada} 
        onChange={(e) => onCategoriaChange(e.target.value)}
        data-testid="filtro-select"
      >
        {categorias.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  )
}));

// Mock de servicios
vi.mock('../src/services/ProductosService', () => ({
  getProductosAdmin: vi.fn(),
  agregarProducto: vi.fn(),
  editarProducto: vi.fn(),
  eliminarProducto: vi.fn(),
  restaurarProductosBase: vi.fn(),
  getCategorias: vi.fn()
}));

import * as ProductosService from '../src/services/ProductosService';

// Mock de navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockProductos = [
  {
    idProd: 1,
    nombreProd: 'Torta de Chocolate',
    precioProd: 45000,
    categProd: 'Tortas',
    descProd: 'Deliciosa torta de chocolate',
    imagenProd: '/img/torta-chocolate.jpg'
  },
  {
    idProd: 2,
    nombreProd: 'Cheesecake',
    precioProd: 47000,
    categProd: 'Postres',
    descProd: 'Suave cheesecake',
    imagenProd: '/img/cheesecake.jpg'
  }
];

const mockCategorias = ['Tortas', 'Postres', 'Galletas'];

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );
};

describe('Página AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage para admin
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    global.localStorage = localStorageMock;
    localStorageMock.getItem.mockReturnValue('admin');
    
    // Mock de servicios
    ProductosService.getProductosAdmin.mockReturnValue(mockProductos);
    ProductosService.getCategorias.mockReturnValue(mockCategorias);
    ProductosService.eliminarProducto.mockReturnValue(mockProductos.filter(p => p.idProd !== 1));
  });

  test('renderiza todos los componentes principales', () => {
    renderDashboard();
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('muestra el título del dashboard', () => {
    renderDashboard();
    
    expect(screen.getByText(/Panel de Administración - Pastelería Mil Sabores/i)).toBeInTheDocument();
  });

  test('muestra los botones de acción del admin', () => {
    renderDashboard();
    
    expect(screen.getByRole('button', { name: /volver al sitio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restaurar originales/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar producto/i })).toBeInTheDocument();
  });

  test('muestra el componente de filtro', () => {
    renderDashboard();
    
    expect(screen.getByTestId('mock-filtro')).toBeInTheDocument();
  });

  test('muestra los productos correctamente', () => {
    renderDashboard();
    
    expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Cheesecake')).toBeInTheDocument();
    expect(screen.getByText(/2 producto\(s\)/i)).toBeInTheDocument();
  });

    test('muestra las categorías de los productos', () => {
    renderDashboard();

    const elementosTortas = screen.getAllByText('Tortas');
    const elementosPostres = screen.getAllByText('Postres');
    
    expect(elementosTortas.length).toBeGreaterThan(0);
    expect(elementosPostres.length).toBeGreaterThan(0);
    });

  test('muestra botones de editar y eliminar para cada producto', () => {
    renderDashboard();
    
    const botonesEditar = screen.getAllByRole('button', { name: /editar/i });
    const botonesEliminar = screen.getAllByRole('button', { name: /eliminar/i });
    
    expect(botonesEditar).toHaveLength(2);
    expect(botonesEliminar).toHaveLength(2);
  });

  test('redirige a login si no es admin', () => {
    localStorage.getItem.mockReturnValue('user'); // No es admin
    
    renderDashboard();
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('cierra sesión correctamente', async () => {
    const user = userEvent.setup();
    renderDashboard();
    
    const botonCerrarSesion = screen.getByRole('button', { name: /cerrar sesión/i });
    await user.click(botonCerrarSesion);
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('userRole');
    expect(localStorage.removeItem).toHaveBeenCalledWith('sesionActiva');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});