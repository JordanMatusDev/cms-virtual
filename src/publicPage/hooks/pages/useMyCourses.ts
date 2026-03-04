import { useState, useEffect, useRef, useCallback, useMemo } from 'react'; // <--- AGREGADO useMemo
import { useNavigate } from 'react-router';
import { getUserEnrollments, deleteEnrollment } from '../../services/pages/myCoursesService';
import { useNotificacion } from '../../context/NotificationContext';

// --- TIPOS ---
export interface EnrolledCourse {
  id: number;
  courseId: number;
  title: string;
  image: string;
  category: string;
  progress: number;
  status: 'active' | 'completed';
}

// --- UTILIDADES ---
const parseProgressCount = (raw: string | null | undefined, total: number) => {
  if (!raw || raw === 'pendiente' || raw === '[]') return 0;
  if (raw.startsWith('i:')) {
    const indices = raw.slice(2).split(',').map((n) => parseInt(n, 10)).filter((n) => !Number.isNaN(n));
    return Math.min(indices.length, total || indices.length);
  }
  if (raw.startsWith('v:')) {
    const ids = raw.slice(2).split(',').filter(Boolean);
    return Math.min(ids.length, total || ids.length);
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? Math.min(parsed.length, total || parsed.length) : 0;
  } catch {
    return 0;
  }
};

export const useMyCourses = () => {
  const navigate = useNavigate();
  
  // --- DATOS DEL USUARIO ---
  const [userData] = useState(() => {
    const firstName = (localStorage.getItem('userNombre') || '').trim().split(' ')[0] || 'Estudiante';
    const firstLastName = (localStorage.getItem('userApellido') || '').trim().split(' ')[0] || '';
    return { firstName, displayName: `${firstName} ${firstLastName}`.trim() };
  });

  // --- ESTADOS ---
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  const { addNotification } = useNotificacion();

  // --- REFS ---
  const rowRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const loadEnrollments = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
          setLoading(false);
          return;
      } 
      try {
        const data = await getUserEnrollments(userId);
        const mapped: EnrolledCourse[] = (Array.isArray(data) ? data : []).map((item: any) => {
          const course = item.curso || {};
          const playlist = typeof course.playlist_id === 'string'
            ? course.playlist_id.split(',').map((v: string) => v.trim()).filter(Boolean)
            : [];
          const totalVideos = playlist.length;
          const completedFlag = Number(item.completado) === 1;
          const completedCount = completedFlag ? totalVideos : parseProgressCount(item.progreso, totalVideos);
          const progress = totalVideos > 0
            ? Math.min(100, Math.round((completedCount / totalVideos) * 100))
            : completedFlag ? 100 : 0;
          return {
            id: item.id,
            courseId: item.curso_id ?? course.id,
            title: course.titulo || course.nombre || 'Curso sin título',
            image: course.img || course.imagen_url || course.imagen || '',
            category: course.categoria?.nombre || 'General',
            progress,
            status: progress >= 100 ? 'completed' : 'active'
          };
        });
        setCourses(mapped);
      } catch (err) {
        console.error("Error cargando cursos:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    loadEnrollments();
  }, []);

  // --- LÓGICA FILTRADO (CORREGIDA CON USEMEMO) ---
  const availableCategories = useMemo(() => {
      return Array.from(new Set(courses.map(c => c.category))).sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
        const matchesStatus = filterStatus === 'all' 
          ? true 
          : filterStatus === 'completed' ? course.progress === 100 : course.progress < 100;
        const matchesCategory = filterCategory === 'Todas' ? true : course.category === filterCategory;
        return matchesStatus && matchesCategory;
      });
  }, [courses, filterStatus, filterCategory]); // <--- Solo cambia si cambian estas variables

  // --- LÓGICA SCROLL ---
  const checkScroll = useCallback(() => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      
      const newLeft = scrollLeft > 0;
      const newRight = scrollLeft < scrollWidth - clientWidth - 2;

      // Optimización extra: Solo actualizar estado si es diferente
      setCanScroll(prev => {
          if (prev.left === newLeft && prev.right === newRight) return prev;
          return { left: newLeft, right: newRight };
      });
    }
  }, []);

  // Listener de resize
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  // Actualizar flechas cuando cambian los cursos filtrados
  useEffect(() => {
    checkScroll();
  }, [filteredCourses, checkScroll]); 

  const slide = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.7;
      rowRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      // Pequeño timeout para permitir que termine la animación
      setTimeout(checkScroll, 500);
    }
  };

  // --- MANEJADORES DE EVENTOS ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    bannerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    bannerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    // Buscar el curso antes de eliminarlo
    const courseEliminado = courses.find(c => c.id === courseToDelete);
    try {
      await deleteEnrollment(courseToDelete);
      setCourses(prev => prev.filter(c => c.id !== courseToDelete));
    } finally {
      setCourseToDelete(null);
    }

    addNotification({
      title: 'Curso Eliminado',
      message: `El curso "${courseEliminado?.title || 'elegido'}" ha sido removido de tu lista de aprendizaje correctamente.`,
      type: 'remove' 
    });
  };

  // Retornamos todo lo que la UI necesita
  return {
    userData,
    loading,
    courses,
    filteredCourses,
    availableCategories,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    isCategoryOpen,
    setIsCategoryOpen,
    canScroll,
    rowRef,
    bannerRef,
    courseToDelete,
    setCourseToDelete,
    handleMouseMove,
    handleDeleteCourse,
    slide,
    navigate
  };
};