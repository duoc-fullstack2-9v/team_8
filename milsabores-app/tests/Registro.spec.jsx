import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Registro from '../src/components/Registro';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

// Mock de window.alert
global.alert = vi.fn();

describe('Componente Registro', () => {
  const mockOnNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
  });

  const renderRegistro = () => {
    return render(<Registro onNavigate={mockOnNavigate} />);
  };

  test('renderiza el formulario de registro', () => {
    renderRegistro();
    
    expect(screen.getByText('📝 Crea tu cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre(s)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apellido(s)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver al login/i })).toBeInTheDocument();
  });

  test('permite escribir en los campos del formulario', async () => {
    const user = userEvent.setup();
    renderRegistro();
    
    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Apellido(s)'), 'Pérez');
    await user.type(screen.getByPlaceholderText('Correo Electrónico'), 'juan@example.com');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'password123');
    
    expect(screen.getByPlaceholderText('Nombre(s)')).toHaveValue('Juan');
    expect(screen.getByPlaceholderText('Apellido(s)')).toHaveValue('Pérez');
    expect(screen.getByPlaceholderText('Correo Electrónico')).toHaveValue('juan@example.com');
    expect(screen.getByPlaceholderText('Contraseña')).toHaveValue('password123');
  });

  test('muestra mensaje de error cuando faltan campos obligatorios', async () => {
    const user = userEvent.setup();
    renderRegistro();
    
    // Solo llenar algunos campos
    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    // No llenar email y password
    
    await user.click(screen.getByRole('button', { name: /registrarse/i }));
    
    expect(screen.getByText('Completa todos los campos.')).toBeInTheDocument();
  });

  test('muestra mensaje de error cuando el email ya existe', async () => {
    const user = userEvent.setup();
    
    // Mock: usuario ya existe
    const usuariosExistentes = [{ emailUser: 'existente@example.com' }];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(usuariosExistentes));
    
    renderRegistro();
    
    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Correo Electrónico'), 'existente@example.com');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'password123');
    
    await user.click(screen.getByRole('button', { name: /registrarse/i }));
    
    expect(screen.getByText(/ya está asociado a usuario registrado/)).toBeInTheDocument();
  });

  test('registra usuario exitosamente y navega a login', async () => {
    const user = userEvent.setup();
    renderRegistro();
    
    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Apellido(s)'), 'Pérez');
    await user.type(screen.getByPlaceholderText('Correo Electrónico'), 'nuevo@example.com');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'password123');
    
    await user.click(screen.getByRole('button', { name: /registrarse/i }));
    
    expect(alert).toHaveBeenCalledWith('¡Cuenta creada exitosamente para Juan!');
    expect(mockOnNavigate).toHaveBeenCalledWith('login');
  });

  test('navega a login cuando se hace clic en "Volver al login"', async () => {
    const user = userEvent.setup();
    renderRegistro();
    
    await user.click(screen.getByRole('button', { name: /volver al login/i }));
    
    expect(mockOnNavigate).toHaveBeenCalledWith('login-page');
  });
});