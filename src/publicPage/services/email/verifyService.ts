// src/services/verifyService.ts
import api from '../apiService';

/**
 * Verifica el email usando el token
 */
export async function verifyAndActivateUser(token: string): Promise<'success' | 'already' | 'error'> {
  try {
    const resp = await api.post('/api/v1/auth/verify-email', { token });
    // Si el backend retorna status o algún campo para saber si ya estaba verificado, puedes adaptarlo aquí
    if (resp.data?.verification === true) {
      return 'already';
    }
    return 'success';
  } catch (e) {
    return 'error';
  }
}
