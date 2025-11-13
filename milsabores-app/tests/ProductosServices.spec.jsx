import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock del módulo JSON PRIMERO (esto se ejecuta antes que todo)
vi.mock('../src/data/productos.json', () => {
  const mockProductos = [
    {
      idProd: 1,
      nombreProd: 'Torta de Chocolate',
      precioProd: 45000,
      categProd: 'Tortas Circulares',
      descProd: 'Deliciosa torta de chocolate',
      imagenProd: '/img/torta-chocolate.jpg'
    },
    {
      idProd: 2,
      nombreProd: 'Cheesecake',
      precioProd: 47000,
      categProd: 'Postres Individuales',
      descProd: 'Suave cheesecake',
      imagenProd: '/img/cheesecake.jpg'
    },
    {
      idProd: 3,
      nombreProd: 'Torta Vegana',
      precioProd: 42000,
      categProd: 'Productos Veganos',
      descProd: 'Torta vegana saludable',
      imagenProd: '/img/torta-vegana.jpg'
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
  getCategorias
} from '../src/services/ProductosService';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

describe('ProductosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null); // Por defecto sin productos en localStorage
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