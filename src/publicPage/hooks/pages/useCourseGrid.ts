import { useState, useEffect } from 'react';
import { getCourses } from '../../services/pages/courseGridService';
import type { Course } from '../../types/course.type';
// 1. IMPORTAMOS TU CONTEXTO DE NOTIFICACIONES
import { useNotificacion } from '../../context/NotificationContext'; // Ajusta la ruta si es distinta

export const useCourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 2. EXTRAEMOS LA FUNCIÓN PARA NOTIFICAR
  const { addNotification } = useNotificacion();

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
          description: c.descripcion,
          author: c.autor || c.instructor || "Autor Anónimo", 
          videoCount: c.modulos || 0
        }));

        setCourses(formattedCourses);

        const knownCourses = JSON.parse(localStorage.getItem('known_courses') || 'null');
        if (!knownCourses) {
          
          const allIds = formattedCourses.map(c => c.id);
          localStorage.setItem('known_courses', JSON.stringify(allIds));
        } else {
          const newCourses = formattedCourses.filter(c => !knownCourses.includes(c.id));

          if (newCourses.length === 1) {
            addNotification({
              title: '¡Nuevo Curso Disponible!',
              message: `Acabamos de publicar "${newCourses[0].title}". ¡Ve a descubrirlo!`,
              type: 'promo'
            });
          } else if (newCourses.length > 1) {
            addNotification({
              title: '¡Nuevos Cursos Disponibles!',
              message: `¡Tenemos ${newCourses.length} nuevos cursos para ti! Incluyendo "${newCourses[0].title}".`,
              type: 'promo'
            });
          }

          if (newCourses.length > 0) {
            const allIds = formattedCourses.map(c => c.id);
            localStorage.setItem('known_courses', JSON.stringify(allIds));
          }
        }
        // ---------------------------------------------------------------------------------------------------

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