import api from '../apiService';

/**
 * Verifica el email usando el token
 */
export async function verifyAndActivateUser(token: string): Promise<'success' | 'already' | 'error'> {
  try {
    // Solo hacemos el await sin asignar el resultado a una variable
    await api.post('/api/v1/auth/verify-email', { token });
    
    // Si llega a esta línea sin lanzar error, es un 200 OK
    return 'success';

  } catch (error: any) {
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string') {
      const detailLower = detail.toLowerCase();
      
      // Ajusta estas palabras clave según lo que devuelva tu backend
      if (
        detailLower.includes('ya verificado') || 
        detailLower.includes('already verified') || 
        detailLower.includes('ya fue verificado') ||
        detailLower.includes('ya utilizado')
      ) {
        return 'already';
      }
    }

    return 'error';
  }
}