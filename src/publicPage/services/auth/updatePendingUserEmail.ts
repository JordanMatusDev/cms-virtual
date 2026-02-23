import api from '../apiService';

export async function updatePendingUserEmail(currentEmail: string, newEmail: string) {
  try {
 
    const { data } = await api.get('/api/v1/users/by-email', { params: { email: currentEmail } });
    const userId = typeof data === 'object' && data.id ? data.id : data;
    if (!userId) throw new Error('Usuario no encontrado');

    await api.patch(`/api/v1/users/${userId}`, { email: newEmail });
    return userId;
  } catch (err) {
    return null;
  }
}
