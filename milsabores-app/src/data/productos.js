export const productos = [
  /*Tortas Cuadradas*/
  {
    idProd: 1,
    categProd: "Tortas Cuadradas",
    nombreProd: "Torta Cuadrada de Chocolate",
    descProd: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
    precioProd: 45000,
    imagenProd: "/src/assets/img/torta-cuadrada-chocolate.jpg"
  },
  {
    idProd: 2,
    categProd: "Tortas Cuadradas", 
    nombreProd: "Torta Cuadrada de Frutas",
    descProd: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
    precioProd: 50000,
    imagenProd: "/src/assets/img/torta-cuadrada-frutas.webp"
  },

  /*Tortas Circulares*/
  {
    idProd: 3,
    categProd: "Tortas Circulares",
    nombreProd: "Torta Circular de Vainilla",
    descProd: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
    precioProd: 40000,
    imagenProd: "/src/assets/img/torta-circular-vainilla.jpg"
  },
  {
    idProd: 4,
    categProd: "Tortas Circulares",
    nombreProd: "Torta Circular de Manjar",
    descProd: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
    precioProd: 42000,
    imagenProd: "/src/assets/img/torta-circular-manjar.webp"
  },

  /*Postres Individuales*/
  {
    idProd: 5,
    categProd: "Postres Individuales",
    nombreProd: "Mousse de Chocolate",
    descProd: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
    precioProd: 5000,
    imagenProd: "/src/assets/img/mousse-choc-ind.webp"
  },
  {
    idProd: 6,
    categProd: "Postres Individuales",
    nombreProd: "Tiramisú Clásico",
    descProd: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
    precioProd: 5500,
    imagenProd: "/src/assets/img/tiramisu-ind.jpg"
  },

  /*Productos Sin Azúcar*/
  {
    idProd: 7,
    categProd: "Productos Sin Azúcar",
    nombreProd: "Torta Sin Azúcar Naranja",
    descProd: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
    precioProd: 48000,
    imagenProd: "/src/assets/img/torta-naranja.jpg"
  },
  {
    idProd: 8,
    categProd: "Productos Sin Azúcar",
    nombreProd: "Cheesecake Sin Azúcar",
    descProd: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
    precioProd: 47000,
    imagenProd: "/src/assets/img/cheesecake-trad.avif"
  },

  /*Pastelería Tradicional*/
  {
    idProd: 9,
    categProd: "Pastelería Tradicional",
    nombreProd: "Empanada de Manzana",
    descProd: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
    precioProd: 3000,
    imagenProd: "/src/assets/img/empanada-de-manzanas.webp"
  },
  {
    idProd: 10,
    categProd: "Pastelería Tradicional",
    nombreProd: "Tarta de Santiago",
    descProd: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.",
    precioProd: 6000,
    imagenProd: "/src/assets/img/tarta-de-santiago-1.webp"
  },

  /* Producto Sin Gluten*/
  {
    idProd: 11,
    categProd: "Producto Sin Gluten",
    nombreProd: "Brownie Sin Gluten",
    descProd: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
    precioProd: 4000,
    imagenProd: "/src/assets/img/brownie-choc.webp"
  },
  {
    idProd: 12,
    categProd: "Producto Sin Gluten", 
    nombreProd: "Pan Sin Gluten",
    descProd: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.",
    precioProd: 3500,
    imagenProd: "/src/assets/img/pan-sin-gluten.webp"
  },

  /*Productos Veganos*/
  {
    idProd: 13,
    categProd: "Productos Veganos",
    nombreProd: "Torta Vegana de Chocolate",
    descProd: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
    precioProd: 50000,
    imagenProd: "/src/assets/img/torta-vegana-de-chocolate.jpg"
  },
  {
    idProd: 14,
    categProd: "Productos Veganos",
    nombreProd: "Galletas Veganas de Avena",
    descProd: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
    precioProd: 4500,
    imagenProd: "/src/assets/img/galleta-veg-avena.jpg"
  },

  /* Tortas Especiales*/
  {
    idProd: 15,
    categProd: "Tortas Especiales",
    nombreProd: "Torta Especial de Cumpleaños",
    descProd: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
    precioProd: 55000,
    imagenProd: "/src/assets/img/torta-personalizada-cumple.webp"
  },
  {
    idProd: 16,
    categProd: "Tortas Especiales",
    nombreProd: "Torta Especial de Bodas",
    descProd: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
    precioProd: 60000,
    imagenProd: "/src/assets/img/torta-de-matrimonio.jpg"
  }
];

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