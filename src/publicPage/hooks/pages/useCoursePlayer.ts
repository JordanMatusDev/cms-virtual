import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import type { YouTubeEvent } from 'react-youtube';

import { getEnrollments } from '../../services/pages/coursePlayerService';
import api from '../../services/apiService';

// --- UTILIDAD PARA PARSEAR PROGRESO ---
const parseProgressArray = (raw: string | null | undefined): number[] => {
    if (!raw || raw === 'pendiente' || raw === '[]') return [];
    try {
        if (raw.startsWith('[')) {
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr.map(Number).filter(n => !isNaN(n)) : [];
        }
        if (raw.startsWith('i:')) {
            return raw.slice(2).split(',').map((n) => parseInt(n, 10)).filter((n) => !Number.isNaN(n));
        }
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.vistos)) {
            return (parsed.vistos as (number | string)[]).map((n: any) => Number(n)).filter((n: number) => !isNaN(n));
        }
    } catch {}
    return [];
};

export const useCoursePlayer = () => {
    const { id } = useParams();
    const courseId = id;
    
    // --- REFS ---
    const playerRef = useRef<any>(null);
    const progressStateRef = useRef<any>(null); 
    const isPlayingRef = useRef(false); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const lessonsRef = useRef<any[]>([]); 
    
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollmentId, setEnrollmentId] = useState<number | null>(null);
    
    // --- NUEVOS ESTADOS PARA INICIO EXACTO ---
    const [initialStartSeconds, setInitialStartSeconds] = useState(0);
    const [isReadyToPlay, setIsReadyToPlay] = useState(false); // Bandera para saber cuando ya cargó la posición
    
    const [progressState, setProgressState] = useState<{
        vistos: number[];
        lastPosition?: { videoIndex: number; seconds: number } | null;
    }>({ vistos: [], lastPosition: null });

    useEffect(() => {
        progressStateRef.current = progressState;
    }, [progressState]);

    const [progressPercentage, setProgressPercentage] = useState(0);
    const isCourseCompleted = lessons.length > 0 && progressState.vistos.length >= lessons.length;
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('descripcion');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isLoadingEnroll, setIsLoadingEnroll] = useState(false);

    // --- DETECTAR LOGOUT ---
    useEffect(() => {
        const syncAuthState = () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                setIsEnrolled(false);
                setEnrollmentId(null);
                // Bloquea el reproductor y limpia la referencia
                if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
                    try { playerRef.current.pauseVideo(); } catch(e){}
                }
                playerRef.current = null;
                setCurrentVideoIndex(0);
                setInitialStartSeconds(0);
                setIsReadyToPlay(true); // Listo para modo invitado
            }
        };
        window.addEventListener('auth:logout', syncAuthState);
        window.addEventListener('storage', syncAuthState);
        return () => {
            window.removeEventListener('auth:logout', syncAuthState);
            window.removeEventListener('storage', syncAuthState);
        };
    }, []);

    // --- SINCRONIZACIÓN VISUAL ---
    useEffect(() => {
        if (lessons.length > 0) {
            const vistosArr = progressState.vistos || [];
            setLessons(prev => prev.map((l, idx) => ({
                ...l,
                completed: vistosArr.includes(idx + 1)
            })));
            const pct = Math.round((vistosArr.length / lessons.length) * 100);
            setProgressPercentage(pct);
        }
    }, [progressState.vistos, lessons.length]);

    useEffect(() => {
        lessonsRef.current = lessons;
    }, [lessons]);

    // --- API UPDATE ---
    // Nuevo método para actualizar progreso usando PATCH y el endpoint actualizado
    const apiUpdateProgress = async (enrollId: number, payload: any) => {
        try {
            const { updateRegistrationProgress } = await import('../../services/pages/coursePlayerService');
            await updateRegistrationProgress(enrollId, payload);
        } catch (error) {
            // Error guardando progreso
        }
    };

    // --- HEARTBEAT (Guardado automático) ---
    useEffect(() => {
        if (!isEnrolled || !enrollmentId) return;

        const interval = setInterval(() => {
            if (!playerRef.current || !progressStateRef.current) return;

            const playerState = typeof playerRef.current.getPlayerState === 'function' 
                ? playerRef.current.getPlayerState() 
                : -1;
            
            const isPlayingActually = playerState === 1;

            if (isPlayingActually) {
                const currentTime = playerRef.current.getCurrentTime();
                if (typeof currentTime !== 'number' || currentTime < 1) return;

                const currentVistos = progressStateRef.current.vistos || [];
                const totalVideos = lessonsRef.current.length;
                const isComplete = currentVistos.length >= totalVideos && totalVideos > 0;

                apiUpdateProgress(enrollmentId, {
                    progress: JSON.stringify(currentVistos),
                    completed: isComplete ? 1 : 0,
                    last_position_seconds: JSON.stringify({ 
                        videoIndex: currentVideoIndex + 1, 
                        seconds: Math.floor(currentTime) 
                    }),
                    end_at: isComplete ? new Date().toISOString() : null
                });
            }
        }, 5000); 

        return () => clearInterval(interval);
    }, [isEnrolled, enrollmentId, currentVideoIndex]);

    // --- CARGA DE DATOS (AQUÍ ESTÁ LA LÓGICA CRÍTICA) ---
    const updateEnrollmentState = async (userId: string | null, lessonList: { videoId: string }[] = []) => {
        // Reseteamos bandera de listo para mostrar loading si es necesario
        setIsReadyToPlay(false);

        if (!userId || !courseId) {
            setIsEnrolled(false); setEnrollmentId(null);
            setInitialStartSeconds(0);
            setIsReadyToPlay(true); // Invitado listo
            return false;
        }
        try {
            const enrollments = await getEnrollments(userId);
            const enrollment = enrollments.find((e: any) =>
                String(e.curso_id ?? e.curso?.id) === String(courseId)
            );
            
            if (enrollment) {
                // Datos recibidos de la API
                const foundId = enrollment.id;
                setIsEnrolled(true);
                setEnrollmentId(foundId);
                
                const vistosArr = parseProgressArray(enrollment.progreso);
                let restoredLastPosition = null;
                
                if (enrollment.last_position_seconds) {
                    try {
                        const parsed = typeof enrollment.last_position_seconds === 'string'
                            ? JSON.parse(enrollment.last_position_seconds)
                            : enrollment.last_position_seconds;
                        
                        if (typeof parsed?.videoIndex === 'number') {
                            restoredLastPosition = {
                                videoIndex: Number(parsed.videoIndex),
                                seconds: Number(parsed.seconds) || 0
                            };
                        }
                    } catch (e) { /* Error parseando last_position */ }
                }
                
                setProgressState({ vistos: vistosArr, lastPosition: restoredLastPosition });
                
                // RESTAURACIÓN EXACTA
                if (restoredLastPosition?.videoIndex) {
                    const idx = restoredLastPosition.videoIndex - 1;
                    if (idx >= 0 && idx < lessonList.length) {
                        setCurrentVideoIndex(idx);
                        // GUARDAMOS EL SEGUNDO PARA QUE YOUTUBE LO USE EN 'start'
                        setInitialStartSeconds(restoredLastPosition.seconds);
                    } else {
                        setCurrentVideoIndex(0);
                        setInitialStartSeconds(0);
                    }
                } else {
                    const firstUnfinished = lessonList.findIndex((_, idx) => !vistosArr.includes(idx + 1));
                    if (firstUnfinished !== -1) setCurrentVideoIndex(firstUnfinished);
                    else setCurrentVideoIndex(0);
                    setInitialStartSeconds(0);
                }
                
                setIsReadyToPlay(true); // DATOS LISTOS: RENDERIZA EL PLAYER AHORA
                return true;
            } else {
                setInitialStartSeconds(0);
                setIsReadyToPlay(true); // Invitado listo
            }
        } catch (err) { setIsReadyToPlay(true); }
        
        setIsEnrolled(false);
        setEnrollmentId(null);
        return false;
    };

    // --- FETCH INICIAL ---
    useEffect(() => {
        if (!courseId) { setError('URL inválida'); setLoading(false); return; }

        const fetchData = async () => {
            setLoading(true);
            try {
                let initialLessons: any[] = [];
                let cData: any = null;
                try {
                    // Usar el nuevo servicio y endpoint para obtener el curso por ID
                    const cDataResp = await import('../../services/pages/coursePlayerService');
                    cData = await cDataResp.getCourseById(courseId);
                } catch {
                    cData = null;
                }
                if (!cData) throw new Error("Curso no encontrado");
                setCourse(cData);

                let vList: string[] = [];
                if (cData.playlist_id) vList = cData.playlist_id.split(',');
                else if (cData.video_url) vList = [cData.video_url.split('v=')[1]];

                const titles = await Promise.all(vList.map(async (vid) => {
                    try {
                        const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vid}&format=json`);
                        return r.ok ? (await r.json()).title : null;
                    } catch { return null; }
                }));

                initialLessons = vList.map((vid, i) => ({
                    id: i,
                    title: titles[i] || `Lección ${i+1}`,
                    completed: false,
                    locked: i > 0,
                    videoId: vid.trim()
                }));
                setLessons(initialLessons);
                lessonsRef.current = initialLessons;

                const userId = localStorage.getItem('userId');
                // Al cargar por primera vez, si hay usuario, esperamos a traer su posición
                if (userId) {
                    await updateEnrollmentState(userId, initialLessons);
                } else {
                    setIsReadyToPlay(true); // Si no hay usuario, listo de una vez
                }

            } catch (e: any) { setError(e.message || "Error"); } 
            finally { setLoading(false); }
        };
        fetchData();

        // --- LOGIN LISTENER ---
        const handleAuthLogin = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                await updateEnrollmentState(userId, lessonsRef.current);
            }
        };
        window.addEventListener('auth:login', handleAuthLogin);
        return () => window.removeEventListener('auth:login', handleAuthLogin);
    }, [courseId]);


    // --- MANEJO DE YOUTUBE ---
    const handleReady = (e: YouTubeEvent) => {
        playerRef.current = e.target;
        // Ya no necesitamos lógica compleja aquí porque el 'start' param lo hace solo.
        // Solo pausamos por seguridad si quieres que arranque pausado.
        // e.target.pauseVideo(); 
    };

    const handleStateChange = async (e: YouTubeEvent) => {
        const status = e.data;
        if (status === 1) isPlayingRef.current = true;
        else isPlayingRef.current = false;

        if (status === 2 && isEnrolled && enrollmentId) {
            const time = e.target.getCurrentTime();
            const duration = e.target.getDuration?.();
            const currentIndex = currentVideoIndex;
            
            const shouldComplete = duration > 0 ? time / duration >= 0.9 : false;
            const nextVistos = shouldComplete 
                ? Array.from(new Set([...progressState.vistos, currentIndex + 1]))
                : progressState.vistos;
            
            setProgressState({
                vistos: nextVistos,
                lastPosition: { videoIndex: currentIndex + 1, seconds: time }
            });
            
            await apiUpdateProgress(enrollmentId, {
                progress: JSON.stringify(nextVistos),
                completed: nextVistos.length >= lessons.length ? 1 : 0,
                last_position_seconds: JSON.stringify({ videoIndex: currentIndex + 1, seconds: Math.floor(time) }),
                end_at: nextVistos.length >= lessons.length ? new Date().toISOString() : null
            });
        }
    };

    const handleVideoEnd = async (_event?: any) => {
        if (!isEnrolled || !enrollmentId) return;
        isPlayingRef.current = false; 

        const currentIndex = currentVideoIndex;
        const newVistos = Array.from(new Set([...progressState.vistos, currentIndex + 1]));
        const isComplete = newVistos.length >= lessons.length;
        
        setProgressState({
            vistos: newVistos,
            lastPosition: { videoIndex: currentIndex + 1, seconds: 0 }
        });
        
        setLessons(prev => prev.map((l, idx) => ({
            ...l,
            completed: newVistos.includes(idx + 1)
        })));

        if (currentVideoIndex < lessons.length - 1) {
             setCurrentVideoIndex(prev => prev + 1);
             setInitialStartSeconds(0); // Siguiente video empieza en 0
        }

        await apiUpdateProgress(enrollmentId, {
            progress: JSON.stringify(newVistos),
            completed: isComplete ? 1 : 0,
            last_position_seconds: JSON.stringify({ videoIndex: currentIndex + 1, seconds: 0 }),
            end_at: isComplete ? new Date().toISOString() : null
        });
    };

    const handleVideoClick = (index: number) => {
        if (!isEnrolled && index > 0) return;
        // Guardar progreso del anterior si es necesario...
        if (playerRef.current && isEnrolled && enrollmentId) {
             // ... lógica opcional de guardado al salir
        }
        setCurrentVideoIndex(index);
        setInitialStartSeconds(0); // IMPORTANTE: Reseteamos a 0 si el usuario cambia manualmente
    };

    // ... (Handlers de Enroll, Modales, etc. sin cambios) ...
    const handleEnrollClick = () => {
        const userId = localStorage.getItem('userId');
        if (userId) setShowConfirmModal(true);
        else setShowLoginModal(true);
    };

    const confirmEnrollment = async () => {
        console.log('Click en confirmar inscripción');
        setIsLoadingEnroll(true);
        const userId = localStorage.getItem('userId');
        console.log('userId:', userId, 'course?.id:', course?.id);
        if (userId && course?.id) {
            try {
                const { data } = await api.post('/api/v1/registrations/', {
                    student_id: Number(userId),
                    course_id: Number(course.id),
                    progress: 'pendiente',
                    completed: 0,
                    last_position_seconds: '0',
                    end_at: null
                });
                console.log('Respuesta inscripción:', data);
                if (data) {
                     await updateEnrollmentState(userId, lessonsRef.current);
                     setShowConfirmModal(false);
                }
            } catch (error) {
                console.error('Error al procesar inscripción:', error);
                alert("Error al procesar inscripción");
            }
        }
        setIsLoadingEnroll(false);
    };

    const handleLoginSuccess = async () => {
        setShowLoginModal(false);
        const userId = localStorage.getItem('userId');
        const enrolled = await updateEnrollmentState(userId, lessonsRef.current);
        if (!enrolled) setTimeout(() => setShowConfirmModal(true), 200);
    };
    
    const toggleLessonComplete = async (videoIndex: number, isChecked: boolean) => {
        if (!isEnrolled || !enrollmentId) return;
        const num = videoIndex + 1;
        const nextVistos = isChecked
            ? Array.from(new Set([...progressState.vistos, num]))
            : progressState.vistos.filter((n) => n !== num);
        
        const nextProgress = { ...progressState, vistos: nextVistos };
        setProgressState(nextProgress);

        const time = playerRef.current ? playerRef.current.getCurrentTime() : 0;
        
        await apiUpdateProgress(enrollmentId, {
            progress: JSON.stringify(nextVistos),
            completed: nextVistos.length >= lessons.length ? 1 : 0,
            last_position_seconds: JSON.stringify({ videoIndex: currentVideoIndex + 1, seconds: Math.floor(time) }),
            end_at: nextVistos.length >= lessons.length ? new Date().toISOString() : null
        });
    };

    return {
        loading, error, course, lessons, isEnrolled, 
        currentVideoIndex, setCurrentVideoIndex,
        currentLesson: lessons[currentVideoIndex], 
        isLocked: !isEnrolled,
        activeTab, setActiveTab,
        handleVideoClick, handleEnrollClick, 
        showLoginModal, setShowLoginModal, handleLoginSuccess,
        showConfirmModal, setShowConfirmModal, confirmEnrollment, isLoadingEnroll,
        handleVideoEnd, handleStateChange, handleReady, progressPercentage,
        toggleLessonComplete, isCourseCompleted,
        initialStartSeconds,
        isReadyToPlay 
    };
};