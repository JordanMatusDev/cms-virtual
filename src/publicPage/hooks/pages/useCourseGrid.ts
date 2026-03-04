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
          description: c.descripcion
        }));

        setCourses(formattedCourses);

        // --- SISTEMA INTELIGENTE DE NUEVOS CURSOS ---
        const knownCourses = JSON.parse(localStorage.getItem('known_courses') || 'null');
        if (!knownCourses) {
          // Es la primera vez que el usuario entra en su vida. 
          // Guardamos todos los IDs en silencio para no hacerle spam con 20 notificaciones.
          const allIds = formattedCourses.map(c => c.id);
          localStorage.setItem('known_courses', JSON.stringify(allIds));
        } else {
          // Buscamos cuáles cursos de la base de datos NO están en la memoria del usuario
          const newCourses = formattedCourses.filter(c => !knownCourses.includes(c.id));

          if (newCourses.length === 1) {
            // Solo hay 1 curso nuevo
            addNotification({
              title: '¡Nuevo Curso Disponible!',
              message: `Acabamos de publicar "${newCourses[0].title}". ¡Ve a descubrirlo!`,
              type: 'promo'
            });
          } else if (newCourses.length > 1) {
            // Hay varios cursos nuevos de golpe
            addNotification({
              title: '¡Nuevos Cursos Disponibles!',
              message: `¡Tenemos ${newCourses.length} nuevos cursos para ti! Incluyendo "${newCourses[0].title}".`,
              type: 'promo'
            });
          }

          // Si hubo cursos nuevos, actualizamos la memoria para que no vuelva a avisar mañana
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
  }, []); // Dependencias vacías para que solo se ejecute al montar

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