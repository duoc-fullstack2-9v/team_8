import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/components/Login';

// Mock para useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock para localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

const renderLogin = (props = {}) => {
  const defaultProps = {
    onNavigate: vi.fn(),
    ...props
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
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
    
    // Mock window.location
    delete window.location;
    window.location = { search: '' };
  });

  test('renderiza el formulario de login', () => {
    renderLogin();
    
    // ADAPTADO: Buscar el texto exacto que tiene tu componente
    expect(screen.getByText('🔐 Inicia Sesión')).toBeInTheDocument();
    
    // ADAPTADO: Buscar por placeholder ya que no usas labels
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    
    // ADAPTADO: Verificar que los botones existen
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
  });

  test('permite escribir en los campos de email y password', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    // ADAPTADO: Buscar por placeholder
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('llama a onNavigate cuando se hace clic en Crear cuenta', async () => {
    const mockOnNavigate = vi.fn();
    const user = userEvent.setup();
    renderLogin({ onNavigate: mockOnNavigate });
    
    const botonRegistro = screen.getByRole('button', { name: 'Crear cuenta' });
    await user.click(botonRegistro);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('registro');
  });

  test('muestra mensaje de error cuando las credenciales son incorrectas', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const botonIngresar = screen.getByRole('button', { name: 'Ingresar' });
    
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(botonIngresar);
    
    expect(screen.getByText('Correo y/o contraseña incorrecta. Intente nuevamente.')).toBeInTheDocument();
  });

  test('muestra mensaje de registro exitoso cuando viene del registro', () => {
    // Simular que viene del registro
    window.location.search = '?registro=ok';
    
    renderLogin();
    
    expect(screen.getByText('¡Cuenta creada! Ahora puedes iniciar sesión')).toBeInTheDocument();
  });

  test('realiza login exitoso con credenciales correctas', async () => {
    const user = userEvent.setup();
    
    const usuariosMock = [
      {
        emailUser: 'test@example.com',
        password: 'password123',
        nomUser: 'Test User'
      }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(usuariosMock));
    
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const botonIngresar = screen.getByRole('button', { name: 'Ingresar' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(botonIngresar);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('sesionActiva', 'test@example.com');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userRole', 'user');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});