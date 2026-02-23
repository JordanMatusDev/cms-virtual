export interface EnrolledCourse {
  id: number; // ID de la inscripción
  courseId: number;
  title: string;
  image: string;
  category: string;
  progress: number; // 0 a 100
  lastViewed?: string; // Fecha opcional
  status: 'active' | 'completed';
}
