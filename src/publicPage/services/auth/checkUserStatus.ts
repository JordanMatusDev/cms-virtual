import api from '../apiService';

export async function checkUserStatus(username: string) {
  try {
    const res = await api.get(`/api/v1/users/by-username/${encodeURIComponent(username)}`);
    if (res.status === 200) {
      const user = res.data;
      return {
        ...user,
        status: Boolean(user.status),
        verification: Boolean(user.verification),
      };
    }
  } catch (e) {
    return null;
  }
}
