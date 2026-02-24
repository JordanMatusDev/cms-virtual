import api from '../apiService';

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data } = await api.get('/api/v1/users/by-email', { params: { email } });
    if (typeof data === 'string' && data.length > 0) return true;
    if (typeof data === 'object' && data && (
      (typeof data.id === 'string' && data.id.length > 0) ||
      (typeof data.id === 'number' && !isNaN(data.id))
    )) return true;
    return false;
  } catch (err) {
    return false;
  }
}
