import { useEffect, useRef, useState } from 'react';
import {
    Lock, Download, ChevronRight,
    Users, Star, Unlock, BookOpen, Loader2, Trophy, Sparkles, Play, Target, CheckCircle2, Info
} from 'lucide-react';
import { useCoursePlayer } from '../hooks/pages/useCoursePlayer';
import LoginModal from '../components/auth/LoginModal';
declare global {
    interface Window {
        YT?: any;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const CoursePlayer = () => {
    const playerRef = useRef<HTMLDivElement>(null);
    const ytContainerRef = useRef<HTMLDivElement>(null);
    const ytPlayerRef = useRef<any>(null);

    const [playlistHeight, setPlaylistHeight] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [isDownloadingCert, setIsDownloadingCert] = useState(false);

    // Desestructuración del hook personalizado
    const {
        loading, error,
        course, lessons,
        isEnrolled, currentVideoIndex, currentLesson, isLocked,
        activeTab, setActiveTab,
        handleVideoClick,
        showLoginModal, setShowLoginModal, handleLoginSuccess,
        showConfirmModal, setShowConfirmModal, confirmEnrollment, isLoadingEnroll,
        handleVideoEnd,
        handleStateChange,
        handleReady,
        progressPercentage,
        toggleLessonComplete,
        isCourseCompleted,
        initialStartSeconds,
        isReadyToPlay
    } = useCoursePlayer();

    // Refs para evitar "stale closures" en los eventos de YouTube
    const handleVideoEndRef = useRef(handleVideoEnd);
    const handleStateChangeRef = useRef(handleStateChange);
    const handleReadyRef = useRef(handleReady);


    // Sincronizar refs con las funciones del hook
    useEffect(() => {
        handleVideoEndRef.current = handleVideoEnd;
        handleStateChangeRef.current = handleStateChange;
        handleReadyRef.current = handleReady;
    }, [handleVideoEnd, handleStateChange, handleReady]);

  // Scroll automático en la playlist hacia el video activo
    useEffect(() => {
        if (isReadyToPlay && currentVideoIndex !== null && lessons.length > 0) {
            const timeoutId = setTimeout(() => {
                const activeItem = document.getElementById(`lesson-item-${currentVideoIndex}`);
                if (activeItem) {
                    // Detectamos si el video actual es uno de los últimos dos
                    const isLastTwoVideos = currentVideoIndex >= lessons.length - 2;
                    
                    activeItem.scrollIntoView({ 
                        behavior: 'smooth', 
                        // Si son los últimos 2, usa 'nearest' (no mueve la página). Si no, usa 'center'.
                        block: isLastTwoVideos ? 'nearest' : 'center' 
                    });
                }
            }, 300); 

            return () => clearTimeout(timeoutId);
        }
    }, [currentVideoIndex, isReadyToPlay, lessons.length]); // Agregamos lessons.length aquí

    // Listener para eventos de autenticación
    useEffect(() => {
        const syncAuthState = () => {
            setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        };

        window.addEventListener('auth:login', syncAuthState as EventListener);
        window.addEventListener('auth:logout', syncAuthState as EventListener);
        window.addEventListener('storage', syncAuthState);

        return () => {
            window.removeEventListener('auth:login', syncAuthState as EventListener);
            window.removeEventListener('auth:logout', syncAuthState as EventListener);
            window.removeEventListener('storage', syncAuthState);
        };
    }, []);

    // Carga de la API de YouTube
    const ensureYouTubeApiReady = () => {
        return new Promise<any>((resolve) => {
            if (window.YT && window.YT.Player) {
                resolve(window.YT);
                return;
            }
            const existing = document.getElementById('youtube-iframe-api');
            if (existing) {
                const previous = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = () => {
                    if (previous) previous();
                    resolve(window.YT);
                };
                return;
            }
            const tag = document.createElement('script');
            tag.id = 'youtube-iframe-api';
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            window.onYouTubeIframeAPIReady = () => resolve(window.YT);
        });
    };

    // Inicialización y control del reproductor
    useEffect(() => {
        if (isLocked) {
            if (ytPlayerRef.current) {
                try {
                    ytPlayerRef.current.destroy(); 
                } catch (e) { }
                ytPlayerRef.current = null; // Limpiamos la referencia para que nazca limpio si se vuelve a logear
            }
            return;
        }

        if (!currentLesson || !isReadyToPlay) return;

        let cancelled = false;

        const initPlayer = async () => {
            const YT = await ensureYouTubeApiReady();
            if (cancelled || !ytContainerRef.current) return;

            const onPlayerStateChange = (event: any) => {
                const state = event.data;
                if (state === YT.PlayerState.ENDED) {
                    handleVideoEndRef.current(event);
                } else if (state === YT.PlayerState.PAUSED) {
                    handleStateChangeRef.current(event);
                }
            };

            const onPlayerReady = (event: any) => {
                ytPlayerRef.current = event.target;
                handleReadyRef.current(event);
                // Pausar el video al cargar (no autoplay)
                try {
                    if (typeof event.target.pauseVideo === 'function') {
                        event.target.pauseVideo();
                    }
                } catch (e) { }
            };

            if (!ytPlayerRef.current) {
                ytPlayerRef.current = new YT.Player(ytContainerRef.current, {
                    videoId: currentLesson.videoId,
                    playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        origin: window.location.origin,
                        start: initialStartSeconds || 0
                    },
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    }
                });
            } else {
                if (typeof ytPlayerRef.current?.loadVideoById === 'function') {
                    ytPlayerRef.current.loadVideoById({
                        videoId: currentLesson.videoId,
                        startSeconds: initialStartSeconds || 0
                    });
                } else if (typeof ytPlayerRef.current?.cueVideoById === 'function') {
                    ytPlayerRef.current.cueVideoById({
                        videoId: currentLesson.videoId,
                        startSeconds: initialStartSeconds || 0
                    });
                }
            }
        };

        void initPlayer();

        return () => {
            cancelled = true;
        };
    }, [isLocked, currentLesson?.videoId, initialStartSeconds, isReadyToPlay]); // Dependencias clave

    // Cleanup del reproductor al desmontar
    useEffect(() => {
        return () => {
            if (ytPlayerRef.current?.destroy) {
                try {
                    ytPlayerRef.current.destroy();
                } catch (e) {
                    // Ignorar errores de limpieza si la API no está lista
                }
            }
        };
    }, []);

    // Scroll suave al hacer click en un video
    const handleVideoClickWithScroll = (index: number) => {
        handleVideoClick(index);
        if (playerRef.current) {
            const rect = playerRef.current.getBoundingClientRect();
            const offset = 140;
            window.scrollTo({
                top: window.scrollY + rect.top - offset,
                behavior: 'smooth'
            });
        }
    };

    const handleEnrollClickLocal = () => {
        if (isLoggedIn) setShowConfirmModal(true);
        else setShowLoginModal(true);
    };

    const sanitizeFileName = (value: string) => {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 50);
    };

    // Lógica de descarga de certificado
    const handleDownloadCertificate = async () => {
        if (!course || isDownloadingCert) return;
        if (!isEnrolled) return;

        setIsDownloadingCert(true);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            // 1. OBTENER INSCRIPCIONES (nuevo endpoint)
            const token = localStorage.getItem('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const enrollments = await import('../services/pages/certificatesService').then(m => m.getUserEnrollments(userId, headers));
            const enrollment = (Array.isArray(enrollments) ? enrollments : []).find((e: any) => String(e.curso_id ?? e.curso?.id) === String(course.id));
            if (!enrollment || Number(enrollment.completado) !== 1) {
                setIsDownloadingCert(false);
                return;
            }

            const enrollmentId = enrollment.id;
            let certData = null;

            // 2. BUSCAR O GENERAR CERTIFICADO (nuevo endpoint)
            try {
                certData = await import('../services/pages/certificatesService').then(m => m.getCertificateByEnrollment(enrollmentId, headers));
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    certData = await import('../services/pages/certificatesService').then(m => m.generateCertificate(enrollmentId, headers));
                } else {
                    setIsDownloadingCert(false);
                    throw error;
                }
            }

            const certId = certData?.id ?? certData?.certificado_id;
            if (!certId) throw new Error("No se pudo obtener el ID del certificado");

            // 3. DESCARGAR EL PDF (nuevo endpoint)
            const blob = await import('../services/pages/certificatesService').then(m => m.downloadCertificate(certId, headers));
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Diploma_VirtualPlus_${sanitizeFileName(course.titulo || course.nombre || 'curso')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            // Error al descargar certificado
        } finally {
            setIsDownloadingCert(false);
        }
    };

    // Ajuste de altura de la playlist
    useEffect(() => {
        const updateHeight = () => {
            if (window.innerWidth < 1024) {
                setPlaylistHeight(null);
                return;
            }
            if (playerRef.current) {
                const { height } = playerRef.current.getBoundingClientRect();
                setPlaylistHeight(height);
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [loading, currentLesson]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#04070f] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-cyan-500" size={48} />
                    <p className="text-gray-400">Cargando curso...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-[#04070f] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl text-red-500 font-bold mb-2">Error</h2>
                    <p className="text-gray-400">{error || "Curso no encontrado"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#04070f] min-h-screen flex flex-col font-sans text-gray-300 selection:bg-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <main className="relative z-10 flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* IZQUIERDA: PLAYER + INFO */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* REPRODUCTOR */}
                        <div ref={playerRef} className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] group">
                            <div className="w-full h-full">
                                <div ref={ytContainerRef} className="w-full h-full" />
                            </div>

                            {isLocked && (
                                <>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center blur-sm scale-105 opacity-40 transition-transform duration-1000"
                                        style={{ backgroundImage: `url(${course.imagen || course.img || course.imagen_url || ''})` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-transparent"></div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                            <Lock size={32} className="text-cyan-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Contenido Exclusivo</h2>
                                        <p className="text-gray-400 mb-8 max-w-md text-sm">
                                            Inscríbete gratis para acceder a todas las lecciones y obtener tu certificado.
                                        </p>
                                        <button
                                            onClick={handleEnrollClickLocal}
                                            className="group relative px-10 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] flex items-center gap-3 border border-white/10"
                                        >
                                            <Unlock size={20} />
                                            <span className="text-lg">Inscribirse Ahora</span>
                                            <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {!isLocked && !currentLesson && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                    Selecciona una lección
                                </div>
                            )}
                        </div>

                        {/* INFO */}
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{course.nombre}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                                <span className="flex items-center gap-1 text-cyan-400">
                                    <Users size={16} /> {typeof course.autor === 'object' ? (course.autor?.username || course.autor?.nombre || 'Autor') : (course.autor || course.instructor || 'Autor')}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" /> {course.puntuacion || '4.8'}</span>
                            </div>

                            {/* TABS */}
                            <div className="border-b border-white/10 flex gap-6 mb-6">
                                {['descripcion', 'progreso'].map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-cyan-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[200px] text-gray-400 leading-relaxed">
                                {activeTab === 'descripcion' && (
                                    <div className="animate-in fade-in space-y-6">
                                        {/* 1. INFO DE LA LECCIÓN ACTUAL (SOLO SI ESTÁ ENROLADO/LOGUEADO) */}
                                        {isEnrolled && currentLesson && (
                                            <div className="bg-gradient-to-r from-cyan-900/10 to-transparent border-l-4 border-cyan-500 p-5 md:p-6 rounded-r-2xl">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="bg-cyan-500/20 p-2 rounded-lg mt-1">
                                                        <Play size={18} className="text-cyan-400 fill-cyan-400" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 block">
                                                            Reproduciendo ahora
                                                        </span>
                                                        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                                                            {currentLesson.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                        {/* 2. INFO GENERAL DEL CURSO (VISIBLE PARA TODOS) */}
                                        <div className={`${isEnrolled ? 'pt-4 border-t border-white/5' : ''}`}>
                                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                                <Info size={18} className="text-purple-400" />
                                                Acerca de este curso
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed text-sm md:text-base text-justify">
                                                {course.descripcion}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'progreso' && (
                                    <div className="animate-in fade-in">
                                        {isEnrolled ? (
                                            <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0c101a] to-[#04070f] rounded-2xl border border-cyan-500/20 relative overflow-hidden shadow-[0_0_40px_-15px_rgba(6,182,212,0.15)] group hover:border-cyan-500/40 transition-all duration-500">
                                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none"></div>

                                                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-white/5 pb-6">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Target size={20} className="text-cyan-400" />
                                                            <h3 className="text-white font-bold text-xl tracking-tight">Tu Progreso</h3>
                                                        </div>
                                                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                                                            <CheckCircle2 size={16} className={progressPercentage === 100 ? 'text-green-400' : 'text-gray-500'} />
                                                            <span>Has completado <strong className="text-gray-200">{lessons.filter((l: any) => l.completed).length}</strong> de <strong className="text-gray-200">{lessons.length}</strong> lecciones</span>
                                                        </p>
                                                    </div>
                                                    <div className="flex items-baseline gap-1 bg-black/40 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                                                        <span className={`text-4xl md:text-5xl font-black tracking-tighter transition-colors duration-500 drop-shadow-lg ${progressPercentage === 100 ? 'text-green-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'}`}>
                                                            {progressPercentage}
                                                        </span>
                                                        <span className={`text-xl font-bold ${progressPercentage === 100 ? 'text-green-500/70' : 'text-cyan-500/70'}`}>%</span>
                                                    </div>
                                                </div>

                                                <div className="h-4 rounded-full bg-black/80 shadow-inner overflow-hidden relative z-10 border border-white/10 p-0.5 mb-2">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out relative ${progressPercentage === 100 ? 'bg-gradient-to-r from-cyan-500 to-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                                                        style={{ width: `${progressPercentage}%` }}
                                                    >
                                                        {progressPercentage > 0 && progressPercentage < 100 && (
                                                            <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shine_2s_infinite_ease-in-out]"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-8 bg-[#0a0c10] rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[250px]">
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-0"></div>
                                                <div className="bg-white/5 p-4 rounded-full mb-4 z-10 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                                    <Lock size={32} className="text-gray-500" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2 z-10 tracking-tight">Progreso Bloqueado</h3>
                                                <p className="text-gray-400 text-sm max-w-sm z-10 leading-relaxed">
                                                    Inscríbete para registrar tu progreso y desbloquear el certificado.
                                                </p>
                                            </div>
                                        )}

                                        {/* Tu botón de descarga/compra que ya tenías abajo va aquí... */}
                                        <div className="mt-8">
                                            {isEnrolled && progressPercentage >= 100 ? (
                                                <div className="relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-50 animate-pulse rounded-full"></div>

                                                    <div className="relative z-10 flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                                        <div className="mb-4 relative">
                                                            <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
                                                            <Trophy size={48} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                                            <Sparkles size={24} className="text-cyan-300 absolute -top-2 -right-2 animate-bounce" />
                                                        </div>

                                                        <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white mb-2">
                                                            ¡Felicidades!
                                                        </h4>
                                                        <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                                                            Has completado todo el contenido. Ya puedes obtener tu certificado oficial.
                                                        </p>

                                                        <button
                                                            onClick={handleDownloadCertificate}
                                                            disabled={isDownloadingCert}
                                                            className="group relative px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 flex items-center gap-3 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                                                            {isDownloadingCert ? (
                                                                <Loader2 size={20} className="animate-spin" />
                                                            ) : (
                                                                <Download size={20} className="group-hover:animate-bounce" />
                                                            )}
                                                            <span>{isDownloadingCert ? 'Descargando...' : 'Descargar Certificado'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DERECHA: PLAYLIST */}
                    <div className="lg:col-span-1">
                        <div
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl sticky top-24 overflow-hidden flex flex-col shadow-2xl"
                            style={playlistHeight ? { height: `${playlistHeight}px` } : undefined}
                        >
                            <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center z-10">
                                <h3 className="font-bold text-white">Contenido</h3>
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">{lessons.length} lecciones</span>
                            </div>

                            <div className="overflow-y-auto p-2 space-y-3 custom-scrollbar scrollbar-hide scroll-smooth">
                                {lessons.length > 0 ? lessons.map((lesson: any, index: number) => {
                                    const isActive = currentVideoIndex === index;
                                    // El candado debe mostrarse si el usuario no está inscrito
                                    const isLockedItem = !isEnrolled;
                                    const isCheckboxDisabled = isLockedItem || isCourseCompleted;

                                    return (
                                        <button
                                            key={lesson.id}
                                            id={`lesson-item-${index}`}
                                            onClick={() => !isLockedItem && handleVideoClickWithScroll(index)}
                                            disabled={isLockedItem}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group relative overflow-hidden
                                            ${isActive ? 'bg-gradient-to-r from-cyan-900/40 to-white/5 border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]' : 'hover:bg-white/5 border border-transparent opacity-80 hover:opacity-100'} 
                                            ${isLockedItem ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : ''}`}
                                        >
                                            {/* 1. Número de lección */}
                                            <span className={`text-xs font-bold w-4 text-center ${isActive ? 'text-cyan-400' : 'text-gray-600'}`}>
                                                {index + 1}
                                            </span>

                                            {/* 2. Miniatura de YouTube */}
                                            <div className="relative w-24 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-black/50 border border-white/5 shadow-md">
                                                {lesson.videoId ? (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`}
                                                        alt={lesson.title}
                                                        className={`w-full h-full object-cover transition-all duration-500 ${isActive ? 'scale-110 opacity-100' : 'opacity-70 group-hover:scale-105 group-hover:opacity-100'}`}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                        <Play size={16} className="text-gray-600" />
                                                    </div>
                                                )}
                                                {/* Capa superpuesta sobre la imagen (Candado o Play) */}
                                                <div className={`absolute inset-0 flex items-center justify-center transition-colors ${isActive ? 'bg-cyan-900/30' : 'bg-black/20'}`}>
                                                    {isLockedItem && (
                                                        <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm">
                                                            <Lock size={12} className="text-white" />
                                                        </div>
                                                    )}
                                                    {isActive && !isLockedItem && (
                                                        <div className="bg-cyan-500 p-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse">
                                                            <Play size={12} className="text-white fill-white ml-0.5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 3. Título del video */}
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className={`text-sm font-medium line-clamp-2 leading-tight transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                    {lesson.title}
                                                </p>
                                            </div>

                                            {/* 4. Checkbox a la derecha */}
                                            {!isLockedItem && (
                                                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        className={`h-5 w-5 rounded-full border-2 border-gray-600 bg-[#0a0a0a] appearance-none cursor-pointer transition-all duration-300 checked:bg-cyan-500 checked:border-cyan-400 checked:shadow-[0_0_15px_rgba(6,182,212,0.4)] ${isActive ? 'ring-2 ring-cyan-500/20 ring-offset-2 ring-offset-[#0a0a0a]' : 'hover:border-gray-400'}`}
                                                        checked={lesson.completed}
                                                        disabled={isCheckboxDisabled}
                                                        onChange={(e) => {
                                                            // Si el curso está completado, no permitir cambios
                                                            if (isCourseCompleted) return;
                                                            toggleLessonComplete(index, e.target.checked);
                                                            if (e.target.checked && index < lessons.length - 1) {
                                                                handleVideoClickWithScroll(index + 1);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </button>
                                    );
                                }) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">No hay videos disponibles.</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Y agrega tu nuevo LoginModal usando el estado que ya tienes: */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setShowLoginModal(false)}
                onSwitchToForgot={() => setShowLoginModal(false)}
            />

            {showConfirmModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    {/* Backdrop: Misma oscuridad y desenfoque que el anterior */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowConfirmModal(false)}
                    />

                    {/* Modal Card */}
                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">

                        {/* Luz superior Cyan (Indica acción positiva/informativa) */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                        <div className="p-6 relative z-10">
                            {/* Icono con Glow Cyan */}
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                                <BookOpen size={26} className="text-cyan-400" />
                            </div>

                            {/* Textos */}
                            <div className="text-center mb-6 space-y-2">
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    ¿Confirmar inscripción?
                                </h2>
                                <p className="text-sm text-gray-400 leading-relaxed text-balance">
                                    Te vas a inscribir en el curso: <br />
                                    <span className="text-cyan-400 font-medium">"{course.titulo || course.nombre}"</span>
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex items-center justify-center py-2.5 rounded-xl bg-white/5 border border-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all active:scale-95"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={confirmEnrollment}
                                    disabled={isLoadingEnroll}
                                    className="flex items-center justify-center py-2.5 rounded-xl bg-cyan-600 border border-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all active:scale-95 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isLoadingEnroll ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        'Confirmar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes shine {
                    0% { transform: translateX(-150%) skewX(-12deg); }
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
                .animate-shine { animation: shine 1.2s ease-out; }
            `}</style>

        </div>
    );
};

export default CoursePlayer;