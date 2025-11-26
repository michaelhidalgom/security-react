import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import styles from './Login.module.css';

// =============================================================================
// COMPONENTE LOGIN
// =============================================================================
// Esta página permite al usuario iniciar sesión.
// 
// Flujo:
// 1. Usuario ingresa email y password
// 2. Al enviar, llamamos a login() del contexto
// 3. Si es exitoso, navegamos al dashboard
// 4. Si falla, mostramos el mensaje de error
//
// CSS Modules:
// - Importamos estilos como objeto: import styles from './Login.module.css'
// - Usamos clases así: className={styles.nombreClase}
// - Esto genera nombres únicos y evita conflictos
// =============================================================================

const Login = () => {
  // =========================================================================
  // ESTADO LOCAL DEL FORMULARIO
  // =========================================================================
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // =========================================================================
  // HOOKS
  // =========================================================================
  // useAuth: Acceso al contexto de autenticación
  // useNavigate: Para redireccionar después del login
  // =========================================================================
  const { login } = useAuth();
  const navigate = useNavigate();

  // =========================================================================
  // MANEJADOR DE ENVÍO DEL FORMULARIO
  // =========================================================================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    // Prevenir recarga de página (comportamiento por defecto de los forms)
    e.preventDefault();
    
    // Limpiar error anterior y mostrar loading
    setError('');
    setLoading(true);

    // Intentar login
    const result = await login(email, password);

    if (result.success) {
      // Login exitoso: redirigir al dashboard
      navigate('/dashboard');
    } else {
      // Login fallido: mostrar error al usuario
      // El mensaje viene del auth.service con información útil
      setError(result.error || 'Error al iniciar sesión');
    }
    
    setLoading(false);
  };

  // =========================================================================
  // MANEJADORES DE CAMBIO DE INPUTS
  // =========================================================================
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  // =========================================================================
  // RENDERIZADO
  // =========================================================================
  // Observa cómo usamos styles.nombreClase en lugar de strings
  // Esto viene del CSS Module que importamos arriba
  // =========================================================================
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      
      {/* Mensaje de error - solo se muestra si hay error */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Campo de Email */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="ejemplo@correo.com"
            required
            className={styles.input}
          />
        </div>

        {/* Campo de Password */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            required
            className={styles.input}
          />
        </div>

        {/* Botón de Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <>
              <span className={styles.loadingSpinner}></span>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      {/* Texto de ayuda */}
      <p className={styles.helpText}>
        ¿Olvidaste tu contraseña?{' '}
        <a href="/recuperar" className={styles.helpLink}>
          Recupérala aquí
        </a>
      </p>
    </div>
  );
};

export default Login;
