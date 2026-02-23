import api from '../apiService';

// Token de servicio desde variable de entorno
const serviceToken = import.meta.env.VITE_SERVICE_TOKEN;

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data } = await api.get('/api/v1/users/?limit=500', {
      headers: { 'X-API-Key': serviceToken },
    });
    return data.some((user: any) => user.email.toLowerCase() === email.toLowerCase());
  } catch {
    return false;
  }
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const { data } = await api.get('/api/v1/users/?limit=500', {
      headers: { 'X-API-Key': serviceToken },
    });
    return data.some((user: any) => user.username.toLowerCase() === username.toLowerCase());
  } catch {
    return false;
  }
}
