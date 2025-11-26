import { LoginCredentials, LoginResponse, 
  User, 
  BackendLoginResponse,
  AuthToken,
  HttpStatusCode 
} from '../types/auth.types';

// =============================================================================
// SERVICIO DE AUTENTICACIÓN
// =============================================================================
// Este archivo contiene todas las funciones relacionadas con:
// 1. Comunicación con el backend (API calls)
// 2. Manejo del almacenamiento local (localStorage)
//
// Separar esto del contexto permite:
// - Testear la lógica de API de forma aislada
// - Reutilizar funciones en otros lugares
// - Cambiar la implementación sin afectar al contexto
// =============================================================================

// URL base del backend - en producción vendría de variables de entorno
const API_BASE_URL = 'http://localhost:8090/api';

// Claves para localStorage (constantes para evitar errores de tipeo)
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

// =============================================================================
// FUNCIONES DE API
// =============================================================================

/**
 * Realiza el login contra el backend
 * 
 * @param credentials - Email y password del usuario
 * @returns Promesa con token y datos del usuario
 * @throws Error con mensaje descriptivo si falla
 * 
 * @example
 * try {
 *   const { token, user } = await login({ email: 'test@example.com', password: '123' });
 *   console.log('Bienvenido', user.name);
 * } catch (error) {
 *   console.error('Error:', error.message);
 * }
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  
  let response: Response;
  
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  } catch (networkError) {
    // Error de red (sin conexión, servidor caído, CORS, etc.)
    throw new Error(
      'No se pudo conectar con el servidor. ' +
      'Verifica tu conexión a internet e intenta nuevamente.'
    );
  }

  // =========================================================================
  // MANEJO DE ERRORES HTTP - Punto 4: Errores más descriptivos
  // =========================================================================
  // Diferentes códigos de estado requieren diferentes mensajes para el usuario
  // =========================================================================
  
  if (!response.ok) {
    switch (response.status) {
      case HttpStatusCode.BAD_REQUEST:
        // 400 - Datos inválidos enviados al servidor
        throw new Error(
          'Los datos enviados no son válidos. ' +
          'Verifica que el email tenga formato correcto.'
        );
      
      case HttpStatusCode.UNAUTHORIZED:
        // 401 - Credenciales incorrectas
        throw new Error(
          'Email o contraseña incorrectos. ' +
          'Por favor, verifica tus credenciales e intenta nuevamente.'
        );
      
      case HttpStatusCode.FORBIDDEN:
        // 403 - Usuario bloqueado o sin permisos
        throw new Error(
          'Tu cuenta está bloqueada o no tiene permisos de acceso. ' +
          'Contacta al administrador.'
        );
      
      case HttpStatusCode.NOT_FOUND:
        // 404 - Usuario no existe
        throw new Error(
          'No existe una cuenta con ese email. ' +
          '¿Deseas registrarte?'
        );
      
      case HttpStatusCode.INTERNAL_SERVER_ERROR:
        // 500 - Error del servidor
        throw new Error(
          'Error interno del servidor. ' +
          'Por favor, intenta nuevamente en unos minutos.'
        );
      
      case HttpStatusCode.SERVICE_UNAVAILABLE:
        // 503 - Servidor en mantenimiento
        throw new Error(
          'El servicio está temporalmente no disponible. ' +
          'Estamos trabajando para resolverlo.'
        );
      
      default:
        // Cualquier otro error
        throw new Error(
          `Error inesperado (código ${response.status}). ` +
          'Por favor, intenta nuevamente.'
        );
    }
  }

  // =========================================================================
  // PROCESAR RESPUESTA EXITOSA
  // =========================================================================
  
  let data: BackendLoginResponse;
  
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error(
      'Error al procesar la respuesta del servidor. ' +
      'Contacta al soporte técnico.'
    );
  }

  // Validar que la respuesta tenga los campos esperados
  if (!data.tokenDeAcceso) {
    throw new Error(
      'Respuesta del servidor incompleta. ' +
      'No se recibió el token de acceso.'
    );
  }

  // Transformar la respuesta del backend al formato del frontend
  return {
    token: data.tokenDeAcceso,
    user: {
      email: credentials.email,
      name: extractNameFromEmail(credentials.email),
    },
  };
};

// =============================================================================
// FUNCIONES DE ALMACENAMIENTO LOCAL (localStorage)
// =============================================================================

/**
 * Guarda el token JWT en localStorage
 * @param token - Token JWT a guardar
 */
export const saveToken = (token: AuthToken): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Obtiene el token JWT guardado
 * @returns El token o null si no existe
 */
export const getToken = (): AuthToken | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Elimina el token del localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Guarda los datos del usuario en localStorage
 * @param user - Objeto usuario a guardar
 */
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Obtiene el usuario guardado en localStorage
 * @returns El usuario o null si no existe
 */
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  
  if (!userStr) {
    return null;
  }
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    // Si el JSON está corrupto, limpiamos el storage
    removeUser();
    return null;
  }
};

/**
 * Elimina el usuario del localStorage
 */
export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Limpia toda la sesión (token y usuario)
 * Útil para logout completo
 */
export const clearSession = (): void => {
  removeToken();
  removeUser();
};

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/**
 * Extrae un nombre legible del email
 * @param email - Email del usuario
 * @returns Nombre extraído y capitalizado
 * 
 * @example
 * extractNameFromEmail('juan.perez@empresa.com') // 'Juan.perez'
 */
const extractNameFromEmail = (email: string): string => {
  const namePart = email.split('@')[0];
  // Capitalizar primera letra
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};
