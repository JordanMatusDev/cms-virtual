import axios from 'axios';
import { handleErrorResponse } from '@/admin/utils/apiUtils';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_ENDPOINTS = {
   LOGIN: 'api/v1/auth/login-admin',
   USERS: 'api/v1/users/',
   COURSES: 'api/v1/courses/',
   CATEGORIES: 'api/v1/categories/',
   AVATAR: 'api/v1/users/{userId}/avatar',
   STATS: 'api/v1/stats/',
   COURSES_REGISTRATIONS: 'api/v1/registrations/by-course/{course_id}',
   USERS_REGISTRATIONS: 'api/v1/registrations/by-student/{student_id}',
};

// Configuración de Axios para manejar las solicitudes a la API
const api = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   timeout: 10000, // Tiempo de espera para las solicitudes
});

api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('access_token');

      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

api.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      if (error.response) {
         console.error(
            `[API Error ${error.response.status}]:`,
            error.response.data
         );

         if (error.response.status === 401) {
            console.log('Token inválido o expirado, cerrando sesión...');
            window.dispatchEvent(new CustomEvent('auth-error'));
         }

         handleErrorResponse(error.response);
      } else if (error.request) {
         console.error('[API Error]: No hay respuesta del servidor');
      } else {
         console.error('[API Error]:', error.message);
      }

      return Promise.reject(error);
   }
);
export default api;
