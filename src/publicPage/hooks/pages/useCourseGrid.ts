import { useState, useEffect } from 'react';
import { getCourses } from '../../services/pages/courseGridService';
import type { Course } from '../../types/course.type';
import { useNotificacion } from '../../context/NotificationContext'; 

export const useCourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { addNotification, showToast } = useNotificacion();
  // Eliminamos const { user } = useAuthSession(); porque usaremos localStorage

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        const activeCourses = data.filter((c: any) =>
          (typeof c.activo === 'undefined') ? true : (c.activo == 1 || c.activo === true || c.activo === 'true')
        );
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

          if (newCourses.length > 0) {
            newCourses.forEach((curso, index) => {
              setTimeout(() => {
                const notif = {
                  title: '¡Nuevo Curso Disponible!',
                  message: `Acabamos de publicar "${curso.title}". ¡Ve a descubrirlo!`,
                  type: 'promo' as const,
                  link: `/curso/${curso.id}`
                };
                
                // VERIFICACIÓN INMEDIATA: Leemos directamente del localStorage 
                // en el momento exacto en que se va a disparar la notificación
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

                if (isLoggedIn) {
                  addNotification(notif);
                } else {
                  showToast(notif);
                }
              }, index * 600);
            });

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
  }, []); // <-- AQUÍ ESTABA LA MAGIA: Quitamos el [user] para evitar que se ejecute doble

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