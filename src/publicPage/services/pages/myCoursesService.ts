// Servicio para MyCourses
import api from '../apiService';

export const getUserEnrollments = async (userId: string | number, skip = 0, limit = 100) => {
  const { data } = await api.get(`/api/v1/registrations/by-student/${userId}`, {
    params: { skip, limit },
  });
  return data;
};

export const deleteEnrollment = async (enrollmentId: string | number) => {
  const { data } = await api.delete(`/api/v1/registrations/${enrollmentId}`);
  return data;
};
