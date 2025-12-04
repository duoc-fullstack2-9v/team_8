import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../src/pages/AdminDashboard.jsx';

// 🧩 Mocks de layout
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

// 🧭 Mock de useNavigate
let mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );
};

describe('Página AdminDashboard', () => {
  let localStorageMock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn();

    // 🔐 Mock de localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock;
  });

  test('renderiza Header, Navbar y Footer', () => {
    // Simular admin logueado
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    renderDashboard();

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('muestra el título y subtítulo del panel de administración', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    renderDashboard();

    expect(
      screen.getByText('Panel de Administración')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Selecciona una sección para administrar.')
    ).toBeInTheDocument();
  });

  test('muestra tarjetas de acceso a Productos y Usuarios', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    renderDashboard();

    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(
      screen.getByText('Gestiona el catálogo de productos de la pastelería.')
    ).toBeInTheDocument();

    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(
      screen.getByText('Administra cuentas, roles y correos de los usuarios.')
    ).toBeInTheDocument();
  });

  test('redirige a login si NO hay sesión o no es admin', () => {
    // Caso: usuario logueado pero no admin
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'user';
      if (key === 'sesionActiva') return 'cliente@milsabores.cl';
      return null;
    });

    renderDashboard();

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('NO redirige si hay sesión admin válida', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    renderDashboard();

    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
  });

  test('al hacer clic en la tarjeta de Productos navega a /admin/productos', async () => {
    const user = userEvent.setup();

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    renderDashboard();

    const cardProductos = screen.getByText('Productos').closest('.admin-access-card');
    await user.click(cardProductos);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/productos');
  });

  test('al hacer clic en la tarjeta de Usuarios navega a /admin/usuarios', async () => {
    const user = userEvent.setup();

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    renderDashboard();

    const cardUsuarios = screen.getByText('Usuarios').closest('.admin-access-card');
    await user.click(cardUsuarios);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/usuarios');
  });

  test('el botón "Cerrar Sesión" limpia localStorage y navega a "/"', async () => {
    const user = userEvent.setup();

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    renderDashboard();

    const btnCerrarSesion = screen.getByRole('button', {
      name: /cerrar sesión/i,
    });

    await user.click(btnCerrarSesion);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userRole');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('sesionActiva');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
