🧁 milsabores-app
Aplicación web de pastelería desarrollada con React + Vite, que permite explorar productos, registrarse, iniciar sesión, gestionar el carrito y disfrutar de una experiencia moderna y profesional.

https://img.shields.io/badge/Coverage-88.57%2525-brightgreen
https://img.shields.io/badge/Tests-121%2520passed-success
https://img.shields.io/badge/React-18.2.0-blue
https://img.shields.io/badge/Vite-Build%2520Tool-orange

🚀 Tecnologías utilizadas
⚛️ React 18.2.0 - Biblioteca principal de UI

⚡ Vite - Herramienta de build y desarrollo rápido

🧪 Vitest + Testing Library - Framework de testing moderno

📊 V8 Coverage - Reporte de cobertura de código

🎨 CSS Modules - Estilos modulares y componentes

🧭 React Router - Navegación entre páginas

💾 LocalStorage - Persistencia de datos del cliente

📂 Estructura del proyecto
text
milsabores-app/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.jsx       # Encabezado con carrito
│   │   ├── Footer.jsx       # Pie de página
│   │   ├── Navbar.jsx       # Navegación principal
│   │   ├── ProductoCard.jsx # Tarjeta de producto
│   │   ├── Login.jsx        # Formulario de login
│   │   ├── Registro.jsx     # Formulario de registro
│   │   ├── FiltroCategorias.jsx # Filtro de productos
│   │   └── ...
│   ├── context/             # Estado global
│   │   └── CarritoContext.jsx # Gestión del carrito
│   ├── pages/               # Vistas principales
│   │   ├── Inicio.jsx       # Página de inicio
│   │   ├── Catalogo.jsx     # Catálogo de productos
│   │   ├── Carrito.jsx      # Gestión del carrito
│   │   ├── AdminDashboard.jsx # Panel de administración
│   │   └── ...
│   ├── services/            # Lógica de negocio
│   │   └── ProductosService.js # Gestión de productos
│   ├── styles/              # Estilos CSS
│   ├── data/                # Datos estáticos
│   ├── App.jsx              # Componente raíz
│   └── main.jsx             # Punto de entrada
├── tests/                   # Suite de tests
│   ├── components/          # Tests de componentes
│   ├── pages/               # Tests de páginas
│   ├── context/             # Tests de contexto
│   └── services/            # Tests de servicios
├── coverage/                # Reporte de cobertura
└── public/                  # Assets estáticos
🧪 Testing & Calidad
El proyecto cuenta con un sistema de testing completo que garantiza la calidad del código:

✅ Métricas de Calidad:
88.57% Cobertura Total - Líneas de código testeadas

121 Tests Pasando - Suite completa funcional

100% Servicios - Lógica de negocio completamente cubierta

94.6% Componentes - UI robusta y confiable

🛠 Comandos de Testing:
bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
📊 Cobertura por Categoría:
Servicios: 100% 🚀

Componentes: 94.6% 🚀

Páginas: 92.41% 🚀

Contexto: 83.95% 👍

🛠 Instalación y Desarrollo
Prerrequisitos:
Node.js 18+

npm 9+

Clonar y Configurar:
bash
git clone https://github.com/duoc-fullstack2-9v/team_8.git
cd team_8/milsabores-app
npm install
Ejecutar en Desarrollo:
bash
npm run dev
Build para Producción:
bash
npm run build
📦 Scripts Disponibles
Comando	Descripción
npm run dev	Servidor de desarrollo en localhost:5173
npm run build	Build optimizado para producción
npm run preview	Preview del build de producción
npm test	Ejecuta todos los tests
npm run test:coverage	Tests con reporte de cobertura
npm run test:ui	Interfaz visual de testing
🎯 Funcionalidades Principales
Para Clientes:
🛍️ Catálogo de productos con filtros por categoría

🔍 Búsqueda y visualización de productos

🛒 Carrito de compras con gestión de cantidades

👤 Sistema de autenticación (registro/login)

📱 Diseño responsive para todos los dispositivos

Para Administradores:
⚙️ Panel de administración con credenciales especiales

📊 Gestión completa de productos (CRUD)

🔄 Restauración de productos base

📈 Filtros y estadísticas de inventario

🔒 Características Técnicas
Estado Global: Context API para gestión del carrito

Persistencia: LocalStorage para datos de sesión

Ruteo: React Router para navegación SPA

Testing: Vitest + Testing Library para tests unitarios e integración

Build: Vite para desarrollo rápido y builds optimizados

Calidad: 88.57% de cobertura garantiza código confiable

🚀 Próximos Pasos
☁️ Integración con AWS - Despliegue en la nube

🔄 CI/CD Pipeline - Integración y despliegue continuo

📱 PWA - Progressive Web App capabilities

🗃️ Base de Datos - Persistencia en backend

👥 Equipo de Desarrollo
Matías Suazo
🎯 Rol: Quality Assurance & Testing Engineer
Responsabilidades:

Desarrollo y ejecución de suites de pruebas completas

Identificación y corrección de bugs críticos

Garantía de calidad del código y funcionalidades

Implementación de estrategias de testing

Logro: 88.57% de cobertura con 121 tests automatizados

Álvaro Chávez
🎯 Rol: Full Stack Developer & Arquitecto
Responsabilidades:

Arquitectura y diseño del sistema completo

Implementación de lógica de negocio y componentes

Desarrollo de funcionalidades principales

Integración de servicios y contexto global

Logro: Sistema robusto con panel de administración y carrito funcional

📄 Licencia
Este proyecto fue desarrollado como parte del curso FullStack II de Duoc UC.

¿Listo para endulzar tu día? 🍰 ¡Explora Mil Sabores y descubre los mejores postres!