# 🧁 Mil Sabores - Pastelería Web App

Aplicación web de pastelería desarrollada con **React + Vite** que permite explorar productos, gestionar carrito de compras y administrar inventario.

![Coverage](https://img.shields.io/badge/Coverage-94.7%25-brightgreen)
![Tests](https://img.shields.io/badge/Tests-150%20passed-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-orange)

## 🚀 Características

#### Para Clientes
- 🛍️ **Catálogo completo** de productos de pastelería
- 🔍 **Filtros por categoría** (Tortas, Postres, Veganos, etc.)
- 🛒 **Carrito de compras** con gestión de cantidades
- 👤 **Sistema de autenticación** (Registro/Login)
- 📱 **Diseño responsive** para experiencia movil y de escritorio

#### Para Administradores
- ⚙️ **Panel de administración** con autenticación de rol
- 📊 **Gestión CRUD completa** de productos y usuarios
- 🔄 **Restauración** de catálogo base
- 📈 **Filtrado dinámico** por categoría
- 📦 **Gestión rápida** de inventario

### 🛠️ Tecnologías

- **Frontend:** React 18.2.0, Vite
- **Testing:** Vitest, Testing Library
- **Routing:** React Router DOM
- **Estado Global:** Context API
- **Estilos:** CSS Modules
- **Persistencia:** LocalStorage
- **Build:** Vite Optimized Build

### 🔒 Características Técnicas

- **Context API** para gestión del carrito y sesión de usuario
- **Interceptors con Axios** para autenticación vía token
- **Fallback automático a datos locales** en caso de falla de API
- **Componentes desacoplados** y altamente testeado
- **Arquitectura por features y servicios** 


## 📦 Instalación
### Prerrequisitos:
- Node.js 18+
- npm 9+

```bash
# Clonar repositorio
git clone https://github.com/duoc-fullstack2-9v/team_8.git
cd team_8/milsabores-app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build
```

## 🧪 Testing
El proyecto cuenta con un sistema de testing completo que garantiza la calidad del código:

### ✅ Métricas de Calidad:
- **94.7% Cobertura Total** - Líneas de código testeadas
- **173 Tests Pasando** - Suite completa funcional
- **100% Servicios** - Lógica de negocio completamente cubierta
- **95.71% Componentes** - UI robusta y confiable

### 🛠 Comandos de Testing:
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

### 📊 Cobertura por Categoría:
- **Servicios:** 100% 🚀
- **Componentes:** 95.71% 🚀
- **Páginas:** 92.53% 🚀
- **Contexto:** 83.95% 👍


## 👥 Equipo de Desarrollo

### Álvaro Chávez
**🎯 Rol:** Full Stack Developer & Arquitecto
**Responsabilidades:**
- Arquitectura y diseño del sistema completo
- Implementación de lógica de negocio y componentes
- Desarrollo de funcionalidades principales
- Integración de servicios y contexto global
- Logro: Sistema robusto con panel de administración y carrito funcional

### Matías Suazo
**🎯 Rol:** Quality Assurance & Testing Engineer
**Responsabilidades:**
- Desarrollo y ejecución de suites de pruebas completas
- Identificación y corrección de bugs críticos
- Garantía de calidad del código y funcionalidades
- Implementación de estrategias de testing
- Logro: 90.32% de cobertura con 150 tests automatizados



