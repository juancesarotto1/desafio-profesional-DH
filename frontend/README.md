# Car Rental Frontend

## Descripción del Proyecto

Este es el frontend de una aplicación web completa de alquiler de autos, desarrollado como parte de un proyecto final. La aplicación permite a los usuarios explorar y reservar vehículos, gestionar favoritos, ver sus reservas, y acceder a un panel de administración para gestionar productos (autos) y categorías. El frontend se comunica con un backend REST API para todas las operaciones de datos.

La aplicación está construida con tecnologías modernas de React, utilizando Vite como bundler para un desarrollo rápido y eficiente. Incluye autenticación de usuarios, gestión de estado con Context API, navegación con React Router, y una interfaz de usuario responsiva y atractiva.

## Características Principales

### Para Usuarios
- **Exploración de Vehículos**: Visualización de autos disponibles con imágenes, descripciones, precios y características.
- **Búsqueda y Filtrado**: Búsqueda por nombre de auto y filtrado por categorías.
- **Recomendaciones**: Sistema de recomendaciones de vehículos.
- **Autenticación**: Registro e inicio de sesión de usuarios con JWT.
- **Gestión de Favoritos**: Agregar/quitar autos de favoritos.
- **Reservas**: Sistema de reservas con selección de fechas y detalles del auto.
- **Mis Reservas**: Visualización y gestión de reservas realizadas.
- **Blog**: Sección informativa (placeholder para contenido futuro).
- **WhatsApp Integration**: Botón flotante para contacto vía WhatsApp.

### Para Administradores
- **Panel de Administración**: Acceso restringido solo para usuarios con rol ADMIN.
- **CLAVE Y USUARIO ADMIN**: usuario:admin@admin.com, contraseña: admin123.
- **Gestión de Productos**: Crear, editar y eliminar autos con validación de al menos 5 imágenes por vehículo.
- **Gestión de Categorías**: Crear, editar y eliminar categorías de vehículos.
- **Interfaz Intuitiva**: Formularios con validación y previsualización de imágenes.

### Características Técnicas
- **Responsive Design**: Optimizado para dispositivos móviles y desktop.
- **Manejo de Errores**: Gestión robusta de errores de red y API.
- **Persistencia de Sesión**: Almacenamiento local de tokens JWT.
- **Interfaz Moderna**: Diseño con efectos glassmorphism y animaciones suaves.
- **SEO Friendly**: Estructura semántica HTML.

## Stack Tecnológico

### Frontend
- **React 19**: Biblioteca principal para la construcción de la interfaz de usuario.
- **Vite**: Bundler y servidor de desarrollo ultra-rápido.
- **React Router DOM**: Navegación y enrutamiento de páginas.
- **Axios**: Cliente HTTP para comunicaciones con el backend.
- **Context API**: Gestión global del estado de la aplicación.
- **Lucide React**: Biblioteca de iconos vectoriales.
- **React DatePicker**: Componente para selección de fechas.
- **Date-fns**: Utilidades para manipulación de fechas.

### Desarrollo y Build
- **ESLint**: Linting y análisis de código estático.
- **Vite Plugins**: Plugin de React para optimización.

### Estilos
- **CSS Modules**: Estilos modulares y scoped.
- **CSS Variables**: Sistema de variables para temas consistentes.
- **Responsive CSS**: Media queries para adaptabilidad.

## Prerrequisitos

Antes de ejecutar este proyecto, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior) - [Descargar Node.js](https://nodejs.org/)
- **npm** (viene incluido con Node.js) o **yarn**
- **Backend API**: El proyecto requiere un backend corriendo en `http://localhost:8080/api`. Asegúrate de que el backend esté configurado y ejecutándose antes de iniciar el frontend.

### Verificación de Prerrequisitos
```bash
node --version
npm --version
```

## Instalación

1. **Clona el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd car-rental-frontend
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Verifica la instalación**:
   ```bash
   npm list --depth=0
   ```

## Configuración

### Variables de Entorno
El proyecto utiliza configuración hardcoded para el desarrollo local. La URL base de la API está configurada en `src/services/api.js`:

```javascript
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});
```

Si necesitas cambiar la URL del backend, modifica este archivo.

### Configuración de ESLint
El proyecto incluye configuración de ESLint para mantener la calidad del código. La configuración se encuentra en `eslint.config.js`.

## Ejecución del Proyecto

### Modo Desarrollo
Para ejecutar el proyecto en modo desarrollo con hot reload:

```bash
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173` (puerto por defecto de Vite).

### Build de Producción
Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`.

### Vista Previa de Producción
Para previsualizar la build de producción localmente:

```bash
npm run preview
```

### Linting
Para ejecutar el linter y verificar la calidad del código:

```bash
npm run lint
```

## Uso de la Aplicación

### Acceso General
1. Abre `http://localhost:5173` en tu navegador.
2. Regístrate como nuevo usuario o inicia sesión con una cuenta existente.
3. Explora los autos disponibles en la página principal.
4. Utiliza la búsqueda para encontrar vehículos específicos.
5. Filtra por categorías para ver autos de un tipo particular.
6. Haz clic en un auto para ver detalles completos.
7. Agrega autos a favoritos para acceder rápidamente.
8. Realiza reservas seleccionando fechas y confirmando.

### Acceso al Panel de Administración
Para acceder al panel de administración:

1. Inicia sesión con credenciales de administrador.
2. **Correo electrónico**: `admin@admin.com`
3. **Contraseña**: `admin123`

Una vez dentro, podrás:
- Gestionar productos (autos): crear, editar, eliminar.
- Gestionar categorías: crear, editar, eliminar.
- Ver listas de productos y categorías existentes.

**Nota**: Solo usuarios con rol `ADMIN` pueden acceder a esta sección.

## Estructura del Proyecto

```
car-rental-frontend/
├── public/
│   └── vite.svg              # Icono de Vite
├── src/
│   ├── assets/
│   │   └── react.svg         # Logo de React
│   ├── components/           # Componentes reutilizables
│   │   ├── Categories.jsx    # Componente de categorías
│   │   ├── Hero.jsx          # Sección hero con búsqueda
│   │   ├── Navbar.jsx        # Barra de navegación
│   │   ├── Recommendations.jsx # Recomendaciones de productos
│   │   └── WhatsAppButton.jsx # Botón de WhatsApp
│   ├── context/              # Context API para estado global
│   │   ├── AuthContext.context.js
│   │   ├── AuthContext.jsx    # Contexto de autenticación
│   │   ├── BookingContext.context.js
│   │   ├── BookingContext.jsx # Contexto de reservas
│   │   ├── FavoritesContext.context.js
│   │   ├── FavoritesContext.jsx # Contexto de favoritos
│   │   ├── useAuth.js         # Hook personalizado para auth
│   │   ├── useBookings.js     # Hook para reservas
│   │   └── useFavorites.js    # Hook para favoritos
│   ├── pages/                 # Páginas de la aplicación
│   │   ├── Admin.jsx          # Panel de administración
│   │   ├── Blog.jsx           # Página del blog
│   │   ├── Booking.jsx        # Página de reserva
│   │   ├── Favorites.jsx      # Página de favoritos
│   │   ├── Home.jsx           # Página principal
│   │   ├── Login.jsx          # Página de login
│   │   ├── MyBookings.jsx     # Mis reservas
│   │   ├── ProductDetail.jsx  # Detalle de producto
│   │   └── Register.jsx       # Página de registro
│   ├── services/
│   │   └── api.js             # Configuración de Axios y API
│   ├── utils/
│   │   └── carSpecs.js        # Utilidades para especificaciones de autos
│   ├── App.css                # Estilos globales de la app
│   ├── App.jsx                # Componente principal de la app
│   ├── index.css              # Estilos base
│   └── main.jsx               # Punto de entrada de React
├── .gitignore                 # Archivos ignorados por Git
├── eslint.config.js           # Configuración de ESLint
├── index.html                 # HTML base
├── package.json               # Dependencias y scripts
├── package-lock.json          # Lockfile de npm
├── README.md                  # Este archivo
└── vite.config.js             # Configuración de Vite
```

## API Endpoints Utilizados

El frontend consume los siguientes endpoints del backend:

### Autenticación
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario

### Productos (Autos)
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/products/category/:categoryId` - Productos por categoría
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Categorías
- `GET /api/categories` - Obtener todas las categorías
- `POST /api/categories` - Crear categoría (admin)
- `PUT /api/categories/:id` - Actualizar categoría (admin)
- `DELETE /api/categories/:id` - Eliminar categoría (admin)

### Reservas
- `POST /api/bookings` - Crear reserva
- `GET /api/bookings/user/:userId` - Obtener reservas del usuario

### Favoritos
- `POST /api/favorites` - Agregar a favoritos
- `DELETE /api/favorites/:id` - Remover de favoritos
- `GET /api/favorites/user/:userId` - Obtener favoritos del usuario

## Dependencias y Versiones

### Dependencias de Producción
- `axios: ^1.13.3` - Cliente HTTP
- `date-fns: ^4.1.0` - Utilidades de fecha
- `lucide-react: ^0.563.0` - Iconos
- `react: ^19.2.0` - Biblioteca React
- `react-datepicker: ^9.1.0` - Selector de fechas
- `react-dom: ^19.2.0` - DOM de React
- `react-router-dom: ^7.13.0` - Router de React

### Dependencias de Desarrollo
- `@eslint/js: ^9.39.1` - Configuración ESLint
- `@types/react: ^19.2.5` - Tipos TypeScript para React
- `@types/react-dom: ^19.2.3` - Tipos TypeScript para React DOM
- `@vitejs/plugin-react: ^5.1.1` - Plugin Vite para React
- `eslint: ^9.39.1` - Linter
- `eslint-plugin-react-hooks: ^7.0.1` - Reglas ESLint para hooks
- `eslint-plugin-react-refresh: ^0.4.24` - Plugin para React refresh
- `globals: ^16.5.0` - Variables globales para ESLint
- `vite: ^7.2.4` - Bundler

## Versionado

- **Versión Actual**: 0.0.0
- **Estado**: Desarrollo / Proyecto Final

## Actualizaciones y Mantenimiento

### Actualización de Dependencias
Para actualizar las dependencias a sus últimas versiones:

```bash
npm update
```

### Verificación de Vulnerabilidades
```bash
npm audit
```

Para corregir vulnerabilidades automáticamente:
```bash
npm audit fix
```

## Troubleshooting

### Problemas Comunes

1. **Error de conexión al backend**:
   - Asegúrate de que el backend esté corriendo en `http://localhost:8080`
   - Verifica que no haya conflictos de CORS

2. **Errores de autenticación**:
   - Limpia el localStorage del navegador
   - Verifica que el token JWT no haya expirado

3. **Problemas con imágenes**:
   - Asegúrate de que las URLs de imágenes sean válidas y accesibles
   - Para el panel admin, verifica que se agreguen al menos 5 imágenes por producto

4. **Errores de build**:
   - Ejecuta `npm install` para asegurar todas las dependencias
   - Verifica la versión de Node.js

### Logs de Depuración
Los logs de la aplicación se muestran en la consola del navegador. Para debugging:
- Abre las DevTools del navegador (F12)
- Revisa la pestaña Console para mensajes de error
- Los requests API se loggean con detalles

## Contribución

Este proyecto fue desarrollado como trabajo final. Para modificaciones:

1. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios
3. Ejecuta tests y linting: `npm run lint`
4. Crea un commit descriptivo
5. Push a la rama y crea un Pull Request

## Licencia

Este proyecto es privado y fue desarrollado como parte de un trabajo académico.

## Contacto

Para soporte o consultas sobre el proyecto, utiliza el botón de WhatsApp integrado en la aplicación o contacta al desarrollador.

---

