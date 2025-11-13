import productosData from '../data/productos.json';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// ===== FUNCIONES DE API =====
const apiService = {
  // Obtener todos los productos desde la API
  getProductosFromAPI: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      if (!response.ok) throw new Error('Error al obtener productos');
      return await response.json();
    } catch (error) {
      console.error('Error API, usando datos locales:', error);
      return productosData.productos; // Fallback
    }
  },

  // Obtener productos por categoría desde API
  getProductosByCategoriaFromAPI: async (categoria) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/categoria/${encodeURIComponent(categoria)}`);
      if (!response.ok) throw new Error('Error al obtener categoría');
      return await response.json();
    } catch (error) {
      console.error('Error API, usando datos locales:', error);
      return productosData.productos.filter(p => p.categProd === categoria);
    }
  },

  // Obtener producto por ID desde API
  getProductoByIdFromAPI: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`);
      if (!response.ok) throw new Error('Producto no encontrado');
      return await response.json();
    } catch (error) {
      console.error('Error API, usando datos locales:', error);
      return productosData.productos.find(p => p.idProd === id);
    }
  }
};

// ===== FUNCIONES LOCALES =====
export const productos = productosData.productos;

export const categoriaProductos = {
  "Tortas Cuadradas": productos.filter(p => p.categProd === "Tortas Cuadradas"),
  "Tortas Circulares": productos.filter(p => p.categProd === "Tortas Circulares"),
  "Postres Individuales": productos.filter(p => p.categProd === "Postres Individuales"),
  "Productos Sin Azúcar": productos.filter(p => p.categProd === "Productos Sin Azúcar"),
  "Pastelería Tradicional": productos.filter(p => p.categProd === "Pastelería Tradicional"),
  "Producto Sin Gluten": productos.filter(p => p.categProd === "Producto Sin Gluten"),
  "Productos Veganos": productos.filter(p => p.categProd === "Productos Veganos"),
  "Tortas Especiales": productos.filter(p => p.categProd === "Tortas Especiales")
};

// Funciones existentes SIN cambios
export const getProductoById = (id) => {
  return productos.find(producto => producto.idProd === id);
};

export const getProductosByCategoria = (categoria) => {
  const productos = getProductosAdmin(); 
  return productos.filter(producto => producto.categProd === categoria);
};

// Funciones para dashboard de administración (SIN cambios)
export const getProductosAdmin = () => {
  const productosModificados = localStorage.getItem('productos-admin');
  return productosModificados ? JSON.parse(productosModificados) : [...productos];
};

export const saveProductosAdmin = (nuevosProductos) => {
  localStorage.setItem('productos-admin', JSON.stringify(nuevosProductos));
};

export const agregarProducto = (nuevoProducto) => {
  const productosActuales = getProductosAdmin();
  const maxId = Math.max(...productosActuales.map(p => p.idProd), 0);
  const productoConId = {
    ...nuevoProducto,
    idProd: maxId + 1
  };
  productosActuales.push(productoConId);
  saveProductosAdmin(productosActuales);
  return productoConId;
};

export const editarProducto = (id, productoActualizado) => {
  const productosActuales = getProductosAdmin();
  const index = productosActuales.findIndex(p => p.idProd === id);
  if (index !== -1) {
    productosActuales[index] = { ...productosActuales[index], ...productoActualizado };
    saveProductosAdmin(productosActuales);
    return true;
  }
  return false;
};

export const eliminarProducto = (id) => {
  const productosActuales = getProductosAdmin();
  const productosFiltrados = productosActuales.filter(p => p.idProd !== id);
  saveProductosAdmin(productosFiltrados);
  return productosFiltrados;
};

export const restaurarProductosBase = () => {
  localStorage.removeItem('productos-admin');
  return productos;
};

export const getCategorias = () => {
  const productos = getProductosAdmin();
  return [...new Set(productos.map(p => p.categProd))];
};

// ===== FUNCIONES NUEVAS PARA API =====
export const api = {
  // Para componentes que quieran usar la API
  getProductos: apiService.getProductosFromAPI,
  getProductosByCategoria: apiService.getProductosByCategoriaFromAPI,
  getProductoById: apiService.getProductoByIdFromAPI
};

