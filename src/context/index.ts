// =============================================================================
// ÍNDICE DE EXPORTACIONES DEL CONTEXTO
// =============================================================================
// Este archivo centraliza las exportaciones del módulo de autenticación.
// 
// Permite importar así:
//   import { AuthProvider, useAuth } from '../context';
// 
// En lugar de:
//   import { AuthProvider } from '../context/AuthContext';
//   import { useAuth } from '../context/useAuth';
// =============================================================================

export { AuthProvider, AuthContext } from './AuthContext';
export { useAuth } from './useAuth';
