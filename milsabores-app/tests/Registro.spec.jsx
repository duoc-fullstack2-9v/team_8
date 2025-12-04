import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Registro from '../src/components/Registro';

// 🧪 Mock del servicio que llama al backend
vi.mock('../src/services/UsuariosService', () => ({
  crearUsuario: vi.fn(),
}));

import { crearUsuario } from '../src/services/UsuariosService';

// Mock de window.alert
global.alert = vi.fn();

describe('Componente Registro', () => {
  const mockOnNavigate = vi.fn();

  const renderRegistro = () => {
    return render(<Registro onNavigate={mockOnNavigate} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el formulario de registro', () => {
    renderRegistro();

    expect(screen.getByText('📝 Crea tu cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre(s)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apellido(s)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /registrarse/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /volver al login/i })
    ).toBeInTheDocument();
  });

  test('permite escribir en los campos del formulario', async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Apellido(s)'), 'Pérez');
    await user.type(
      screen.getByPlaceholderText('Correo Electrónico'),
      'juan@example.com'
    );
    await user.type(
      screen.getByPlaceholderText('Contraseña'),
      'password123'
    );

    expect(screen.getByPlaceholderText('Nombre(s)')).toHaveValue('Juan');
    expect(screen.getByPlaceholderText('Apellido(s)')).toHaveValue('Pérez');
    expect(
      screen.getByPlaceholderText('Correo Electrónico')
    ).toHaveValue('juan@example.com');
    expect(
      screen.getByPlaceholderText('Contraseña')
    ).toHaveValue('password123');
  });

  test('muestra mensaje de error cuando faltan campos obligatorios', async () => {
    const user = userEvent.setup();
    renderRegistro();

    // Solo llenamos nombre
    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');

    await user.click(
      screen.getByRole('button', { name: /registrarse/i })
    );

    expect(
      screen.getByText('Completa todos los campos.')
    ).toBeInTheDocument();
    expect(crearUsuario).not.toHaveBeenCalled();
  });

  test('muestra mensaje de error cuando el email es inválido', async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Apellido(s)'), 'Pérez');
    await user.type(
      screen.getByPlaceholderText('Correo Electrónico'),
      'correo-invalido'
    );
    await user.type(
      screen.getByPlaceholderText('Contraseña'),
      'password123'
    );

    await user.click(
      screen.getByRole('button', { name: /registrarse/i })
    );

    expect(
      screen.getByText('Ingresa un correo electrónico válido.')
    ).toBeInTheDocument();
    expect(crearUsuario).not.toHaveBeenCalled();
  });

  test('muestra mensaje de error cuando la contraseña tiene menos de 6 caracteres', async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Apellido(s)'), 'Pérez');
    await user.type(
      screen.getByPlaceholderText('Correo Electrónico'),
      'juan@example.com'
    );
    await user.type(
      screen.getByPlaceholderText('Contraseña'),
      '123'
    );

    await user.click(
      screen.getByRole('button', { name: /registrarse/i })
    );

    expect(
      screen.getByText('La contraseña debe tener al menos 6 caracteres.')
    ).toBeInTheDocument();
    expect(crearUsuario).not.toHaveBeenCalled();
  });

  test('registra usuario exitosamente, llama a crearUsuario y navega a login', async () => {
    const user = userEvent.setup();
    // mock respuesta backend
    crearUsuario.mockResolvedValue({
      idUsuario: 10,
      nombreUsuario: 'Juan',
      apellidoUsuario: 'Pérez',
      emailUsuario: 'nuevo@example.com',
      rolUsuario: 'CLIENTE',
    });

    renderRegistro();

    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Apellido(s)'), 'Pérez');
    await user.type(
      screen.getByPlaceholderText('Correo Electrónico'),
      'nuevo@example.com'
    );
    await user.type(
      screen.getByPlaceholderText('Contraseña'),
      'password123'
    );

    await user.click(
      screen.getByRole('button', { name: /registrarse/i })
    );

    await waitFor(() => {
      expect(crearUsuario).toHaveBeenCalledWith({
        nombreUsuario: 'Juan',
        apellidoUsuario: 'Pérez',
        emailUsuario: 'nuevo@example.com',
        passwordUsuario: 'password123',
        rolUsuario: 'CLIENTE',
      });
      expect(alert).toHaveBeenCalledWith(
        '¡Cuenta creada exitosamente para Juan!'
      );
      expect(mockOnNavigate).toHaveBeenCalledWith('login-page');
    });
  });

  test('muestra mensaje del backend cuando la creación falla con mensaje específico', async () => {
    const user = userEvent.setup();

    crearUsuario.mockRejectedValue({
      response: { data: 'El email ya está registrado' },
    });

    renderRegistro();

    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Apellido(s)'), 'Pérez');
    await user.type(
      screen.getByPlaceholderText('Correo Electrónico'),
      'existente@example.com'
    );
    await user.type(
      screen.getByPlaceholderText('Contraseña'),
      'password123'
    );

    await user.click(
      screen.getByRole('button', { name: /registrarse/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText('El email ya está registrado')
      ).toBeInTheDocument();
    });
  });

  test('muestra mensaje genérico cuando la creación falla sin mensaje del backend', async () => {
    const user = userEvent.setup();

    crearUsuario.mockRejectedValue(new Error('Error X'));

    renderRegistro();

    await user.type(screen.getByPlaceholderText('Nombre(s)'), 'Juan');
    await user.type(screen.getByPlaceholderText('Apellido(s)'), 'Pérez');
    await user.type(
      screen.getByPlaceholderText('Correo Electrónico'),
      'nuevo@example.com'
    );
    await user.type(
      screen.getByPlaceholderText('Contraseña'),
      'password123'
    );

    await user.click(
      screen.getByRole('button', { name: /registrarse/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Hubo un problema al crear la cuenta. Intenta nuevamente.'
        )
      ).toBeInTheDocument();
    });
  });

  test('navega a login cuando se hace clic en "Volver al login"', async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.click(
      screen.getByRole('button', { name: /volver al login/i })
    );

    expect(mockOnNavigate).toHaveBeenCalledWith('login-page');
  });
});
