// =============================================================================
// TIPOS DE AUTENTICACIÓN
// =============================================================================
// Este archivo define todos los tipos TypeScript relacionados con autenticación.
// Tener tipos bien definidos ayuda a:
// 1. Prevenir errores en tiempo de desarrollo
// 2. Autocompletado en el IDE
// 3. Documentación implícita del código
// =============================================================================

// =============================================================================
// TIPOS BÁSICOS
// =============================================================================

/**
 * Token JWT (JSON Web Token) recibido del backend
 * Se usa para autenticar las peticiones a la API
 * Ejemplo: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
export type AuthToken = string;

/**
 * Representa un usuario autenticado en el sistema
 */
export interface User {
  /** Correo electrónico del usuario (identificador único) */
  email: string;
  /** Nombre para mostrar (opcional, puede no venir del backend) */
  name?: string;
}

// =============================================================================
// TIPOS DE CREDENCIALES Y PETICIONES
// =============================================================================

/**
 * Credenciales que el usuario ingresa en el formulario de login
 */
export interface LoginCredentials {
  /** Email ingresado por el usuario */
  email: string;
  /** Contraseña ingresada por el usuario */
  password: string;
}

// =============================================================================
// TIPOS DE RESPUESTA DEL BACKEND
// =============================================================================

/**
 * Respuesta RAW que viene del backend Java (Spring Boot)
 * Los nombres están en español porque así los definió el backend
 */
export interface BackendLoginResponse {
  /** El JWT token para autenticación */
  tokenDeAcceso: string;
  /** Tipo de token (normalmente "Bearer") */
  tipoDeToken: string;
}

/**
 * Respuesta transformada que usa internamente el frontend
 * Convertimos los nombres del backend a un formato más estándar
 */
export interface LoginResponse {
  /** Token JWT normalizado */
  token: AuthToken;
  /** Datos del usuario extraídos/construidos */
  user: User;
}

// =============================================================================
// TIPOS DEL CONTEXTO DE AUTENTICACIÓN
// =============================================================================

/**
 * Resultado de intentar hacer login
 * Usado para comunicar éxito o fracaso al componente que llama
 */
export interface LoginResult {
  /** true si el login fue exitoso, false si falló */
  success: boolean;
  /** Mensaje de error (solo presente si success es false) */
  error?: string;
}

/**
 * Interfaz completa del contexto de autenticación
 * Define todo lo que está disponible al usar useAuth()
 */
export interface AuthContextType {
  /** Usuario actualmente logueado (null si no hay sesión) */
  user: User | null;
  
  /** Token JWT actual (null si no hay sesión) */
  token: AuthToken | null;
  
  /** 
   * Función para iniciar sesión
   * @param email - Correo del usuario
   * @param password - Contraseña del usuario
   * @returns Promesa con el resultado del intento de login
   */
  login: (email: string, password: string) => Promise<LoginResult>;
  
  /** Función para cerrar sesión (limpia token y usuario) */
  logout: () => void;
  
  /** Indica si hay una sesión activa (true si hay token válido) */
  isAuthenticated: boolean;
}

// =============================================================================
// TIPOS DE ERROR HTTP
// =============================================================================

/**
 * Códigos de estado HTTP comunes en autenticación
 * Útil para manejar diferentes tipos de errores
 */
export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Estructura de error que puede venir del backend
 */
export interface ApiError {
  /** Código de estado HTTP */
  status: HttpStatusCode;
  /** Mensaje de error legible */
  message: string;
  /** Timestamp del error (opcional) */
  timestamp?: string;
}
