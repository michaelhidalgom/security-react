import { LoginCredentials, LoginResponse, User, BackendLoginResponse } from '../types/auth.types';

const API_BASE_URL = 'http://localhost:8090/api';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  // Recibir la respuesta del backend Java
  const data: BackendLoginResponse = await response.json();

  // Transformar la respuesta al formato que espera el frontend
  return {
    token: data.tokenDeAcceso,
    user: {
      email: credentials.email,
      name: credentials.email.split('@')[0]
    }
  };
};

export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const saveUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};