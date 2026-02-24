import api from '../apiService';

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data } = await api.get('/api/v1/users/by-email', { params: { email } });
    // Si retorna un string (ID), el usuario existe
    return typeof data === 'string' && data.length > 0;
  } catch (err) {
    // Si hay error (422 o 404), el usuario no existe
    return false;
  }
}
