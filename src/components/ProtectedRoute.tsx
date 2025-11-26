import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ReactNode } from 'react';

// =============================================================================
// COMPONENTE PROTECTED ROUTE
// =============================================================================
// Este componente actúa como un "guardián" de rutas protegidas.
// 
// Funcionamiento:
// 1. Verifica si el usuario está autenticado (usando el contexto)
// 2. Si NO está autenticado → Redirige a /login
// 3. Si SÍ está autenticado → Muestra el contenido hijo (children)
//
// Uso:
// <ProtectedRoute>
//   <Dashboard />  ← Solo se renderiza si hay sesión activa
// </ProtectedRoute>
// =============================================================================

interface ProtectedRouteProps {
  /** El componente hijo que se mostrará si el usuario está autenticado */
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Obtenemos el estado de autenticación del contexto
  const { isAuthenticated } = useAuth();

  // Si no hay sesión activa, redirigimos al login
  // "replace" evita que el usuario pueda volver atrás con el botón del navegador
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizamos el contenido protegido
  // Fragment (<>) evita añadir un div extra al DOM
  return <>{children}</>;
};

export default ProtectedRoute;

// =============================================================================
// NOTAS ADICIONALES PARA APRENDIZAJE
// =============================================================================
//
// ¿Por qué usar "replace" en Navigate?
// -------------------------------------
// Sin "replace":  historial = [..., /dashboard, /login]
//                 El usuario puede presionar "atrás" y volver a intentar
//                 acceder a la ruta protegida.
// 
// Con "replace":  historial = [..., /login]
//                 Se reemplaza la entrada, comportamiento más limpio.
//
// Patrón de Rutas Protegidas
// --------------------------
// Este es un patrón muy común en aplicaciones React:
// 
// 1. RUTAS PÚBLICAS: Accesibles sin autenticación
//    - /login
//    - /registro
//    - /recuperar-password
// 
// 2. RUTAS PROTEGIDAS: Requieren autenticación
//    - /dashboard
//    - /perfil
//    - /configuracion
//
// Alternativa: Higher-Order Component (HOC)
// -----------------------------------------
// Otra forma de implementar esto sería con un HOC:
// 
// const withAuth = (Component) => {
//   return (props) => {
//     const { isAuthenticated } = useAuth();
//     if (!isAuthenticated) return <Navigate to="/login" />;
//     return <Component {...props} />;
//   };
// };
// 
// const ProtectedDashboard = withAuth(Dashboard);
//
// =============================================================================