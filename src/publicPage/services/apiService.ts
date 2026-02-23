import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api-main.virtual-edu.lat/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. INTERCEPTOR DE SOLICITUDES (El "Portero" de salida)

api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem('authToken');
    if (userToken) {
      config.headers['Authorization'] = `Bearer ${userToken}`;
      // Elimina X-API-Key si existe
      if (config.headers['X-API-Key']) delete config.headers['X-API-Key'];
    } else {
      const staticToken = import.meta.env.VITE_SERVICE_TOKEN;
      if (staticToken) {
        config.headers['X-API-Key'] = staticToken;
      } else {
        console.warn('No se encontró VITE_SERVICE_TOKEN en import.meta.env');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;