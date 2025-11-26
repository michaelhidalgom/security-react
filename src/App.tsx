import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context'; // Importamos desde el índice
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// =============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// =============================================================================
// Este componente configura:
// 1. BrowserRouter - Habilita el enrutamiento en la aplicación
// 2. AuthProvider - Provee el contexto de autenticación a toda la app
// 3. Routes - Define las rutas disponibles
//
// Estructura del árbol de componentes:
// 
// <BrowserRouter>
//   └── <AuthProvider>           ← Envuelve todo para proveer autenticación
//         └── <Routes>
//               ├── /login       → <Login />
//               ├── /dashboard   → <ProtectedRoute> → <Dashboard />
//               └── /            → Redirect a /dashboard
// =============================================================================

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider debe envolver todas las rutas que necesiten autenticación */}
      <AuthProvider>
        <Routes>
          {/* Ruta pública: Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta protegida: Dashboard */}
          {/* ProtectedRoute verifica si hay sesión antes de mostrar Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta raíz: Redirige al dashboard */}
          {/* Si no está autenticado, ProtectedRoute lo enviará a login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
