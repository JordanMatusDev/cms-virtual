// Servicio para restablecimiento de contraseña desde email

import api from '../apiService';

export async function confirmPasswordReset(token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
  try {
    if (!token || !newPassword) {
      throw new Error('Parámetros inválidos');
    }
    const response = await api.post('/api/v1/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    let message = 'No se pudo restablecer la contraseña.';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return { success: false, message };
  }
}
