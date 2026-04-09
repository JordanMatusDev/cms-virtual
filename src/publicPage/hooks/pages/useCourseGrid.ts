import { useState, useEffect } from 'react';
import { getCourses } from '../../services/pages/courseGridService';
import type { Course } from '../../types/course.type';
import { useNotificacion } from '../../context/NotificationContext';

export const useCourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { addMultipleNotifications, showToast } = useNotificacion();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        const activeCourses = data.filter((c: any) =>
          (typeof c.activo === 'undefined') ? true : (c.activo == 1 || c.activo === true || c.activo === 'true')
        );

        const DIAS_NUEVO = 7; 
        const ahora = new Date();

        const formattedCourses: Course[] = activeCourses.map((c: any) => {
          const fechaCreacion = c.fecha_creacion ? new Date(c.fecha_creacion) : ahora;
          const diferenciaDias = (ahora.getTime() - fechaCreacion.getTime()) / (1000 * 3600 * 24);

          return {
            id: c.id,
            title: c.titulo || c.nombre || "Curso sin título",
            category: c.categoria?.nombre || "General",
            image: c.img || c.imagen_url || "",
            description: c.descripcion,
            author: c.autor || c.instructor || "Autor Anónimo",
            videoCount: c.modulos || 0,
            isNew: diferenciaDias <= DIAS_NUEVO
          };
        });

        setCourses(formattedCourses);

        const knownCourses = JSON.parse(localStorage.getItem('known_courses') || 'null');
        if (!knownCourses) {
          const allIds = formattedCourses.map(c => c.id);
          localStorage.setItem('known_courses', JSON.stringify(allIds));
        } else {
          const newCourses = formattedCourses.filter(c => !knownCourses.includes(c.id));

          if (newCourses.length > 0) {
            
            const notifsArray = newCourses.map(curso => ({
              title: '¡Nuevo Curso Disponible!',
              message: `Acabamos de publicar "${curso.title}". ¡Ve a descubrirlo!`,
              type: 'promo' as const,
              link: `/curso/${curso.id}`
            }));

            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (isLoggedIn) {
              addMultipleNotifications(notifsArray);
            } else {
              if (notifsArray.length === 1) {
                showToast(notifsArray[0]);
              } else if (notifsArray.length <= 3) {
                notifsArray.forEach((notif, index) => {
                  setTimeout(() => showToast(notif), index * 600);
                });
              } else {
                showToast({
                  title: '¡Nuevos Cursos Disponibles!',
                  message: `Hemos añadido ${notifsArray.length} nuevos cursos. ¡Inicia sesión para descubrirlos y disfrutarlos!`,
                  type: 'promo' as const
                });
              }
            }

            const allIds = formattedCourses.map(c => c.id);
            localStorage.setItem('known_courses', JSON.stringify(allIds));
          }
        }
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