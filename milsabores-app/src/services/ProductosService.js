import productosData from '../data/productos.json';

// Para mantener compatibilidad total
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

// Funciones adicionales para futura migración a API
export const getProductoById = (id) => {
  return productos.find(producto => producto.idProd === id);
};

export const getProductosByCategoria = (categoria) => {
  return productos.filter(producto => producto.categProd === categoria);
};