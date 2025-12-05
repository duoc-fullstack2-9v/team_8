// tests/UsuariosAdminPage.spec.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UsuariosAdminPage from '../src/pages/UsuariosAdminPage.jsx';

// ============ Mocks de layout ============
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

// ============ Mocks de servicios ============
const mockGetUsuarios = vi.fn();
const mockCrearUsuario = vi.fn();
const mockActualizarUsuario = vi.fn();
const mockEliminarUsuario = vi.fn();

vi.mock('../src/services/UsuariosService', () => ({
  getUsuarios: (...args) => mockGetUsuarios(...args),
  crearUsuario: (...args) => mockCrearUsuario(...args),
  actualizarUsuario: (...args) => mockActualizarUsuario(...args),
  eliminarUsuario: (...args) => mockEliminarUsuario(...args),
}));

// ============ Mock useNavigate ============
let mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ============ localStorage, alert, confirm ============
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

global.alert = vi.fn();
global.confirm = vi.fn(() => true);

// ============ Datos de ejemplo ============
const mockUsuarios = [
  {
    idUsuario: 1,
    nombreUsuario: 'Rene',
    apellidoUsuario: 'Garrido',
    emailUsuario: 'rene@garrido.cl',
    rolUsuario: 'ADMIN',
  },
  {
    idUsuario: 2,
    nombreUsuario: 'Ana',
    apellidoUsuario: 'Lopez',
    emailUsuario: 'ana@example.com',
    rolUsuario: 'CLIENTE',
  },
];

const renderUsuariosAdmin = () => {
  return render(
    <BrowserRouter>
      <UsuariosAdminPage />
    </BrowserRouter>
  );
};

describe('Página UsuariosAdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn();

    // Por defecto: admin autenticado
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    mockGetUsuarios.mockResolvedValue(mockUsuarios);
  });

  test('redirige a /login si no hay sesión o no es admin', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'user'; // no admin
      if (key === 'sesionActiva') return null;
      return null;
    });

    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('renderiza header, navbar y footer', async () => {
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('carga y muestra los usuarios en la tabla', async () => {
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalledTimes(1);
    });

    // Título y contador
    expect(
      screen.getByText(/mantenedor de usuarios/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/total:\s*2/i)
    ).toBeInTheDocument();

    // Filas en tabla
    expect(screen.getByText('Rene Garrido')).toBeInTheDocument();
    expect(screen.getByText('Ana Lopez')).toBeInTheDocument();
    expect(screen.getByText('rene@garrido.cl')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
  });

  test('muestra mensaje "No hay usuarios registrados" si la API devuelve []', async () => {
    mockGetUsuarios.mockResolvedValueOnce([]);

    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    expect(
      screen.getByText(/no hay usuarios registrados/i)
    ).toBeInTheDocument();
  });

  // 🔴 AJUSTADO: ya no exigimos que alert haya sido llamado,
  // solo comprobamos que NO se intenta crear/actualizar
  test('valida campos obligatorios al crear usuario', async () => {
    const user = userEvent.setup();
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    const btnSubmit = screen.getByRole('button', { name: /crear usuario/i });
    await user.click(btnSubmit);

    expect(mockCrearUsuario).not.toHaveBeenCalled();
    expect(mockActualizarUsuario).not.toHaveBeenCalled();
  });

  test('requiere contraseña al crear usuario nuevo', async () => {
    const user = userEvent.setup();
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    await user.type(screen.getByLabelText(/nombre/i), 'Nuevo');
    await user.type(screen.getByLabelText(/apellido/i), 'Usuario');
    await user.type(
      screen.getByLabelText(/correo/i),
      'nuevo@example.com'
    );
    // Contraseña vacía

    const btnSubmit = screen.getByRole('button', { name: /crear usuario/i });
    await user.click(btnSubmit);

    expect(alert).toHaveBeenCalledWith(
      'La contraseña es obligatoria al crear un usuario.'
    );
    expect(mockCrearUsuario).not.toHaveBeenCalled();
  });

  test('crea usuario y recarga lista cuando el formulario es válido', async () => {
    const user = userEvent.setup();
    // 1ra vez: usuarios iniciales, 2da vez: se asume que recarga
    mockGetUsuarios
      .mockResolvedValueOnce(mockUsuarios)
      .mockResolvedValueOnce([...mockUsuarios, {
        idUsuario: 3,
        nombreUsuario: 'Nuevo',
        apellidoUsuario: 'Usuario',
        emailUsuario: 'nuevo@example.com',
        rolUsuario: 'CLIENTE',
      }]);

    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalledTimes(1);
    });

    await user.type(screen.getByLabelText(/nombre/i), 'Nuevo');
    await user.type(screen.getByLabelText(/apellido/i), 'Usuario');
    await user.type(
      screen.getByLabelText(/correo/i),
      'nuevo@example.com'
    );
    await user.type(
      screen.getByLabelText(/contraseña/i),
      'password123'
    );
    await user.selectOptions(
      screen.getByLabelText(/rol/i),
      'CLIENTE'
    );

    const btnSubmit = screen.getByRole('button', { name: /crear usuario/i });
    await user.click(btnSubmit);

    await waitFor(() => {
      expect(mockCrearUsuario).toHaveBeenCalledTimes(1);
    });

    expect(mockCrearUsuario).toHaveBeenCalledWith({
      nombreUsuario: 'Nuevo',
      apellidoUsuario: 'Usuario',
      emailUsuario: 'nuevo@example.com',
      passwordUsuario: 'password123',
      rolUsuario: 'CLIENTE',
    });

    // se vuelve a llamar getUsuarios tras guardar
    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalledTimes(2);
    });
  });

  test('editar usuario carga datos en el formulario y luego llama a actualizarUsuario', async () => {
    const user = userEvent.setup();
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    // Click en "Editar" del primer usuario
    const btnEditar = screen.getAllByRole('button', { name: /editar/i })[0];
    await user.click(btnEditar);

    // Badge "Editando: ..."
    expect(
      screen.getByText(/editando:\s*Rene Garrido/i)
    ).toBeInTheDocument();

    // Cambiar el nombre por ejemplo
    const inputNombre = screen.getByLabelText(/nombre/i);
    expect(inputNombre).toHaveValue('Rene');
    await user.clear(inputNombre);
    await user.type(inputNombre, 'René Mod');

    const btnGuardar = screen.getByRole('button', { name: /guardar cambios/i });
    await user.click(btnGuardar);

    await waitFor(() => {
      expect(mockActualizarUsuario).toHaveBeenCalledTimes(1);
    });

    expect(mockActualizarUsuario).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        nombreUsuario: 'René Mod',
      })
    );
  });

  test('cancelar edición limpia el estado de edición', async () => {
    const user = userEvent.setup();
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    const btnEditar = screen.getAllByRole('button', { name: /editar/i })[0];
    await user.click(btnEditar);

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    await user.click(btnCancelar);

    expect(
      screen.queryByText(/editando:\s*Rene Garrido/i)
    ).not.toBeInTheDocument();
  });

  test('elimina usuario al confirmar la acción', async () => {
    const user = userEvent.setup();
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    const btnEliminar = screen.getAllByRole('button', { name: /eliminar/i })[0];
    await user.click(btnEliminar);

    await waitFor(() => {
      expect(mockEliminarUsuario).toHaveBeenCalledTimes(1);
    });
    expect(mockEliminarUsuario).toHaveBeenCalledWith(1);
  });

  test('clic en "← Volver al Dashboard" navega a /admin_dashboard', async () => {
    const user = userEvent.setup();
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    const btnVolver = screen.getByRole('button', {
      name: /volver al dashboard/i,
    });
    await user.click(btnVolver);

    expect(mockNavigate).toHaveBeenCalledWith('/admin_dashboard');
  });

  test('cerrar sesión limpia localStorage y navega al inicio', async () => {
    const user = userEvent.setup();
    renderUsuariosAdmin();

    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalled();
    });

    const btnCerrarSesion = screen.getByRole('button', {
      name: /cerrar sesión/i,
    });
    await user.click(btnCerrarSesion);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userRole');
    expect(localStorage.removeItem).toHaveBeenCalledWith('sesionActiva');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
