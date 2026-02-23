import { useState, useEffect } from 'react';

import { getCourses } from '../../services/pages/courseGridService';
import type { Course } from '../../types/course.type';

export const useCourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        // Filtrar activos
        const activeCourses = data.filter((c: any) => 
            (typeof c.activo === 'undefined') ? true : (c.activo == 1 || c.activo === true || c.activo === 'true')
        );
        // Mapear a nuestra interfaz
        const formattedCourses: Course[] = activeCourses.map((c: any) => ({
            id: c.id,
            title: c.titulo || c.nombre || "Curso sin título",
            category: c.categoria?.nombre || "General",
            image: c.img || c.imagen_url || "",
            description: c.descripcion
        }));
        setCourses(formattedCourses);
      } catch (err) {
        console.error("Error cargando cursos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Lógica de filtrado
  const availableCategories = Array.from(new Set(courses.map(c => c.category))).sort();
  const displayedCategories = filter === "Todas" ? availableCategories : [filter];

  return {
    courses,
    loading,
    filter,
    setFilter,
    isFilterOpen,
    setIsFilterOpen,
    availableCategories,
    displayedCategories
  };
};