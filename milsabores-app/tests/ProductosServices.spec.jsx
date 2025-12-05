import { describe, test, expect, vi, beforeEach } from 'vitest';

// ============================
// Mock de apiClient (axios wrapper)
// ============================
var mockGet;
var mockPost;
var mockPut;
var mockDelete;

vi.mock('../src/services/apiClient', () => {
  // inicializamos AQUÍ para evitar problemas de hoisting/TDZ
  mockGet = vi.fn();
  mockPost = vi.fn();
  mockPut = vi.fn();
  mockDelete = vi.fn();

  return {
    default: {
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
    },
  };
});

// ============================
// Mock de productos.json
// ============================
var mockProductosLocales;

vi.mock('../src/data/productos.json', () => {
  mockProductosLocales = [
    { idProd: 1, nombreProd: 'Torta 1', categProd: 'Tortas', precioProd: 10000 },
    { idProd: 2, nombreProd: 'Torta 2', categProd: 'Tortas', precioProd: 20000 },
    { idProd: 3, nombreProd: 'Cheesecake', categProd: 'Postres', precioProd: 25000 },
  ];

  return {
    default: { productos: mockProductosLocales },
  };
});

// 🔹 Import del service (DESPUÉS de los mocks)
import {
  api,
  productosLocales,
  getProductosAdminLocal,
  getCategoriasLocal,
  adminProductosApi,
} from '../src/services/ProductosService';

describe('Servicios de Productos (ProductosService)', () => {
  // Mock de localStorage
  const localStorageMock = {
    store: {},
    getItem: vi.fn(function (key) {
      return this.store[key] ?? null;
    }),
    setItem: vi.fn(function (key, value) {
      this.store[key] = value;
    }),
    removeItem: vi.fn(function (key) {
      delete this.store[key];
    }),
    clear: vi.fn(function () {
      this.store = {};
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    global.localStorage = localStorageMock;
  });

  // ==============================
  // API pública (catálogo / inicio)
  // ==============================
  test('api.getProductos devuelve datos de la API cuando la llamada es exitosa', async () => {
    const mockRespuesta = [
      { idProd: 10, nombreProd: 'Desde API', categProd: 'Tortas', precioProd: 12345 },
    ];

    mockGet.mockResolvedValueOnce({ data: mockRespuesta });

    const result = await api.getProductos();

    expect(mockGet).toHaveBeenCalledWith('/productos');
    expect(result).toEqual(mockRespuesta);
  });

  test('api.getProductos usa productosLocales como fallback cuando la API falla', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'));

    const result = await api.getProductos();

    expect(mockGet).toHaveBeenCalledWith('/productos');
    // fallback
    expect(result).toEqual(productosLocales);
    // aseguramos que productosLocales viene del mock
    expect(productosLocales).toEqual(mockProductosLocales);
  });

  test('api.getProductoById devuelve el producto de la API cuando es exitoso', async () => {
    const mockProducto = { idProd: 2, nombreProd: 'Torta 2 API', categProd: 'Tortas' };

    mockGet.mockResolvedValueOnce({ data: mockProducto });

    const result = await api.getProductoById(2);

    expect(mockGet).toHaveBeenCalledWith('/productos/2');
    expect(result).toEqual(mockProducto);
  });

  test('api.getProductoById usa productosLocales como fallback cuando la API falla', async () => {
    mockGet.mockRejectedValueOnce(new Error('Error API'));

    const result = await api.getProductoById(2);

    // Debe buscar en productosLocales el id 2
    const esperado = mockProductosLocales.find((p) => p.idProd === 2);
    expect(result).toEqual(esperado);
  });

  test('api.getProductosByCategoria filtra correctamente por categoría', async () => {
    // getProductosPublic -> apiClient.get('/productos') → mockProductosLocales
    mockGet.mockResolvedValueOnce({ data: mockProductosLocales });

    const result = await api.getProductosByCategoria('Tortas');

    // Debe filtrar solo los de 'Tortas'
    expect(result).toEqual(
      mockProductosLocales.filter((p) => p.categProd === 'Tortas'),
    );
  });

  // ==============================
  // Funciones locales admin
  // ==============================
  test('getProductosAdminLocal devuelve productos-admin desde localStorage cuando existen', () => {
    const productosAdmin = [
      { idProd: 99, nombreProd: 'Admin 1', categProd: 'Especial', precioProd: 9999 },
    ];

    localStorage.setItem('productos-admin', JSON.stringify(productosAdmin));

    const result = getProductosAdminLocal();

    expect(localStorage.getItem).toHaveBeenCalledWith('productos-admin');
    expect(result).toEqual(productosAdmin);
  });

  test('getProductosAdminLocal devuelve copia de productosLocales cuando no hay datos en localStorage', () => {
    // No seteamos 'productos-admin'
    const result = getProductosAdminLocal();

    expect(result).toEqual(productosLocales);
    // Debe ser una copia, no la misma referencia
    expect(result).not.toBe(productosLocales);
  });

  test('getCategoriasLocal devuelve la lista de categorías únicas', () => {
    const productosAdmin = [
      { idProd: 1, nombreProd: 'A', categProd: 'Tortas' },
      { idProd: 2, nombreProd: 'B', categProd: 'Postres' },
      { idProd: 3, nombreProd: 'C', categProd: 'Tortas' },
    ];
    localStorage.setItem('productos-admin', JSON.stringify(productosAdmin));

    const categorias = getCategoriasLocal();

    expect(categorias.sort()).toEqual(['Postres', 'Tortas'].sort());
  });

  // ==============================
  // adminProductosApi (CRUD admin)
  // ==============================
  test('adminProductosApi.getAll llama a GET /productos y devuelve data', async () => {
    const mockData = [{ idProd: 1 }];
    mockGet.mockResolvedValueOnce({ data: mockData });

    const result = await adminProductosApi.getAll();

    expect(mockGet).toHaveBeenCalledWith('/productos');
    expect(result).toEqual(mockData);
  });

  test('adminProductosApi.create llama a POST /productos con el body correcto', async () => {
    const nuevo = { nombreProd: 'Nueva', precioProd: 10000 };
    const mockResp = { idProd: 10, ...nuevo };

    mockPost.mockResolvedValueOnce({ data: mockResp });

    const result = await adminProductosApi.create(nuevo);

    expect(mockPost).toHaveBeenCalledWith('/productos', nuevo);
    expect(result).toEqual(mockResp);
  });

  test('adminProductosApi.update llama a PUT /productos/:id con el body correcto', async () => {
    const updated = { nombreProd: 'Editada', precioProd: 20000 };
    const mockResp = { idProd: 2, ...updated };

    mockPut.mockResolvedValueOnce({ data: mockResp });

    const result = await adminProductosApi.update(2, updated);

    expect(mockPut).toHaveBeenCalledWith('/productos/2', updated);
    expect(result).toEqual(mockResp);
  });

  test('adminProductosApi.remove llama a DELETE /productos/:id', async () => {
    const mockResp = { mensaje: 'ok' };
    mockDelete.mockResolvedValueOnce({ data: mockResp });

    const result = await adminProductosApi.remove(3);

    expect(mockDelete).toHaveBeenCalledWith('/productos/3');
    expect(result).toEqual(mockResp);
  });
});
