export interface User {
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Respuesta que viene del backend Java
export interface BackendLoginResponse {
  tokenDeAcceso: string;
  tipoDeToken: string;
}

// Respuesta transformada que usa el frontend
export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}