// Servicio para restablecimiento de contraseña desde email

import api from '../apiService';

export async function confirmPasswordReset(
  token: string, 
  newPassword: string
): Promise<{ success: boolean; message?: string; status?: number }> {
  try {
    if (!token || !newPassword) {
      return { success: false, message: 'Parámetros inválidos', status: 400 };
    }
    const response = await api.post('/api/v1/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return { success: true, message: response.data.message, status: response.status };
  } catch (error: any) {
    let message = 'No se pudo restablecer la contraseña.';
    let status = error.response?.status;

    // Aquí está la magia: Buscamos "detail" que es lo que manda tu backend en el error 400
    if (error.response?.data?.detail) {
      // Por si es un string (error 400) o un array (error 422 de validación)
      message = typeof error.response.data.detail === 'string' 
        ? error.response.data.detail 
        : 'Datos inválidos.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }


    
    return { success: false, message, status };
  }

  
}

// Agrega esto en tu archivo de servicios (ej. resetPasswordService.ts)

export async function checkActionToken(token: string): Promise<boolean> {
  try {
    const response = await api.get(`/api/v1/auth/check-action-token?token=${token}`);
    // Devuelve true si el backend dice que es válido, false si no.
    return response.data?.valid === true; 
  } catch (error) {
    // Si el backend lanza un error 400, 422 o similar, asumimos que el token ya no sirve
    return false;
  }
}
