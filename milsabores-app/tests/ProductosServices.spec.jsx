import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock del módulo JSON PRIMERO (esto se ejecuta antes que todo)
vi.mock('../src/data/productos.json', () => {
  const mockProductos = [
    {
      idProd: 1,
      nombreProd: 'Torta de Chocolate',
      precioProd: 45000,
      categProd: 'Tortas Circulares',
      descProd: 'Deliciosa torta de chocolate',
      imagenProd: '/img/torta-chocolate.jpg',
      productoDestacado: true
    },
    {
      idProd: 2,
      nombreProd: 'Cheesecake',
      precioProd: 47000,
      categProd: 'Postres Individuales',
      descProd: 'Suave cheesecake',
      imagenProd: '/img/cheesecake.jpg',
      productoDestacado: false
    },
    {
      idProd: 3,
      nombreProd: 'Torta Vegana',
      precioProd: 42000,
      categProd: 'Productos Veganos',
      descProd: 'Torta vegana saludable',
      imagenProd: '/img/torta-vegana.jpg',
      productoDestacado: true
    }
  ];
  
  return {
    default: {
      productos: mockProductos
    }
  };
});

import { 
  productos,
  categoriaProductos,
  getProductoById,
  getProductosByCategoria,
  getProductosAdmin,
  saveProductosAdmin,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  restaurarProductosBase,
  getCategorias,
  api  // ← NUEVO: Importar la API
} from '../src/services/ProductosService';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

// Mock de fetch global
global.fetch = vi.fn();

describe('ProductosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null); // Por defecto sin productos en localStorage
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Funciones básicas', () => {
    test('exporta el array de productos', () => {
      expect(productos).toBeDefined();
      expect(Array.isArray(productos)).toBe(true);
    });

    test('exporta categorías de productos', () => {
      expect(categoriaProductos).toHaveProperty('Tortas Circulares');
      expect(categoriaProductos).toHaveProperty('Postres Individuales');
      expect(categoriaProductos).toHaveProperty('Productos Veganos');
    });

    test('getProductoById retorna producto existente', () => {
      const producto = getProductoById(1);
      expect(producto).toBeDefined();
      expect(producto.nombreProd).toBe('Torta de Chocolate');
    });

    test('getProductoById retorna undefined para id inexistente', () => {
      const producto = getProductoById(999);
      expect(producto).toBeUndefined();
    });
  });

  describe('Funciones de API', () => {
    const mockProductosAPI = [
      { idProd: 1, nombreProd: 'Producto API 1', categProd: 'Tortas Circulares', productoDestacado: true },
      { idProd: 2, nombreProd: 'Producto API 2', categProd: 'Postres Individuales', productoDestacado: false }
    ];

    beforeEach(() => {
      fetch.mockClear();
    });

    test('api.getProductos retorna datos de API exitosamente', async () => {
      // Mock de respuesta exitosa
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductosAPI
      });

      const productos = await api.getProductos();
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/productos');
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(productos).toEqual(mockProductosAPI);
    });

    test('api.getProductos usa fallback local cuando API falla', async () => {
      // Mock de error en API
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const productos = await api.getProductos();
      
      // Debería usar datos locales como fallback
      expect(productos).toBeDefined();
      expect(Array.isArray(productos)).toBe(true);
      expect(productos.length).toBeGreaterThan(0);
    });

    test('api.getProductos usa fallback local cuando respuesta no es ok', async () => {
      // Mock de respuesta no exitosa
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const productos = await api.getProductos();
      
      // Debería usar datos locales como fallback
      expect(productos).toBeDefined();
      expect(Array.isArray(productos)).toBe(true);
    });

    test('api.getProductosByCategoria retorna productos por categoría desde API', async () => {
      const categoria = 'Tortas Circulares';
      const mockProductosCategoria = mockProductosAPI.filter(p => p.categProd === categoria);
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductosCategoria
      });

      const productos = await api.getProductosByCategoria(categoria);
      
      expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/v1/productos/categoria/${encodeURIComponent(categoria)}`);
      expect(productos).toEqual(mockProductosCategoria);
    });

    test('api.getProductosByCategoria usa fallback local cuando API falla', async () => {
      const categoria = 'Tortas Circulares';
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const productos = await api.getProductosByCategoria(categoria);
      
      // Debería usar datos locales filtrados como fallback
      expect(productos).toBeDefined();
      expect(Array.isArray(productos)).toBe(true);
      // Verificar que todos los productos son de la categoría especificada
      productos.forEach(producto => {
        expect(producto.categProd).toBe(categoria);
      });
    });

    test('api.getProductoById retorna producto específico desde API', async () => {
      const productoId = 1;
      const mockProducto = mockProductosAPI.find(p => p.idProd === productoId);
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducto
      });

      const producto = await api.getProductoById(productoId);
      
      expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/v1/productos/${productoId}`);
      expect(producto).toEqual(mockProducto);
    });

    test('api.getProductoById usa fallback local cuando API falla', async () => {
      const productoId = 1;
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const producto = await api.getProductoById(productoId);
      
      // Debería buscar en datos locales como fallback
      expect(producto).toBeDefined();
      expect(producto.idProd).toBe(productoId);
    });

    test('api.getProductoById retorna undefined cuando producto no existe y API falla', async () => {
      const productoId = 999; // ID que no existe
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const producto = await api.getProductoById(productoId);
      
      // Debería retornar undefined cuando no encuentra el producto
      expect(producto).toBeUndefined();
    });
  });

  describe('Funciones de administración', () => {
    test('getProductosAdmin retorna productos base cuando no hay modificación', () => {
      const productosAdmin = getProductosAdmin();
      expect(productosAdmin).toBeDefined();
      expect(Array.isArray(productosAdmin)).toBe(true);
    });

    test('getProductosAdmin retorna productos modificados del localStorage', () => {
      const productosModificados = [{ idProd: 4, nombreProd: 'Nuevo Producto' }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(productosModificados));
      
      const productosAdmin = getProductosAdmin();
      expect(productosAdmin).toEqual(productosModificados);
    });

    test('saveProductosAdmin guarda productos en localStorage', () => {
      const productosAGuardar = [{ idProd: 1, nombreProd: 'Test' }];
      saveProductosAdmin(productosAGuardar);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'productos-admin',
        JSON.stringify(productosAGuardar)
      );
    });

    test('agregarProducto añade nuevo producto con ID autoincremental', () => {
      const productosBase = [{ idProd: 1, nombreProd: 'Existente' }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(productosBase));
      
      const nuevoProducto = {
        nombreProd: 'Nueva Torta',
        precioProd: 50000,
        categProd: 'Tortas Circulares'
      };
      
      const productoAgregado = agregarProducto(nuevoProducto);
      
      expect(productoAgregado.idProd).toBe(2);
      expect(productoAgregado.nombreProd).toBe('Nueva Torta');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('agregarProducto maneja array vacío correctamente', () => {
      localStorageMock.getItem.mockReturnValue(null); // Sin productos existentes
      
      const nuevoProducto = {
        nombreProd: 'Primer Producto',
        precioProd: 50000,
        categProd: 'Tortas Circulares'
      };
      
      const productoAgregado = agregarProducto(nuevoProducto);
      
      expect(productoAgregado.idProd).toBe(4); 
    });

    test('editarProducto actualiza producto existente', () => {
      const productosBase = [{ idProd: 1, nombreProd: 'Original' }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(productosBase));
      
      const productoActualizado = { nombreProd: 'Actualizado' };
      const resultado = editarProducto(1, productoActualizado);
      
      expect(resultado).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('editarProducto retorna false para producto inexistente', () => {
      const productosBase = [{ idProd: 1, nombreProd: 'Original' }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(productosBase));
      
      const resultado = editarProducto(999, { nombreProd: 'No existe' });
      
      expect(resultado).toBe(false);
    });

    test('eliminarProducto elimina producto existente', () => {
      const productosBase = [
        { idProd: 1, nombreProd: 'Producto 1' },
        { idProd: 2, nombreProd: 'Producto 2' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(productosBase));
      
      const productosRestantes = eliminarProducto(1);
      
      expect(productosRestantes).toHaveLength(1);
      expect(productosRestantes[0].idProd).toBe(2);
    });

    test('restaurarProductosBase limpia localStorage', () => {
      restaurarProductosBase();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('productos-admin');
    });
  });

  describe('Funciones de categorías', () => {
    test('getProductosByCategoria retorna productos de categoría específica', () => {
      const productosBase = [
        { idProd: 1, nombreProd: 'Producto 1', categProd: 'Categoria A' },
        { idProd: 2, nombreProd: 'Producto 2', categProd: 'Categoria B' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(productosBase));
      
      const productosCategoria = getProductosByCategoria('Categoria A');
      
      expect(productosCategoria).toHaveLength(1);
      expect(productosCategoria[0].nombreProd).toBe('Producto 1');
    });

    test('getCategorias retorna array de categorías únicas', () => {
      const productosBase = [
        { idProd: 1, nombreProd: 'P1', categProd: 'Categoria A' },
        { idProd: 2, nombreProd: 'P2', categProd: 'Categoria B' },
        { idProd: 3, nombreProd: 'P3', categProd: 'Categoria A' } // Duplicado
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(productosBase));
      
      const categorias = getCategorias();
      
      expect(categorias).toContain('Categoria A');
      expect(categorias).toContain('Categoria B');
      expect(categorias).toHaveLength(2); // Sin duplicados
    });
  });
});