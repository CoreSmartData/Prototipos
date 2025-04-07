import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000, // 5 segundos de timeout
  withCredentials: true // Importante para CORS con credenciales
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

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout en la petición');
      return Promise.reject(new Error('El servidor está tardando demasiado en responder'));
    }
    
    if (!error.response) {
      console.error('Error de conexión:', error.message);
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    }

    // Si el error es de autenticación, redirigir al login
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    console.error('Error en la petición:', {
      status: error.response.status,
      data: error.response.data,
      url: error.config.url
    });
    
    return Promise.reject(error);
  }
);

export default api; 