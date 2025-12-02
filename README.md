# Sistema de Autenticación con React Context API


## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Flujo de Autenticación](#flujo-de-autenticación)
4. [Conceptos Clave](#conceptos-clave)
5. [Instalación y Ejecución](#instalación-y-ejecución)
6. [Guía de Archivos](#guía-de-archivos)

---

## Descripción General

Este proyecto implementa un sistema de autenticación completo que demuestra:

- **Context API**: Manejo de estado global sin Redux
- **Custom Hooks**: Encapsulación de lógica reutilizable
- **Protected Routes**: Rutas que requieren autenticación
- **TypeScript**: Tipado estático para mejor desarrollo
- **CSS Modules**: Estilos encapsulados por componente

---

## Estructura del Proyecto

```
src/
├── components/
│   └── ProtectedRoute.tsx    # Componente guardián de rutas
│
├── context/
│   ├── AuthContext.tsx       # Provider y contexto de autenticación
│   ├── useAuth.ts            # Hook personalizado para usar el contexto
│   └── index.ts              # Exportaciones centralizadas
│
├── pages/
│   ├── Login.tsx             # Página de inicio de sesión
│   ├── Login.module.css      # Estilos del Login (CSS Module)
│   ├── Dashboard.tsx         # Página principal (protegida)
│   └── Dashboard.module.css  # Estilos del Dashboard (CSS Module)
│
├── services/
│   └── auth.service.ts       # Lógica de API y localStorage
│
├── types/
│   └── auth.types.ts         # Definiciones de TypeScript
│
├── App.tsx                   # Configuración de rutas
└── main.tsx                  # Punto de entrada
```

---

## Flujo de Autenticación

### Diagrama General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FLUJO DE LOGIN                                │
└─────────────────────────────────────────────────────────────────────────┘

Usuario ingresa email y password
            │
            ▼
┌─────────────────────┐
│    Login.tsx        │ ──────────► Captura credenciales del formulario
│    (Componente)     │
└─────────────────────┘
            │
            │ llama a login(email, password)
            ▼
┌─────────────────────┐
│   AuthContext.tsx   │ ──────────► Gestiona el estado global
│    (Contexto)       │
└─────────────────────┘
            │
            │ llama a authService.login()
            ▼
┌─────────────────────┐
│  auth.service.ts    │ ──────────► Hace petición HTTP al backend
│    (Servicio)       │
└─────────────────────┘
            │
            │ POST /api/auth/login
            ▼
┌─────────────────────┐
│   Backend (Java)    │ ──────────► Valida credenciales, genera JWT
│   Puerto 8090       │
└─────────────────────┘
            │
            │ { tokenDeAcceso: "jwt...", tipoDeToken: "Bearer" }
            ▼
┌─────────────────────┐
│  auth.service.ts    │ ──────────► Transforma respuesta
│                     │             Guarda en localStorage
└─────────────────────┘
            │
            │ { token, user }
            ▼
┌─────────────────────┐
│   AuthContext.tsx   │ ──────────► Actualiza estado: setToken, setUser
│                     │             isAuthenticated = true
└─────────────────────┘
            │
            │ { success: true }
            ▼
┌─────────────────────┐
│    Login.tsx        │ ──────────► navigate('/dashboard')
└─────────────────────┘
            │
            ▼
┌─────────────────────┐
│  ProtectedRoute     │ ──────────► Verifica isAuthenticated ✓
└─────────────────────┘
            │
            ▼
┌─────────────────────┐
│   Dashboard.tsx     │ ──────────► ¡Usuario ve el dashboard!
└─────────────────────┘
```

### Diagrama de Manejo de Errores

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FLUJO DE ERROR EN LOGIN                            │
└─────────────────────────────────────────────────────────────────────────┘

auth.service.ts recibe respuesta de error del backend
            │
            ▼
    ┌───────────────────────────────────────┐
    │   response.ok === false               │
    │   ¿Cuál es el status code?            │
    └───────────────────────────────────────┘
            │
    ┌───────┼───────┬───────┬───────┬───────┬───────┐
    │       │       │       │       │       │       │
    ▼       ▼       ▼       ▼       ▼       ▼       ▼
  400     401     403     404     500     503    otros
   │       │       │       │       │       │       │
   ▼       ▼       ▼       ▼       ▼       ▼       ▼
"Datos   "Email  "Cuenta "No     "Error  "Servi- "Error
 inváli-  o con-  blo-    existe  del     cio no  inespe-
 dos"     traseña queada" cuenta" servidor" disp."  rado"
   │       │       │       │       │       │       │
   └───────┴───────┴───────┴───────┴───────┴───────┘
                    │
                    ▼
        throw new Error(mensaje descriptivo)
                    │
                    ▼
        ┌───────────────────────┐
        │   AuthContext.tsx     │
        │   catch (error)       │
        │   return { success:   │
        │     false, error }    │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Login.tsx           │
        │   setError(result.    │
        │     error)            │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Usuario ve mensaje  │
        │   descriptivo en      │
        │   pantalla            │
        └───────────────────────┘
```

### Diagrama de Persistencia de Sesión

```
┌─────────────────────────────────────────────────────────────────────────┐
│               FLUJO DE RECUPERACIÓN DE SESIÓN                           │
└─────────────────────────────────────────────────────────────────────────┘

Usuario recarga la página o abre nueva pestaña
            │
            ▼
┌─────────────────────┐
│   App.tsx           │ ──────────► Se monta el componente
│   <AuthProvider>    │
└─────────────────────┘
            │
            ▼
┌─────────────────────┐
│  AuthContext.tsx    │
│  useEffect(() => {  │ ──────────► Se ejecuta al montar
│    ...              │
│  }, [])             │
└─────────────────────┘
            │
            │ authService.getToken()
            │ authService.getUser()
            ▼
┌─────────────────────┐
│  localStorage       │ ──────────► Busca datos guardados
│  ┌───────────────┐  │
│  │ auth_token    │  │
│  │ auth_user     │  │
│  └───────────────┘  │
└─────────────────────┘
            │
            ▼
    ┌───────────────────────┐
    │ ¿Hay token y usuario? │
    └───────────────────────┘
           │          │
          SÍ         NO
           │          │
           ▼          ▼
    setToken()    loading = false
    setUser()     (usuario debe
    loading =      hacer login)
      false
           │
           ▼
    isAuthenticated = true
    (sesión restaurada)
```

---

## Conceptos Clave

### 1. Context API

El Context API permite compartir datos entre componentes sin pasar props manualmente.

```
                    ┌──────────────────┐
                    │  AuthProvider    │  ← Provee el contexto
                    │  (valor global)  │
                    └────────┬─────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │   Login     │   │  Dashboard  │   │  Navbar     │
    │             │   │             │   │             │
    │ useAuth() ──┼───┼── useAuth() ┼───┼── useAuth() │
    └─────────────┘   └─────────────┘   └─────────────┘
    
    Todos pueden acceder a: user, token, login, logout, isAuthenticated
```

### 2. Custom Hook (useAuth)

Encapsula la lógica de acceso al contexto:

```typescript
// Sin el hook (verboso):
const context = useContext(AuthContext);
if (!context) throw new Error('...');
const { user } = context;

// Con el hook (limpio):
const { user } = useAuth();
```

### 3. Protected Routes

```
            Petición a /dashboard
                    │
                    ▼
            ┌───────────────┐
            │ ProtectedRoute│
            │ ¿isAuthenticated?
            └───────┬───────┘
                    │
          ┌─────────┴─────────┐
          │                   │
        TRUE               FALSE
          │                   │
          ▼                   ▼
    ┌───────────┐       ┌───────────┐
    │ Dashboard │       │  Redirect │
    │ (render)  │       │ to /login │
    └───────────┘       └───────────┘
```

### 4. CSS Modules

Los CSS Modules generan nombres de clase únicos automáticamente:

```css
/* Login.module.css */
.container { ... }
```

```tsx
// Login.tsx
import styles from './Login.module.css';

// styles.container → "Login_container_x7yz3"
<div className={styles.container}>
```

```
Ventaja: Sin conflictos entre componentes
┌──────────────────┐    ┌──────────────────┐
│ Login            │    │ Dashboard        │
│ .container       │    │ .container       │
│ ↓                │    │ ↓                │
│ Login_container_ │    │ Dashboard_       │
│ x7yz3            │    │ container_a3bc1  │
└──────────────────┘    └──────────────────┘
        ↑                        ↑
        └── Clases diferentes ───┘
```

---

## Instalación y Ejecución

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Backend Java corriendo en `localhost:8090`

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:5173
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Ejecuta el linter |

---

## Guía de Archivos

### `/src/context/AuthContext.tsx`
**Responsabilidad**: Mantener el estado de autenticación y proveerlo a la app.

Conceptos que aprenderás:
- `createContext()` - Crear un contexto
- `useState()` - Estado local
- `useEffect()` - Efectos secundarios
- Provider pattern

### `/src/context/useAuth.ts`
**Responsabilidad**: Hook personalizado para consumir el contexto.

Conceptos que aprenderás:
- Custom hooks
- `useContext()`
- Validación de contexto

### `/src/services/auth.service.ts`
**Responsabilidad**: Comunicación con el backend y localStorage.

Conceptos que aprenderás:
- Fetch API
- Manejo de errores HTTP
- localStorage
- Transformación de datos

### `/src/types/auth.types.ts`
**Responsabilidad**: Definiciones de TypeScript.

Conceptos que aprenderás:
- Interfaces
- Types
- Enums
- Documentación con JSDoc

### `/src/components/ProtectedRoute.tsx`
**Responsabilidad**: Proteger rutas que requieren autenticación.

Conceptos que aprenderás:
- Composición de componentes
- Navegación programática
- Patrones de autorización

### `/src/pages/Login.tsx` y `/src/pages/Dashboard.tsx`
**Responsabilidad**: Páginas de la aplicación.

Conceptos que aprenderás:
- Formularios controlados
- Eventos en React
- CSS Modules
- Renderizado condicional

---

## Próximos Pasos de Aprendizaje

1. **Agregar validación de formularios** con una librería como `react-hook-form`
2. **Implementar refresh tokens** para mantener sesiones largas
3. **Agregar roles de usuario** (admin, user, guest)
4. **Implementar con `useReducer`** para estado más complejo
5. **Agregar tests** con React Testing Library
