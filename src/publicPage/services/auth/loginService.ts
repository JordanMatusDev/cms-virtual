import api from '../apiService';

export async function loginService(identifier: string, password: string) {
  try {
    // 1. Enviamos "username" como lo pide la nueva API
    const response = await api.post('/api/v1/auth/login', { 
      username: identifier, 
      password: password 
    });
    
    const data = response.data;
    
    if (!data.access_token) {
      return { error: 'Token no recibido', status: 500 };
    }
    
    return { data };
    
  } catch (error: any) {
    if (error.response) {
      let errorMessage = 'No se pudo iniciar sesión.';
      
      if (typeof error.response.data?.detail === 'string') {
        errorMessage = error.response.data.detail;
      } else if (Array.isArray(error.response.data?.detail)) {
        errorMessage = error.response.data.detail[0]?.msg || 'Error de validación en los datos.';
      }

      return { 
        error: errorMessage, 
        status: error.response.status 
      };
    }
    return { error: error.message || 'Error de red', status: 500 };
  }
}