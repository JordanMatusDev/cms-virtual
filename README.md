# Virtual+ Frontend

Aplicación web construida con React + Vite que integra dos dominios funcionales en un solo frontend:

- **Panel de Administración** (`src/admin`): gestión de usuarios, cursos y operaciones internas.
- **Aplicación Pública (Alumnos)** (`src/publicPage`): navegación pública, autenticación de alumno, cursos, certificados y configuración de cuenta.

---

## 1) Tecnologías principales

### Base de la aplicación

- **React 19** + **TypeScript**
- **Vite 7** como bundler y servidor de desarrollo
- **React Router 7** para enrutamiento

### UI y experiencia visual

- **Material UI (MUI)** para el módulo administrativo y tematización global
- **React Icons** y **Lucide React** para iconografía
- **Tailwind CSS** (con `tailwindcss-animate`) para vistas públicas

### Datos, estado y red

- **TanStack Query** para fetching/cache de datos
- **Axios** para clientes HTTP (API principal y YouTube)
- **Zod** para esquemas y validaciones tipadas

---

## 2) Arquitectura actual del proyecto

```text
public/                      # Assets estáticos públicos
src/
  App.tsx                    # Router principal (admin + app pública)
  main.tsx                   # Bootstrap global (ThemeProvider, QueryClient)

  admin/                     # Dominio administrativo
    core/
      config/                # Config de APIs internas / YouTube
      constants/             # Textos, paths y constantes UI
      context/               # AuthContext admin
    features/
      auth/                  # Login admin
      adminPanel/            # Contenedor principal panel
      users/                 # Gestión de usuarios
      courses/               # Gestión de cursos
      youtubeData/           # Integración de datos YouTube
    routes/                  # Rutas y protección de rutas admin
    pages/                   # Páginas del admin
    theme/                   # Tema MUI y estilos compartidos
    utils/                   # Utilidades transversales

  publicPage/                # Dominio público/alumnos
    components/              # Componentes reutilizables de UI
    hooks/                   # Hooks de auth, header y páginas
    layout/                  # Header/Footer/Layout público
    pages/                   # Vistas de cursos, certificados, settings
    services/                # Servicios API auth/email/pages
    routes/                  # Guard de rutas privadas alumno
    email/                   # Flujos reset/verify por email
```

### Decisiones de arquitectura relevantes

- **Monorepo frontend por dominios**: separación clara de responsabilidades entre `admin` y `publicPage`.
- **Router unificado** en `src/App.tsx` con guards independientes:
  - `admin/routes/ProtectedRoute.tsx` (admin autenticado)
  - `publicPage/routes/PublicProtectedRoute.tsx` (alumno autenticado)
- **Capa de servicios desacoplada** en ambos dominios (`services/`) para centralizar llamadas API.
- **Providers globales** en `main.tsx`: `ThemeProvider` (MUI) + `QueryClientProvider` (TanStack Query).

---

## 3) Requisitos previos

- **Node.js 18 o superior** (recomendado: Node 20 LTS)
- **npm 9 o superior**

Verificación rápida:

```bash
node -v
npm -v
```

---

## 4) Instalación de dependencias

Desde la raíz del proyecto:

```bash
npm install
```

---

## 5) Configuración de entorno (`.env`)

Este proyecto usa variables `VITE_*` consumidas por Vite en tiempo de build/runtime del cliente.

### 5.1 Variables detectadas en el código

- `VITE_API_BASE_URL`: URL base de la API principal.
- `VITE_SERVICE_TOKEN`: token de servicio para requests públicos sin sesión.
- `VITE_YOUTUBE_API_KEY`: API Key para endpoints de YouTube usados en admin.

### 5.2 Archivo sugerido

Crear un archivo `.env` (o `.env.local`) en la raíz del proyecto:

```env
VITE_API_BASE_URL=https://api-main.virtual-edu.lat/
VITE_SERVICE_TOKEN=tu_token_de_servicio
VITE_YOUTUBE_API_KEY=tu_youtube_api_key
```

### 5.3 Recomendaciones de seguridad

- No versionar secretos reales en Git.
- Usar credenciales distintas por entorno (`dev`, `staging`, `prod`).
- Rotar tokens si fueron expuestos accidentalmente.

---

## 6) Ejecución en modo desarrollo

```bash
npm run dev
```

Vite mostrará la URL local (normalmente `http://localhost:5173`).

---

## 7) Build de producción

Genera la build optimizada (TypeScript + Vite):

```bash
npm run build
```

Salida esperada:

- Carpeta `dist/` con assets listos para despliegue.

---

## 8) Preview de build local

Para probar localmente la build de producción:

```bash
npm run preview
```

Esto levanta un servidor estático usando el contenido de `dist/`.

---

## 9) Scripts disponibles

- `npm run dev` → inicia entorno de desarrollo con Vite.
- `npm run build` → compila TypeScript y genera build de producción.
- `npm run preview` → sirve localmente la build generada.
---

## 10) Documentación técnica adicional recomendada

Referencias oficiales:

- React: https://react.dev/
- Vite: https://vite.dev/
- Material UI: https://mui.com/material-ui/all-components/
- TanStack Query: https://tanstack.com/query/latest
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/docs
- Axios: https://axios-http.com/docs/intro

---

## 11) Notas operativas

- La app mezcla MUI y Tailwind por dominio funcional (admin/público).
- La autenticación admin y alumno se maneja con guards separados.
- Revisar `src/admin/core/config/` y `src/publicPage/services/` cuando se cambie backend o credenciales.
