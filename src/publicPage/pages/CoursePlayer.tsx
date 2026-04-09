import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Lock, Download,
    Users, Unlock, BookOpen, Loader2, Trophy, Sparkles, Play, Target, CheckCircle2, Info,AlertCircle
} from 'lucide-react';
import { useCoursePlayer } from '../hooks/pages/useCoursePlayer';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
declare global {
    interface Window {
        YT?: any;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const CoursePlayer = () => {
    const navigate = useNavigate();
    const playerRef = useRef<HTMLDivElement>(null);
    const ytContainerRef = useRef<HTMLDivElement>(null);
    const ytPlayerRef = useRef<any>(null);

    const [playlistHeight, setPlaylistHeight] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [isDownloadingCert, setIsDownloadingCert] = useState(false);

    const {
        loading, error,
        course, lessons,
        isEnrolled, currentVideoIndex, currentLesson, isLocked,
        activeTab, setActiveTab,
        handleVideoClick,
        showAuthModal, setShowAuthModal, authView, setAuthView, handleLoginSuccess,
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

    const handleVideoEndRef = useRef(handleVideoEnd);
    const handleStateChangeRef = useRef(handleStateChange);
    const handleReadyRef = useRef(handleReady);


    useEffect(() => {
        handleVideoEndRef.current = handleVideoEnd;
        handleStateChangeRef.current = handleStateChange;
        handleReadyRef.current = handleReady;
    }, [handleVideoEnd, handleStateChange, handleReady]);

    useEffect(() => {
        if (isReadyToPlay && currentVideoIndex !== null && lessons.length > 0) {
            const timeoutId = setTimeout(() => {
                const activeItem = document.getElementById(`lesson-item-${currentVideoIndex}`);
                const playlistContainer = document.querySelector('.custom-scrollbar');

                if (activeItem && playlistContainer) {
                    const container = playlistContainer as HTMLElement;
                    const item = activeItem as HTMLElement;
                    const offset = item.offsetTop - container.offsetTop - (container.clientHeight / 2) + (item.clientHeight / 2);

                    container.scrollTo({
                        top: offset,
                        behavior: 'smooth',
                    });
                }
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [currentVideoIndex, isReadyToPlay, lessons.length]);

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
                }
            }
        };
    }, []);

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
        else {
            setAuthView('login');
            setShowAuthModal(true);
        }
    };

    const sanitizeFileName = (value: string) => {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 50);
    };

    const handleDownloadCertificate = async () => {
        // Agrupamos las validaciones iniciales para salir rápido si no cumple
        if (!course || isDownloadingCert || !isEnrolled) return;

        setIsDownloadingCert(true);

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const token = localStorage.getItem('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const certificatesService = await import('../services/pages/certificatesService');
            const enrollments = await certificatesService.getUserEnrollments(userId, headers);
            const enrollment = (Array.isArray(enrollments) ? enrollments : []).find(
                (e: any) => String(e.curso_id ?? e.curso?.id) === String(course.id)
            );

            if (!enrollment || Number(enrollment.completado) !== 1) return;

            const enrollmentId = enrollment.id;
            let certData = null;

            try {
                certData = await certificatesService.getCertificateByEnrollment(enrollmentId, headers);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    certData = await certificatesService.generateCertificate(enrollmentId, headers);
                } else {
                    throw error;
                }
            }

            const certId = certData?.id ?? certData?.certificado_id;
            if (!certId) throw new Error("No se pudo obtener el ID del certificado");

            const blob = await certificatesService.downloadCertificate(certId, headers);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `Diploma_VirtualPlus_${sanitizeFileName(course.titulo || course.nombre || 'curso')}.pdf`;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error("Error al descargar certificado:", err);
        } finally {
            setIsDownloadingCert(false);
        }
    };

    useEffect(() => {
        if (!playerRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            if (playerRef.current) {
                const { height } = playerRef.current.getBoundingClientRect();
                setPlaylistHeight(height);
            }
        });

        resizeObserver.observe(playerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
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
    const handleGoToCourses = () => {
        if (window.location.pathname === '/') {
            const target = document.getElementById('course-grid');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }
        navigate('/#course-grid');
    };
    return (
        <div className="min-h-screen bg-[#04070f] flex items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02] max-w-2xl w-full">
                <div className="w-24 h-24 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
                    <AlertCircle size={40} className="text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                    {error ? "Algo salió mal" : "Curso no encontrado"}
                </h3>
                <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                    {error || "El curso al que intentas acceder no existe, ha sido eliminado o se encuentra deshabilitado temporalmente."}
                </p>
                <button
                    type="button"
                    onClick={handleGoToCourses}
                    className="px-8 py-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black font-bold rounded-xl border border-cyan-500/20 hover:border-cyan-500 transition-all flex items-center gap-2"
                >
                    Explorar Cursos
                </button>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/*REPRODUCTOR */}
                    <div className="lg:col-span-2 lg:col-start-1">
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

                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center animate-in fade-in zoom-in duration-300 px-6 sm:px-10 py-6 lg:py-9">
                                        <div className="flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.05)] z-10 mb-4 w-10 h-10 lg:w-16 lg:h-16 rounded-full">
                                            <Lock className="w-[18px] h-[18px] lg:w-8 lg:h-8 text-cyan-400" />
                                        </div>
                                        <h2 className="font-bold text-white mb-2 text-[15px] lg:text-[28px] leading-tight">
                                            Contenido Exclusivo
                                        </h2>
                                        <p className="text-gray-400 max-w-md mx-auto mb-[11px] lg:mb-8 text-[11.5px] lg:text-base leading-snug">
                                            Inscríbete gratis para acceder a todas las lecciones y obtener tu certificado.
                                        </p>
                                        <button
                                            onClick={handleEnrollClickLocal}
                                            className="group relative bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_18px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02] flex items-center border border-white/10 px-4 py-[7px] lg:px-10 lg:py-4 text-[13px] lg:text-[18px] gap-1.5 lg:gap-3"
                                        >
                                            <Unlock className="w-[15px] h-[15px] lg:w-[22px] lg:h-[22px]" />
                                            <span>Inscribirse</span>
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
                    </div>

                    {/*PLAYLIST  */}
                    <div className="lg:col-span-1 lg:col-start-3 lg:row-span-2">
                        <div
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl sticky top-24 overflow-hidden flex flex-col shadow-2xl h-[420px] lg:max-h-none lg:h-[var(--playlist-height,auto)]"
                            style={{
                                '--playlist-height': playlistHeight ? `${playlistHeight}px` : undefined,
                            } as React.CSSProperties}
                        >
                            <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center z-10">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white">Contenido del Curso</h3>
                                </div>

                                {/* Un simple contador tipo pastilla (Pill) súper limpio */}
                                <div className="flex items-center gap-1.5 text-xs font-medium bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300">
                                    <span>{lessons.length} Lecciones</span>
                                </div>
                            </div>

                            <div className="overflow-y-auto p-2 space-y-3 custom-scrollbar scrollbar-hide scroll-smooth max-h-[340px] lg:max-h-none">
                                {lessons.length > 0 ? lessons.map((lesson: any, index: number) => {
                                    const isActive = currentVideoIndex === index;
                                    const isLockedItem = !isEnrolled;
                                    const isCheckboxDisabled = isLockedItem || isCourseCompleted || !isActive;

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
                                            <span className={`text-xs font-bold w-4 text-center ${isActive ? 'text-cyan-400' : 'text-gray-600'}`}>
                                                {index + 1}
                                            </span>

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
                                                <div className={`absolute inset-0 flex items-center justify-center transition-colors ${isActive ? 'bg-cyan-900/30' : 'bg-black/20'}`}>
                                                    {isLockedItem && (
                                                        <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm">
                                                            <Lock size={12} className="text-white" />
                                                        </div>
                                                    )}
                                                    {isActive && !isLockedItem && (
                                                        <div className="bg-cyan-500 p-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                                                            <Play size={12} className="text-white fill-white ml-0.5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className={`text-sm font-medium line-clamp-2 leading-tight transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                    {lesson.title}
                                                </p>
                                            </div>

                                            {!isLockedItem && (
                                                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        className={`h-5 w-5 rounded-full border-2 border-gray-600 bg-[#0a0a0a] appearance-none cursor-pointer transition-all duration-300 checked:bg-cyan-500 checked:border-cyan-400 checked:shadow-[0_0_15px_rgba(6,182,212,0.4)] ${isActive ? 'ring-2 ring-cyan-500/20 ring-offset-2 ring-offset-[#0a0a0a]' : 'hover:border-gray-400'}`}
                                                        checked={lesson.completed}
                                                        disabled={isCheckboxDisabled}
                                                        onChange={(e) => {
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

                    {/*INFO DEL CURSO */}
                    <div className="lg:col-span-2 lg:col-start-1">

                        <h1 className="font-bold text-white mb-2 text-base lg:text-xl">
                            {course.titulo || course.nombre || "Título no disponible"}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                            <span className="flex items-center gap-1 text-cyan-400">
                                <Users size={16} /> {typeof course.autor === 'object' ? (course.autor?.username || course.autor?.nombre || 'Autor') : (course.autor || course.instructor || 'Autor')}
                            </span>
                        </div>

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
                                                    <h3 className="font-bold text-white leading-tight text-[15px] lg:text-2xl">
                                                        {currentLesson.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className={`${isEnrolled ? 'pt-4 border-t border-white/5' : ''}`}>
                                        <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-[14px] lg:text-lg">
                                            <Info size={18} className="text-purple-400" />
                                            Acerca de este curso
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed text-justify text-[12px] lg:text-base">
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
                                                        <h3 className="font-bold text-white tracking-tight text-[15px] lg:text-xl">
                                                            Tu Progreso
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-gray-400 flex items-center gap-1.5">
                                                        <CheckCircle2 size={16} className={progressPercentage === 100 ? 'text-green-400' : 'text-gray-500'} />
                                                        <span>Has completado <strong className="text-gray-200">{lessons.filter((l: any) => l.completed).length}</strong> de <strong className="text-gray-200">{lessons.length}</strong> lecciones</span>
                                                    </p>
                                                </div>
                                                <div className="hidden sm:flex items-baseline gap-1 bg-black/40 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                                                    <span className={`text-4xl md:text-5xl font-black tracking-tighter transition-colors duration-500 drop-shadow-lg ${progressPercentage === 100 ? 'text-green-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'}`}>
                                                        {progressPercentage}
                                                    </span>
                                                    <span className={`text-xl font-bold ${progressPercentage === 100 ? 'text-green-500/70' : 'text-cyan-500/70'}`}>%</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="h-4 flex-1 rounded-full bg-black/80 shadow-inner overflow-hidden relative z-10 border border-white/10 p-0.5 mb-2">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out relative ${progressPercentage === 100 ? 'bg-gradient-to-r from-cyan-500 to-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                                                        style={{ width: `${progressPercentage}%` }}
                                                    >
                                                        {progressPercentage > 0 && progressPercentage < 100 && (
                                                            <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shine_2s_infinite_ease-in-out]"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex sm:hidden items-baseline gap-1 ml-3 mb-2">
                                                    <span className={`text-2xl font-black tracking-tighter transition-colors duration-500 drop-shadow-lg ${progressPercentage === 100 ? 'text-green-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'}`}>
                                                        {progressPercentage}
                                                    </span>
                                                    <span className={`text-base font-bold ${progressPercentage === 100 ? 'text-green-500/70' : 'text-cyan-500/70'}`}>%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-[#0a0c10] rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[250px]">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-0"></div>
                                            <div className="bg-white/5 p-4 rounded-full mb-4 z-10 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                                <Lock size={32} className="text-gray-500" />
                                            </div>
                                            <h3 className="font-bold text-white mb-2 z-10 tracking-tight text-[15px] lg:text-xl">
                                                Progreso Bloqueado
                                            </h3>
                                            <p className="text-gray-400 max-w-sm z-10 leading-relaxed text-[12px] lg:text-sm">
                                                Inscríbete para registrar tu progreso y desbloquear el certificado.
                                            </p>
                                        </div>
                                    )}

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
            </main>


            <LoginModal
                isOpen={showAuthModal && authView === 'login'}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setAuthView('register')}
                onSwitchToForgot={() => setAuthView('forgot')}
            />
            <RegisterModal
                isOpen={showAuthModal && authView === 'register'}
                onClose={() => setShowAuthModal(false)}
                onSwitchToLogin={() => setAuthView('login')}
            />
            <ForgotPasswordModal
                isOpen={showAuthModal && authView === 'forgot'}
                onClose={() => setShowAuthModal(false)}
                onSwitchToLogin={() => setAuthView('login')}
            />

            {
                showConfirmModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowConfirmModal(false)}
                        />

                        {/* Modal Card */}
                        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">

                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                            <div className="p-6 relative z-10">
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
                )
            }

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes shine {
                    0% { transform: translateX(-150%) skewX(-12deg); }
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
                .animate-shine { animation: shine 1.2s ease-out; }
            `}</style>

        </div >
    );
};

export default CoursePlayer;