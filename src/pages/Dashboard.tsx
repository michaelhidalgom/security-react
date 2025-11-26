import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

// =============================================================================
// COMPONENTE DASHBOARD
// =============================================================================
// Esta es la página principal después del login.
// Solo usuarios autenticados pueden acceder (ver ProtectedRoute).
// 
// Demuestra:
// - Cómo consumir datos del usuario desde el contexto
// - Cómo implementar el logout
// - Uso de CSS Modules para estilos
// =============================================================================

const Dashboard = () => {
  // =========================================================================
  // OBTENER DATOS DEL CONTEXTO
  // =========================================================================
  // Destructuramos solo lo que necesitamos: user y logout
  // =========================================================================
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // =========================================================================
  // MANEJADOR DE LOGOUT
  // =========================================================================
  // 1. Llama a logout() del contexto (limpia token y localStorage)
  // 2. Redirige a la página de login
  // =========================================================================
  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  // =========================================================================
  // RENDERIZADO
  // =========================================================================
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header con título y botón de logout */}
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Tarjeta de bienvenida */}
        <div className={styles.welcomeCard}>
          <p className={styles.welcomeText}>
            ¡Bienvenido, <span className={styles.userName}>{user?.name || user?.email}</span>!
          </p>
        </div>

        {/* Tarjeta con información del usuario */}
        <div className={styles.infoCard}>
          <h2 className={styles.infoTitle}>Tu información</h2>
          
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user?.email}</span>
            </div>
            
            {user?.name && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nombre:</span>
                <span className={styles.infoValue}>{user.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ejemplo de estadísticas (contenido de ejemplo) */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>12</p>
            <p className={styles.statLabel}>Proyectos activos</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>48</p>
            <p className={styles.statLabel}>Tareas completadas</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>5</p>
            <p className={styles.statLabel}>Notificaciones</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
