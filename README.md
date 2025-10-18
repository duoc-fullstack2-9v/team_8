# team_8

# Evidencia de Testing y Coverage – Pastelería Mil Sabores

## Estado actual
- **15/15 suites pasando**
- **40/40 tests verdes**
- Proyecto estable y funcional en la rama `feature/avance-matias-suazo-test`.

## Coverage Report (Vitest + V8)

All files             |   96.49 |    91.75 |    85.1 |   96.49
src                   |   100   |    100   |    100  |   100
src/components        |   96.09 |    90.24 |   88.46 |   96.09
  Footer.jsx          |   100   |    100   |   100   |   100
  FormContacto.jsx    |   98.61 |    100   |   100   |   98.61
  Header.jsx          |   100   |    100   |   100   |   100
  HeroBanner.jsx      |   100   |    100   |   100   |   100
  Login.jsx           |   88.88 |   71.42  |    80   |   88.88
  MensajeFlotante.jsx |   100   |    100   |   100   |   100
  Navbar.jsx          |   100   |    100   |   100   |   100
  ProductoCard.jsx    |   88.67 |    75    |   66.66 |   88.67
  Registro.jsx        |   100   |    100   |   100   |   100
src/context           |   84.14 |    80.95 |   100   |   84.14
  CarritoContext.jsx  |   84.14 |    80.95 |   100   |   84.14
src/data              |   100   |    100   |   100   |   100
  Productos.js        |   100   |    100   |   100   |   100
src/pages             |   97.64 |    100   |   69.23 |   97.64
  Blog.jsx            |   100   |    100   |   100   |   100
  Carrito.jsx         |   100   |    100   |   100   |   100
  Catalogo.jsx        |   100   |    100   |   100   |   100
  Contacto.jsx        |   100   |    100   |   100   |   100
  Inicio.jsx          |   100   |    100   |   100   |   100
  LoginPage.jsx       |   82.6  |    100   |    50   |   82.6
  Producto.jsx        |   100   |    100   |   33.33 |   100
  QuienesSomos.jsx    |   100   |    100   |   100   |   100
  RegistroUser.jsx    |   82.6  |    100   |    50   |   82.6

## Observaciones

- Componentes principales → 100% cubiertos (App, Header, Footer, Navbar, HeroBanner, Registro, FormContacto, MensajeFlotante).

- ProductoCard y Login → alta cobertura, faltan algunos paths de interacción y validación.

- CarritoContext → 84%, ya cubre agregar, eliminar, actualizar y vaciar.

- Pages → la mayoría al 100%, salvo:

  LoginPage.jsx y RegistroUser.jsx (82%) → faltan validaciones de formularios.

  Producto.jsx → 100% de statements/branches, pero marca 33% en funcs porque hay funciones internas no llamadas (no afecta la lógica principal).

- Archivos excluidos del coverage → main.jsx, vite.config.js, eslint.config.js.

Justificación: no contienen lógica de negocio, solo inicializan la aplicación o definen configuración. En entornos profesionales se excluyen del coverage.

## Nota aclaratoria

En esta rama se añadieron:

- Smoke tests para todas las páginas (pages.spec.jsx), asegurando que cada vista renderiza sin crashear dentro de CarritoProvider.

- Tests de integración para CarritoContext (acciones de agregar, eliminar, actualizar y vaciar).

- Tests para Productos.js (validación de exportaciones).

- Tests de interacción en Carrito.jsx y Producto.jsx, logrando cobertura total en ambos.

## Próximos pasos

- test: cubrir validaciones de formularios en LoginPage.jsx y RegistroUser.jsx.

- test: ampliar interacciones en ProductoCard.jsx y Login.jsx para cubrir ramas faltantes.

Con estos pasos se alcanzará el 100% de coverage de forma incremental y con trazabilidad clara.