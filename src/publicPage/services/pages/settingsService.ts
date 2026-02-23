// Servicio de usuario para Settings
import api from '../apiService';

// PATCH para actualizar perfil y/o contraseña
export const updateUserProfile = async (userId: string | number, payload: any) => {
  const { data } = await api.patch(`/api/v1/users/${userId}`, payload);
  return data;
};

export const updateUserPassword = async (userId: string | number, newPassword: string) => {
  const { data } = await api.patch(`/api/v1/users/${userId}`, { password: newPassword });
  return data;
};

// POST para login
export const verifyUserCredentials = async (username: string, password: string) => {
  const { data } = await api.post('/api/v1/auth/login', { username, password });
  return data;
};

// DELETE para eliminar usuario
export const deleteUserAccount = async (userId: string | number) => {
  const { data } = await api.delete(`/api/v1/users/${userId}`);
  return data;
};

// POST para subir avatar a S3
export const uploadUserAvatar = async (userId: string | number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/api/v1/users/${userId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
