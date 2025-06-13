                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: 'http://localhost:4000', // URL base del backend actualizada
  timeout: 5000, // timeout de 5 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject({
        ...error,
        message: error.response.data.message || 'Error en la solicitud'
      });
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      return Promise.reject({
        ...error,
        message: 'No se pudo conectar con el servidor'
      });
    } else {
      // Algo sucedió en la configuración de la solicitud
      return Promise.reject({
        ...error,
        message: 'Error al procesar la solicitud'
      });
    }
  }
);

export const userService = {
  getUsers: () => api.get('/usuarios'),
  getUser: (id) => api.get(`/usuarios/${id}`),
  updateUser: (id, userData) => api.put(`/usuarios/${id}`, userData),
  deleteUser: (id) => api.delete(`/usuarios/${id}`),
  activateUser: (id) => api.put(`/usuarios/${id}/activar`),
  deactivateUser: (id) => api.put(`/usuarios/${id}/desactivar`),
};

export default api; 