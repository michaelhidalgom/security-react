import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context'; // Importamos desde el índice
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// =============================================================================
// App: COMPONENTE PRINCIPAL DE LA APLICACIÓN
// =============================================================================
// Este componente configura:
// 1. BrowserRouter - Habilita el enrutamiento en la aplicación
// 2. AuthProvider - Provee el contexto de autenticación a toda la app
// 3. Routes - Define las rutas disponibles
// =============================================================================

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider debe envolver todas las rutas que necesiten autenticación */}
      <AuthProvider>
        <Routes>
          {/* Ruta raíz: Redirige al dashboard */}
          {/* Si no está autenticado, ProtectedRoute lo enviará a login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

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

          {/* Ruta pública: Login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
