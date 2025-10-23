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

export const getProductoById = (id) => {
  return productos.find(producto => producto.idProd === id);
};

export const getProductosByCategoria = (categoria) => {
  const productos = getProductosAdmin(); 
  return productos.filter(producto => producto.categProd === categoria);
};

//Funciones para dashboard de administración
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

