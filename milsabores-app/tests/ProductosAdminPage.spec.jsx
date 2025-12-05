import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProductosAdminDashboard from '../src/pages/ProductosAdminPage.jsx';

vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

// Mock simple de FiltroCategorias (select que llama onCategoriaChange)
vi.mock('../src/components/FiltroCategorias', () => ({
  default: ({ categorias, categoriaSeleccionada, onCategoriaChange }) => (
    <div data-testid="mock-filtro">
      <select
        data-testid="filtro-select"
        value={categoriaSeleccionada}
        onChange={(e) => onCategoriaChange(e.target.value)}
      >
        <option value="">Todas</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  ),
}));

// Mock de ProductoForm: muestra que está abierto y permite disparar onSave / onCancel
vi.mock('../src/components/ProductoForm', () => ({
  default: ({ producto, onSave, onCancel }) => (
    <div data-testid="mock-producto-form">
      {producto ? (
        <p data-testid="editando-prod">Editando: {producto.nombreProd}</p>
      ) : (
        <p data-testid="agregando-prod">Agregando producto nuevo</p>
      )}
      <button
        type="button"
        onClick={() =>
          onSave({
            nombreProd: 'Nuevo Producto',
            descProd: 'Desc mock',
            precioProd: 12345,
            categProd: 'Tortas Cuadradas',
            imagenProd: '/img/mock.jpg',
            productoDestacado: false,
          })
        }
      >
        mock-guardar
      </button>
      <button type="button" onClick={onCancel}>
        mock-cancelar
      </button>
    </div>
  ),
}));

// =====================
// Mock del service de productos (admin API)
// =====================

const mockGetAll = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockRemove = vi.fn();

vi.mock('../src/services/ProductosService', () => ({
  adminProductosApi: {
    getAll: (...args) => mockGetAll(...args),
    create: (...args) => mockCreate(...args),
    update: (...args) => mockUpdate(...args),
    remove: (...args) => mockRemove(...args),
  },
}));

// =====================
// Mock de react-router-dom (useNavigate)
// =====================

let mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// =====================
// Datos de prueba
// =====================

const mockProductos = [
  {
    idProd: 1,
    nombreProd: 'Torta de Chocolate',
    descProd: 'Deliciosa torta de chocolate',
    precioProd: 45000,
    categProd: 'Tortas Cuadradas',
    imagenProd: '/img/torta-chocolate.jpg',
    productoDestacado: true,
  },
  {
    idProd: 2,
    nombreProd: 'Cheesecake',
    descProd: 'Suave cheesecake',
    precioProd: 47000,
    categProd: 'Postres Individuales',
    imagenProd: '/img/cheesecake.jpg',
    productoDestacado: false,
  },
];

// =====================
// localStorage + alert + confirm
// =====================

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
global.confirm = vi.fn(() => true); // para que "Eliminar" siempre confirme

// =====================
// Helper para renderizar
// =====================

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <ProductosAdminDashboard />
    </BrowserRouter>
  );
};

// =====================
// Tests
// =====================

describe('Página ProductosAdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockNavigate = vi.fn();

    // Usuario admin por defecto
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'admin';
      if (key === 'sesionActiva') return 'admin@milsabores.cl';
      return null;
    });

    // Por defecto, GET devuelve los 2 productos
    mockGetAll.mockResolvedValue(mockProductos);
  });

  test('redirige a /login si el usuario NO es admin', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userRole') return 'user'; // no admin
      return null;
    });

    renderDashboard();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    expect(alert).toHaveBeenCalledWith(
      'Acceso denegado. Solo administradores pueden acceder.'
    );
  });

  test('renderiza header, navbar y footer', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
    });

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('carga y muestra los productos desde la API', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Cheesecake')).toBeInTheDocument();
    expect(screen.getByText(/2 producto\(s\)/i)).toBeInTheDocument();
  });

  test('muestra el filtro de categorías con opciones dinámicas', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
    });

    const select = screen.getByTestId('filtro-select');
    expect(select).toBeInTheDocument();

    // opciones dinámicas SOLO dentro del select
    expect(within(select).getByText('Tortas Cuadradas')).toBeInTheDocument();
    expect(within(select).getByText('Postres Individuales')).toBeInTheDocument();
  });

  test('aplica filtro por categoría', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
    });

    const select = screen.getByTestId('filtro-select');

    // Filtrar por "Postres Individuales"
    await user.selectOptions(select, 'Postres Individuales');

    expect(screen.getByText('Cheesecake')).toBeInTheDocument();
    expect(screen.queryByText('Torta de Chocolate')).not.toBeInTheDocument();
  });

  test('al hacer clic en "Agregar Producto" muestra el formulario (ProductoForm)', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
    });

    const btnAgregar = screen.getByRole('button', { name: /agregar producto/i });
    await user.click(btnAgregar);

    expect(screen.getByTestId('mock-producto-form')).toBeInTheDocument();
    expect(screen.getByTestId('agregando-prod')).toBeInTheDocument();
  });

  test('guardar nuevo producto llama adminProductosApi.create y recarga lista', async () => {
    const user = userEvent.setup();
    // 1ª llamada: productos iniciales
    mockGetAll
      .mockResolvedValueOnce(mockProductos)
      // 2ª llamada: tras crear, por ejemplo, se repite la lista o viene actualizada
      .mockResolvedValueOnce([
        ...mockProductos,
        {
          idProd: 3,
          nombreProd: 'Nuevo Producto',
          descProd: 'Desc mock',
          precioProd: 12345,
          categProd: 'Tortas Cuadradas',
          imagenProd: '/img/mock.jpg',
          productoDestacado: false,
        },
      ]);

    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });

    const btnAgregar = screen.getByRole('button', { name: /agregar producto/i });
    await user.click(btnAgregar);

    expect(screen.getByTestId('mock-producto-form')).toBeInTheDocument();

    const btnGuardarMock = screen.getByRole('button', { name: /mock-guardar/i });
    await user.click(btnGuardarMock);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        nombreProd: 'Nuevo Producto',
        precioProd: 12345,
      })
    );

    // se vuelve a llamar a getAll tras guardar
    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledTimes(2);
    });
  });

  test('al hacer clic en "Editar" abre el formulario con producto en edición', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
    });

    const btnEditar = screen.getAllByRole('button', { name: /editar/i })[0];
    await user.click(btnEditar);

    expect(screen.getByTestId('mock-producto-form')).toBeInTheDocument();
    expect(screen.getByTestId('editando-prod')).toHaveTextContent(
      'Torta de Chocolate'
    );
  });

  test('al hacer clic en "Eliminar" llama adminProductosApi.remove con el id correcto', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
    });

    const btnEliminar = screen.getAllByRole('button', { name: /eliminar/i })[0];
    await user.click(btnEliminar);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledTimes(1);
    });
    expect(mockRemove).toHaveBeenCalledWith(1); // idProd del primer producto
  });

  test('cerrar sesión limpia localStorage y navega al inicio', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
    });

    const btnCerrarSesion = screen.getByRole('button', { name: /cerrar sesión/i });
    await user.click(btnCerrarSesion);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userRole');
    expect(localStorage.removeItem).toHaveBeenCalledWith('sesionActiva');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
