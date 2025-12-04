import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../src/components/Login';

vi.mock('../src/services/AuthService', () => ({
  loginRequest: vi.fn(),
}));

import { loginRequest } from '../src/services/AuthService';

let mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: actual.BrowserRouter,
  };
});

import { BrowserRouter } from 'react-router-dom';

const renderLogin = (props = {}) => {
  const defaultProps = {
    onNavigate: vi.fn(),
    ...props,
  };

  return render(
    <BrowserRouter>
      <Login {...defaultProps} />
    </BrowserRouter>
  );
};

describe('Componente Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Resetear query string
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
    });
  });

  test('renderiza el formulario de login', () => {
    renderLogin();

    expect(
      screen.getByText('🔐 Inicia Sesión')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Correo electrónico')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Contraseña')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ingresar' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Crear cuenta' })
    ).toBeInTheDocument();
  });

  test('permite escribir en los campos de email y password', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('muestra mensaje de error si se intenta ingresar con campos vacíos', async () => {
    const user = userEvent.setup();
    renderLogin();

    const botonIngresar = screen.getByRole('button', { name: 'Ingresar' });
    await user.click(botonIngresar);

    expect(
      screen.getByText('Por favor, completa todos los campos.')
    ).toBeInTheDocument();
    expect(loginRequest).not.toHaveBeenCalled();
  });

  test('muestra error si el correo tiene formato inválido', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const botonIngresar = screen.getByRole('button', { name: 'Ingresar' });

    await user.type(emailInput, 'correo-invalido');
    await user.type(passwordInput, 'password123');
    await user.click(botonIngresar);

    expect(
      screen.getByText('Por favor, ingresa un correo electrónico válido.')
    ).toBeInTheDocument();
    expect(loginRequest).not.toHaveBeenCalled();
  });

  test('muestra error si la contraseña tiene menos de 6 caracteres', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const botonIngresar = screen.getByRole('button', { name: 'Ingresar' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123');
    await user.click(botonIngresar);

    expect(
      screen.getByText('La contraseña debe tener al menos 6 caracteres.')
    ).toBeInTheDocument();
    expect(loginRequest).not.toHaveBeenCalled();
  });

  test('llama a onNavigate cuando se hace clic en "Crear cuenta"', async () => {
    const mockOnNavigate = vi.fn();
    const user = userEvent.setup();

    renderLogin({ onNavigate: mockOnNavigate });

    const botonRegistro = screen.getByRole('button', { name: 'Crear cuenta' });
    await user.click(botonRegistro);

    expect(mockOnNavigate).toHaveBeenCalledWith('registro');
  });

  test('muestra mensaje de registro exitoso cuando viene del registro', () => {
    window.location.search = '?registro=ok';

    renderLogin();

    expect(
      screen.getByText('¡Cuenta creada! Ahora puedes iniciar sesión')
    ).toBeInTheDocument();
  });

  test('login exitoso como CLIENTE: guarda datos en localStorage y navega al inicio', async () => {
    const user = userEvent.setup();

    // Mock de respuesta del backend
    loginRequest.mockResolvedValue({
      tipo: 'Bearer',
      mensaje: 'Login exitoso',
      token: 'fake-client-token',
      usuario: {
        idUsuario: 5,
        nombreUsuario: 'Rene',
        apellidoUsuario: 'Garrido',
        emailUsuario: 'rene@garrido.cl',
        rolUsuario: 'CLIENTE',
      },
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const botonIngresar = screen.getByRole('button', { name: 'Ingresar' });

    await user.type(emailInput, 'rene@garrido.cl');
    await user.type(passwordInput, 'password123');
    await user.click(botonIngresar);

    await waitFor(() => {
      expect(loginRequest).toHaveBeenCalledWith('rene@garrido.cl', 'password123');

      expect(localStorage.getItem('token')).toBe('fake-client-token');
      expect(localStorage.getItem('sesionActiva')).toBe('rene@garrido.cl');
      expect(localStorage.getItem('userRole')).toBe('user');

      // ya no estamos guardando userName en Login, así que no lo testeamos
      expect(mockNavigate).toHaveBeenCalledWith('/');

    });
  });

  test('login exitoso como ADMIN: guarda datos y navega al dashboard', async () => {
    const user = userEvent.setup();

    loginRequest.mockResolvedValue({
      tipo: 'Bearer',
      mensaje: 'Login exitoso',
      token: 'fake-admin-token',
      usuario: {
        idUsuario: 1,
        nombreUsuario: 'Admin',
        apellidoUsuario: 'Chavez',
        emailUsuario: 'admin@milsabores.cl',
        rolUsuario: 'ADMIN',
      },
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const botonIngresar = screen.getByRole('button', { name: 'Ingresar' });

    await user.type(emailInput, 'admin@milsabores.cl');
    await user.type(passwordInput, 'admin123');
    await user.click(botonIngresar);

    await waitFor(() => {
      expect(loginRequest).toHaveBeenCalledWith('admin@milsabores.cl', 'admin123');

      expect(localStorage.getItem('token')).toBe('fake-admin-token');
      expect(localStorage.getItem('sesionActiva')).toBe('admin');
      expect(localStorage.getItem('userRole')).toBe('admin'); // mapeo ADMIN -> 'admin'

      expect(mockNavigate).toHaveBeenCalledWith('/admin_dashboard');
    });
  });

  test('muestra mensaje de error cuando el backend rechaza el login', async () => {
    const user = userEvent.setup();

    loginRequest.mockRejectedValue(new Error('Credenciales inválidas'));

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const botonIngresar = screen.getByRole('button', { name: 'Ingresar' });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(botonIngresar);

    expect(loginRequest).toHaveBeenCalled();

    expect(
      await screen.findByText('Correo y/o contraseña incorrecta. Intente nuevamente.')
    ).toBeInTheDocument();
  });
});
