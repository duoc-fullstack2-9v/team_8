import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../src/components/Header';

vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

import { useCarrito } from '../src/context/CarritoContext';

let mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { BrowserRouter } from 'react-router-dom';

const renderHeader = (totalItems = 3) => {
  useCarrito.mockReturnValue({
    carrito: totalItems > 0 ? Array(totalItems).fill({}) : [],
    totalItems,
  });

  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Componente Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockNavigate = vi.fn();
  });

  test('renderiza el logo de la pastelería', () => {
    renderHeader();

    const logo = screen.getByAltText('Logo Pastelería Mil Sabores');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');
  });

  test('muestra el título y subtítulo de la pastelería', () => {
    renderHeader();

    expect(
      screen.getByText('Pastelería Mil Sabores')
    ).toBeInTheDocument();
    expect(
      screen.getByText('50 años endulzando tus recuerdos')
    ).toBeInTheDocument();
  });

  test('el título de la pastelería navega al inicio (href="/")', async () => {
    const user = userEvent.setup();
    renderHeader();

    const titleLink = screen
      .getByText('Pastelería Mil Sabores')
      .closest('a');

    expect(titleLink).toHaveAttribute('href', '/');
    await user.click(titleLink);
  });

  test('muestra el contador del carrito con el valor correcto', () => {
    renderHeader(5);

    const contador = screen.getByText('5');
    expect(contador).toBeInTheDocument();
    expect(contador).toHaveAttribute('id', 'cart-count');
  });

  test('muestra 0 cuando el carrito está vacío', () => {
    renderHeader(0);

    const contador = screen.getByText('0');
    expect(contador).toBeInTheDocument();
  });

  test('renderiza los íconos de carrito y usuario (estado no autenticado)', () => {
    renderHeader();

    const cartIcon = screen.getByAltText('Logo carrito');
    const userIcon = screen.getByAltText('Logo Usuario');

    expect(cartIcon).toBeInTheDocument();
    expect(userIcon).toBeInTheDocument();
  });

  test('el logo navega al inicio (href="/")', async () => {
    const user = userEvent.setup();
    renderHeader();

    const logoLink = screen
      .getByAltText('Logo Pastelería Mil Sabores')
      .closest('a');

    expect(logoLink).toHaveAttribute('href', '/');
    await user.click(logoLink);
  });

  test('el ícono de carrito navega a /carrito', async () => {
    const user = userEvent.setup();
    renderHeader();

    const cartLink = screen.getByAltText('Logo carrito').closest('a');
    expect(cartLink).toHaveAttribute('href', '/carrito');

    await user.click(cartLink);
  });

  test('cuando NO hay sesión, el ícono de usuario navega a /login', async () => {
    const user = userEvent.setup();
    renderHeader();

    const userLink = screen.getByAltText('Logo Usuario').closest('a');

    expect(userLink).toHaveAttribute('href', '/login');
    await user.click(userLink);
  });

  test('cuando hay sesión CLIENTE, muestra "Hola, <userName>" y menú desplegable', async () => {
    const user = userEvent.setup();

    localStorage.setItem('token', 'fake.token');
    localStorage.setItem('userRole', 'user'); 
    localStorage.setItem('userName', 'Rene');

    renderHeader();

    // Ya no debe haber link a /login
    expect(
      screen.queryByText('Iniciar sesión')
    ).not.toBeInTheDocument();

    // Botón que abre el menú
    const trigger = screen.getByRole('button', {
      name: /Hola, Rene/i,
    });
    expect(trigger).toBeInTheDocument();

    // Abro el menú
    await user.click(trigger);

    // Debe aparecer "Mi perfil" y "Cerrar sesión", pero NO "Panel de administración"
    expect(screen.getByText('Mi perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
    expect(
      screen.queryByText('Panel de administración')
    ).not.toBeInTheDocument();
  });

  test('al hacer clic en "Cerrar sesión" borra localStorage y navega a "/"', async () => {
    const user = userEvent.setup();

    localStorage.setItem('token', 'fake.token');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userName', 'Rene');
    localStorage.setItem('sesionActiva', 'rene@garrido.cl');

    renderHeader();

    const trigger = screen.getByRole('button', {
      name: /Hola, Rene/i,
    });
    await user.click(trigger);

    const btnLogout = screen.getByText('Cerrar sesión');
    await user.click(btnLogout);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
    expect(localStorage.getItem('sesionActiva')).toBeNull();
    expect(localStorage.getItem('userName')).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // ============================
  // 🛠 Estado autenticado (ADMIN)
  // ============================
  test('cuando el usuario es ADMIN, el menú muestra "Panel de administración"', async () => {
    const user = userEvent.setup();

    localStorage.setItem('token', 'fake.token');
    localStorage.setItem('userRole', 'admin'); // rol front
    localStorage.setItem('userName', 'Admin');

    renderHeader();

    const trigger = screen.getByRole('button', {
      name: /Hola, Admin/i,
    });
    await user.click(trigger);

    expect(
      screen.getByText('Panel de administración')
    ).toBeInTheDocument();
  });

  test('clic en "Panel de administración" navega a /admin_dashboard', async () => {
    const user = userEvent.setup();

    localStorage.setItem('token', 'fake.token');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userName', 'Admin');

    renderHeader();

    const trigger = screen.getByRole('button', {
      name: /Hola, Admin/i,
    });
    await user.click(trigger);

    const btnAdmin = screen.getByText('Panel de administración');
    await user.click(btnAdmin);

    expect(mockNavigate).toHaveBeenCalledWith('/admin_dashboard');
  });

  test('clic en "Mi perfil" navega a /perfil', async () => {
    const user = userEvent.setup();

    localStorage.setItem('token', 'fake.token');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userName', 'Rene');

    renderHeader();

    const trigger = screen.getByRole('button', {
      name: /Hola, Rene/i,
    });
    await user.click(trigger);

    const btnPerfil = screen.getByText('Mi perfil');
    await user.click(btnPerfil);

    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });
});
