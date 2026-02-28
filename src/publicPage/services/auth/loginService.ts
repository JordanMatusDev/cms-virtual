import api from '../apiService';

export async function loginService(identifier: string, password: string) {
  try {
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
      // EXTRAEMOS EL CÓDIGO DEL BACKEND (ej: el 3 de usuario deshabilitado)
      const errorCode = error.response.data?.code; 
      
      if (typeof error.response.data?.detail === 'string') {
        errorMessage = error.response.data.detail;
      } else if (Array.isArray(error.response.data?.detail)) {
        errorMessage = error.response.data.detail[0]?.msg || 'Error de validación en los datos.';
      }

      return { 
        error: errorMessage, 
        status: error.response.status,
        code: errorCode // <--- AHORA EL HOOK PODRÁ LEER ESTO
      };
    }
    return { error: error.message || 'Error de red', status: 500 };
  }
}