import {createContext,useState,useContext,useEffect,ReactNode} from 'react';
import { AuthContextType, User, LoginResult } from '../types/auth.types';
import * as authService from '../services/auth.service';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const data = await authService.login({ email, password });

      authService.saveToken(data.token);
      authService.saveUser(data.user);

      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: message };
    }
  };

  const logout = (): void => {
    authService.removeToken();
    authService.removeUser();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};