import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { AuthContextType } from '../types/auth.types';

// =============================================================================
// HOOK PERSONALIZADO: useAuth
// =============================================================================
// Este hook facilita el acceso al contexto de autenticación.
// 
// En lugar de escribir:
//   const context = useContext(AuthContext);
//   if (!context) throw new Error(...);
//
// Simplemente escribimos:
//   const { user, login, logout } = useAuth();
//
// Ventajas de separar el hook:
// 1. Código más limpio y reutilizable
// 2. Validación centralizada (verifica que estemos dentro del Provider)
// 3. Tipado automático de TypeScript
// 4. Fácil de testear de forma aislada
// =============================================================================

export const useAuth = (): AuthContextType => {
  // Obtenemos el valor actual del contexto
  const authContexType = useContext(AuthContext);
  
  // Si context es null, significa que useAuth() se está usando
  // fuera del AuthProvider. Esto es un error del desarrollador.
  if (!authContexType) {
    throw new Error(
      'useAuth debe usarse dentro de un AuthProvider. ' +
      'Asegúrate de envolver tu aplicación con <AuthProvider>.'
    );
  }
  // {user, token, login...}
  return authContexType;
};

// =============================================================================
// EJEMPLO DE USO
// =============================================================================
// 
// // En cualquier componente dentro de AuthProvider:
// import { useAuth } from '../context/useAuth';
// 
// const MiComponente = () => {
//   const { user, isAuthenticated, login, logout } = useAuth();
//   
//   if (!isAuthenticated) {
//     return <p>No has iniciado sesión</p>;
//   }
//   
//   return <p>Hola, {user?.name}!</p>;
// };
//
// =============================================================================
