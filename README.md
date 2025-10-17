# team_8

# Evidencia de Testing y Coverage – Pastelería Mil Sabores

## Estado actual
- **11/11 suites pasando**
- **19/19 tests verdes**
- Proyecto estable y funcional en la rama `feature/avance-matias-suazo-test`.

## Coverage Report (Vitest + V8)

All files | 48.62 | 84.9 | 60 | 48.62 |
src | 66.66 | 50 | 50 | 66.66 |
App.jsx | 100 | 100 | 100 | 100 |
main.jsx | 0 | 0 | 0 | 0 |
src/components | 96.09 | 90.24 | 88.46 | 96.09 |
Footer.jsx | 100 | 100 | 100 | 100 |
FormContacto.jsx | 98.61 | 100 | 100 | 98.61 |
Header.jsx | 100 | 100 | 100 | 100 |
HeroBanner.jsx | 100 | 100 | 100 | 100 |
Login.jsx | 88.88 | 71.42 | 80 | 88.88 |
MensajeFlotante.jsx | 100 | 100 | 100 | 100 |
Navbar.jsx | 100 | 100 | 100 | 100 | ProductoCard.jsx |
88.67 | 75 | 66.66 | 88.67 |
Registro.jsx | 100 | 100 | 100 | 100 |
src/context | 50.61 | 66.66 | 28.57 | 50.61 |
CarritoContext.jsx | 50.61 | 66.66 | 28.57 | 50.61 |
src/data | 0 | 0 | 0 | 0 |
Productos.js | 0 | 0 | 0 | 0 |
src/pages | 27.63 | 100 | 11.11 | 27.63 |
Blog.jsx | 33.33 | 100 | 0 | 33.33 |
Carrito.jsx | 10.6 | 100 | 0 | 10.6 |
Catalogo.jsx | 8.03 | 100 | 0 | 8.03 |
Contacto.jsx | 30 | 100 | 0 | 30 |
Inicio.jsx | 100 | 100 | 100 | 100 |
LoginPage.jsx | 30.43 | 100 | 0 | 30.43 |
Producto.jsx | 21.87 | 100 | 0 | 21.87 |
QuienesSomos.jsx | 11.76 | 100 | 0 | 11.76 |
RegistroUser.jsx | 30.43 | 100 | 0 | 30.43 |


## Observaciones
- **Componentes principales** (`App`, `Header`, `Footer`, `Navbar`, `HeroBanner`, `Registro`, `FormContacto`, `MensajeFlotante`) → 100% cubiertos.
- **ProductoCard y Login** → alta cobertura, faltan algunos paths.
- **CarritoContext** → 50%, faltan tests de acciones (agregar, quitar, limpiar).
- **Pages** → cobertura baja (8–33%), salvo `Inicio.jsx` que está al 100%. Estas páginas suelen cubrirse con tests de integración/end-to-end.
- **main.jsx** y **Productos.js** → 0%, no se testean directamente (entrypoint y datos estáticos).

## Nota aclaratoria
En esta rama (`feature/avance-matias-suazo-test`) se configuraron **mocks y alias** para poder ejecutar los tests y obtener coverage completo en los componentes principales.  
**No se modificó la lógica de negocio original de Álvaro**, solo se añadieron pruebas y configuraciones de entorno.  
El servidor de desarrollo (`npm run dev`) no corre con datos reales porque falta `src/data/productos.js` en la rama original. Para efectos de testing y coverage se usaron mocks en `tests/__mocks__/productos.js`.

## Próximos pasos (plan de commits)
1. **fix:** tests App y main con CarritoProvider + heading específico (estado estable, 11/11).  
2. **test:** aumentar coverage en CarritoContext (acciones de agregar/quitar).  
3. **test:** cubrir paths faltantes en ProductoCard (cantidad > 0, etc.).  
4. **test:** páginas Carrito y Catálogo (render básico sin crash).  

Con estos pasos se alcanzará el **100% de coverage** de forma incremental y con trazabilidad clara.

### Nota sobre `package-lock.json` en la raíz
En la carpeta raíz del repositorio (`team_8_alvaro/`) existe un archivo `package-lock.json` vacío, con la siguiente estructura mínima:

```json
{
  "name": "team_8_alvaro",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {}
}

Este archivo no contiene dependencias reales y no se utiliza en el proyecto. El package-lock.json válido y en uso es el que está dentro de la carpeta milsabores-app/, donde se encuentran todas las dependencias necesarias para ejecutar la aplicación y los tests. Se mantiene el archivo de la raíz sin modificar para no alterar la estructura original del repositorio.