// Servicio para Verification
import api from '../apiService';

export const verifyCertificate = async (code: string) => {
  const { data } = await api.get(`/api/v1/certificates/verify/${encodeURIComponent(code.trim())}`);
  return data;
};
