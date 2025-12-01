import productosData from '../data/productos.json';
import apiClient from './apiClient';

export const productosLocales = productosData.productos;

const getProductosPublic = async () => {
  try {
    const res = await apiClient.get('/productos'); 
    return res.data;
  } catch (error) {
    console.error('❌ Error API productos, usando datos locales:', error);
    return productosLocales;
  }
};

const getProductoPublicById = async (id) => {
  try {
    const res = await apiClient.get(`/productos/${id}`);
    return res.data;
  } catch (error) {
    console.error('❌ Error API producto, usando datos locales:', error);
    return productosLocales.find((p) => p.idProd === Number(id));
  }
};

const getProductosByCategoriaPublic = async (categoria) => {
  const productos = await getProductosPublic();
  return productos.filter((p) => p.categProd === categoria);
};

export const api = {
  getProductos: getProductosPublic,
  getProductoById: getProductoPublicById,
  getProductosByCategoria: getProductosByCategoriaPublic,
};

export const getProductosAdminLocal = () => {
  const productosModificados = localStorage.getItem('productos-admin');
  return productosModificados ? JSON.parse(productosModificados) : [...productosLocales];
};

export const getCategoriasLocal = () => {
  const productos = getProductosAdminLocal();
  return [...new Set(productos.map((p) => p.categProd))];
};

//FUNCIONES ADMIN CRUD

export const adminProductosApi = {
  getAll: async () => {
    const res = await apiClient.get('/productos');
    return res.data;
  },
  create: async (producto) => {
    const res = await apiClient.post('/productos', producto);
    return res.data;
  },
  update: async (id, producto) => {
    const res = await apiClient.put(`/productos/${id}`, producto);
    return res.data;
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/productos/${id}`);
    return res.data;
  },
};
