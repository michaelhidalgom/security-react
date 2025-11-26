import { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginResult } from '../types/auth.types';
import * as authService from '../services/auth.service';

// =============================================================================
// CONTEXTO DE AUTENTICACIÓN
// =============================================================================
// El contexto es un "contenedor global" que permite compartir datos entre
// componentes sin necesidad de pasar props manualmente en cada nivel.
// 
// Flujo: AuthProvider envuelve la app → cualquier componente hijo puede
// acceder a user, token, login, logout usando el hook useAuth()
// =============================================================================

// Creamos el contexto con valor inicial null
// Esto nos permite detectar si alguien usa useAuth() fuera del Provider
export const AuthContext = createContext<AuthContextType | null>(null);

// =============================================================================
// PROPS DEL PROVIDER
// =============================================================================
interface AuthProviderProps {
  children: ReactNode; // Los componentes hijos que tendrán acceso al contexto
}

// =============================================================================
// AUTH PROVIDER - El componente que provee el estado de autenticación
// =============================================================================
// Este componente:
// 1. Mantiene el estado del usuario y token
// 2. Recupera la sesión guardada al iniciar (persistencia)
// 3. Provee funciones para login/logout
// 4. Envuelve a todos los componentes que necesitan acceso a la autenticación
// =============================================================================
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Estado del usuario actual (null si no está logueado)
  const [user, setUser] = useState<User | null>(null);
  
  // Token JWT para autenticar peticiones al backend
  const [token, setToken] = useState<AuthToken | null>(null);
  
  // Indica si estamos verificando la sesión guardada
  const [loading, setLoading] = useState<boolean>(true);

  // =========================================================================
  // EFECTO: Recuperar sesión al cargar la aplicación
  // =========================================================================
  // useEffect con array vacío [] se ejecuta solo una vez al montar el componente
  // Aquí verificamos si hay una sesión guardada en localStorage
  // =========================================================================
  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getUser();

    // Si encontramos token y usuario guardados, restauramos la sesión
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    
    // Indicamos que terminamos de verificar
    setLoading(false);
  }, []);

  // =========================================================================
  // FUNCIÓN: Iniciar sesión
  // =========================================================================
  // Recibe email y password, los envía al backend, y si es exitoso:
  // 1. Guarda el token y usuario en localStorage (persistencia)
  // 2. Actualiza el estado del contexto
  // 3. Retorna { success: true } o { success: false, error: "mensaje" }
  // =========================================================================
  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // Llamamos al servicio que hace la petición HTTP al backend
      const data = await authService.login({ email, password });

      // Guardamos en localStorage para persistir entre recargas
      authService.saveToken(data.token);
      authService.saveUser(data.user);

      // Actualizamos el estado del contexto
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      // Capturamos el mensaje de error para mostrarlo al usuario
      const message = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: message };
    }
  };

  // =========================================================================
  // FUNCIÓN: Cerrar sesión
  // =========================================================================
  // Limpia todo: localStorage y estado del contexto
  // =========================================================================
  const logout = (): void => {
    authService.removeToken();
    authService.removeUser();
    setToken(null);
    setUser(null);
  };

  // =========================================================================
  // VALOR DEL CONTEXTO
  // =========================================================================
  // Este objeto es lo que reciben los componentes al usar useAuth()
  // =========================================================================
  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token, // Convierte token a booleano: true si existe
  };

  // Mientras verificamos la sesión, mostramos un loading
  // Esto evita que se muestre brevemente la página de login
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Proveemos el contexto a todos los componentes hijos
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =============================================================================
// TIPO PERSONALIZADO PARA TOKEN
// =============================================================================
// Importamos el tipo desde auth.types.ts para mantener consistencia
// =============================================================================
type AuthToken = string; // JWT token del backend
