// Servicio para Certificates
import api from '../apiService';

// Nuevo endpoint para listar inscripciones por estudiante
export const getUserEnrollments = async (userId: string | number, headers?: any, skip = 0, limit = 100) => {
  const { data } = await api.get(`/api/v1/registrations/by-student/${userId}`, {
    params: { skip, limit },
    headers,
  });
  return data;
};

// Obtener certificado por id de inscripción usando el nuevo endpoint
export const getCertificateByEnrollment = async (enrollmentId: string | number, headers?: any) => {
  const { data } = await api.get(`/api/v1/certificates/by-registration/${enrollmentId}`, { headers });
  return data;
};

// Generar certificado enviando registration_id en el body
export const generateCertificate = async (enrollmentId: string | number, headers?: any) => {
  const { data } = await api.post('/api/v1/certificates/', { registration_id: enrollmentId }, { headers });
  return data;
};

export const downloadCertificate = async (certId: string | number, headers?: any) => {
  const response = await api.get(`/api/v1/certificates/${certId}/download`, {
    headers,
    responseType: 'blob',
  });
  return response.data;
};
