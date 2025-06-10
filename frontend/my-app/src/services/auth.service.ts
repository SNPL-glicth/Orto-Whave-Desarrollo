import axios from 'axios';

const API_URL = 'http://localhost:4000';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
  redirect: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw new Error('Error en la autenticación');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
}; 