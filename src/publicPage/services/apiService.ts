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
      // Verifica expiración del JWT
      try {
        const payload = JSON.parse(atob(userToken.split('.')[1]));
        if (payload && payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp < now) {
            // Token expirado: limpiar sesión
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('userNombre');
            localStorage.removeItem('userApellido');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('userId');
            window.location.reload();
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          }
        }
      } catch (e) {
        // Si el token no es válido, lo eliminamos por seguridad
        localStorage.removeItem('authToken');
      }
      config.headers['Authorization'] = `Bearer ${userToken}`;
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