// Servicio para CourseGrid
import api from '../apiService';

// Nuevo servicio para obtener cursos con paginación opcional
export const getCourses = async (skip = 0, limit = 100) => {
  try {
    const { data } = await api.get('/api/v1/courses/', {
      params: { skip, limit },
    });
    return data;
  } catch (error) {
    // Puedes personalizar el manejo de errores según tu app
    console.error('Error cargando cursos:', error);
    throw error;
  }
};
