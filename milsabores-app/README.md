# 🧁 milsabores-app

Aplicación web de pastelería desarrollada con **React + Vite**, que permite explorar productos, registrarse, iniciar sesión, gestionar el carrito y disfrutar de una experiencia moderna y profesional.

![Coverage Badge](https://img.shields.io/badge/Coverage-46.68%25-yellow)

---

## 🚀 Tecnologías utilizadas

- ⚛️ React 18.2.0
- ⚡ Vite
- 🧪 Vitest + Testing Library
- 🎯 Cobertura con V8
- 📦 npm

---

## 📂 Estructura del proyecto

milsabores-app/
├── src/
│ ├── components/ # Componentes reutilizables
│ ├── context/ # Contexto global del carrito
│ ├── data/ # Datos de productos
│ ├── pages/ # Vistas principales
│ ├── styles/ # Estilos CSS por página
│ ├── App.jsx # Componente raíz
│ └── main.jsx # Punto de entrada
├── tests/ # Tests unitarios e integración
├── coverage/ # Reporte de cobertura generado por Vitest
├── setupTests.js # Mocks globales
├── vite.config.js # Configuración de Vite y Vitest
├── package.json
└── README.md

## 🧪 Testing

El proyecto incluye tests para componentes, páginas y contexto global, con cobertura automática.

### Ejecutar tests:


- npm test

- npm run test:coverage

## 📊 Última cobertura registrada: 46.68% líneas | 74.35% ramas | 60.46% funciones

## 🛠 Instalación

### Clona el repositorio:

- git clone https://github.com/tu-usuario/milsabores-app.git
- cd milsabores-app

### Instala dependencias:

- npm install

### Ejecuta la app en desarrollo:

- npm run dev

  ## 📦 Scripts disponibles

- `npm run dev` → Ejecuta la app en modo desarrollo
- `npm test` → Ejecuta todos los tests
- `npm run test:coverage` → Muestra el reporte de cobertura

## ✅ Requisitos

- Node.js 18+
- npm 9+
- Navegador moderno

## 🔒 Notas técnicas

- React está bloqueado en la versión 18.2.0 para evitar errores de testing.
- setupTests.js incluye mocks globales de react-router-dom y CarritoContext.
- vite.config.js fuerza alias para evitar múltiples copias de React.

## 👥 Autores

### **Matías Suazo**
- **Rol**: Quality Assurance & Testing
- **Responsabilidades**: 
  - Desarrollo y ejecución de suites de pruebas
  - Identificación y corrección de bugs
  - Garantía de calidad del código
  - Verificación de funcionalidades

### **Álvaro Chávez** 
- **Rol**: Full Stack Developer
- **Responsabilidades**:
  - Arquitectura y diseño del sistema
  - Implementación de lógica de negocio
  - Desarrollo de componentes principales
  - Integración de funcionalidades