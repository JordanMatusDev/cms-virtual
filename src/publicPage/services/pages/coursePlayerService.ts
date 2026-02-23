// Actualizar progreso de inscripción (PATCH)
export const updateRegistrationProgress = async (registrationId: string | number, payload: any) => {
  const { data } = await api.patch(`/api/v1/registrations/${registrationId}`, payload);
  return data;
};
// Obtener un curso específico por ID usando la nueva API
export const getCourseById = async (courseId: string | number) => {
  const { data } = await api.get(`/api/v1/courses/${courseId}`);
  return data;
};
// Servicio para CoursePlayer
import api from '../apiService';

// Nuevo endpoint para listar inscripciones por estudiante
export const getEnrollments = async (userId: string | number, skip = 0, limit = 100) => {
  const { data } = await api.get(`/api/v1/registrations/by-student/${userId}`, {
    params: { skip, limit },
  });
  return data;
};

export const getCertificate = async (enrollmentId: string | number) => {
  const { data } = await api.get(`/certificados/inscripcion/${enrollmentId}`);
  return data;
};

export const generateCertificate = async (enrollmentId: string | number) => {
  const { data } = await api.post(`/certificados/generar/${enrollmentId}`);
  return data;
};

export const downloadCertificate = async (certId: string | number) => {
  const { data } = await api.get(`/certificados/descargar/${certId}`);
  return data;
};
