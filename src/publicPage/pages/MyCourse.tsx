import { 
  PlayCircle, Award, Trash2, Clock, AlertTriangle, 
  ChevronLeft, ChevronRight, Filter, ChevronDown, Check,
  BookOpen
} from 'lucide-react';
import { useMyCourses } from '../hooks/pages/useMyCourses';

const MyCourses = () => {
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
    
  // Efecto mouse para el banner
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    bannerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    bannerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
  const {
    userData,
    loading,
    courses, // Lista completa para conteos
    filteredCourses, // Lista filtrada para mostrar
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
    handleDeleteCourse,
    slide,
    navigate
  } = useMyCourses();

  return (
    <div className="min-h-screen bg-[#04070f] text-white font-sans selection:bg-cyan-500/30">
      <div className="h-24"></div>

      <main className="w-full max-w-[1200px] mx-auto px-4 pb-20">
        
        {/* === HERO SECTION === */}
        <div
          ref={bannerRef}
          onMouseMove={handleMouseMove}
          className="group relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 mb-12 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/10"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#0f0f0f]"></div>
            
            {/* Efecto Spotlight optimizado */}
            <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.15), transparent 40%)` }}
            />
            
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-[80px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-900/20 rounded-full blur-[80px] animate-pulse delay-700"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
                <div className="relative group/icon">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse group-hover/icon:bg-cyan-400/40 transition-all duration-500"></div>
                    <div className="relative p-5 bg-gradient-to-b from-white/10 to-transparent rounded-2xl border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md transition-transform duration-500 group-hover/icon:-translate-y-2">
                        <BookOpen size={56} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-[pulse_4s_ease-in-out_infinite] transition-transform duration-500 group-hover/icon:scale-110" />
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <h1 className="text-4xl font-bold">
                      Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 animate-text-shimmer bg-[length:200%_auto]">{userData.displayName}</span> 👋
                    </h1>
                    
                    <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
                        El conocimiento es poder. Tienes <strong className="text-white border-b border-cyan-500/50 pb-0.5">{courses.filter(c => c.progress < 100).length} cursos activos</strong> esperándote.
                    </p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-default">
                            <Clock className="text-cyan-400" size={20}/>
                            <span className="text-sm text-gray-200">En progreso: <strong>{courses.filter(c => c.progress < 100).length}</strong></span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-default">
                            <Award className="text-purple-400" size={20}/>
                            <span className="text-sm text-gray-200">Completados: <strong>{courses.filter(c => c.progress === 100).length}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* === FILTROS === */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 sticky top-[80px] z-30 bg-[#04070f]/95 backdrop-blur py-4 -mx-2 px-2">
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'active', label: 'En Progreso' },
                { id: 'completed', label: 'Completados' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === tab.id ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative z-20">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[180px] bg-white/5 border border-white/10 ${
                  isCategoryOpen ? 'border-cyan-500/50' : 'hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-cyan-400" />
                  <span className="text-gray-300">
                    <span className="font-bold text-white mr-1">Filtrar:</span>
                    <span className={filterCategory === 'Todas' ? 'text-cyan-400 font-bold' : 'text-gray-300'}>{filterCategory}</span>
                  </span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-20 animate-in fade-in zoom-in-95">
                    <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
                      <button onClick={() => { setFilterCategory('Todas'); setIsCategoryOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-gray-300 hover:text-cyan-400 flex justify-between">
                        <span className={filterCategory === 'Todas' ? 'text-cyan-400 font-bold' : ''}>Todas</span> {filterCategory === 'Todas' && <Check size={16} className="text-cyan-400" />}
                      </button>
                      <div className="h-px bg-white/10 my-1 mx-4"></div>
                      {availableCategories.map((cat) => (
                        <button key={cat} onClick={() => { setFilterCategory(cat); setIsCategoryOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-gray-300 hover:text-cyan-400 flex justify-between">
                          <span className={filterCategory === cat ? 'text-cyan-400 font-bold' : ''}>{cat}</span> {filterCategory === cat && <Check size={16} className="text-cyan-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
        </div>

        {/* === GRID DE CURSOS === */}
        {loading ? (
           <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredCourses.length > 0 ? (
          <div className="relative group/row">
            {canScroll.left && (
              <button onClick={() => slide('left')} className="absolute -left-4 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 w-10 flex items-center justify-center backdrop-blur-sm border-r border-white/10 rounded-r-xl transition-all">
                <ChevronLeft size={24} className="text-cyan-400" />
              </button>
            )}

            <div ref={rowRef} className="flex overflow-x-auto gap-6 pb-4 scroll-smooth no-scrollbar" style={{ scrollPadding: '1rem' }}>
              {filteredCourses.map((course) => (
                <div key={course.id} className={`min-w-[280px] w-[280px] sm:min-w-[320px] bg-[#0a0a0a] rounded-2xl overflow-hidden flex flex-col h-full group
                  ${course.progress === 100
                    ? 'border border-yellow-400/60 hover:border-yellow-400 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(250,204,21,0.25)]'
                    : 'border border-white/10 hover:border-cyan-500/30 transition-all hover:shadow-xl hover:shadow-cyan-900/10'}
                `}>
                  
                  <div className="relative aspect-video overflow-hidden">
                      <img src={course.image} alt={course.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-90"></div>
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-xs font-bold px-2 py-1 rounded text-white border border-white/10">
                        {course.category}
                      </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 text-white group-hover:text-cyan-400 transition-colors">
                        {course.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{course.progress === 100 ? 'Completado' : 'Progreso'}</span>
                            <span className={course.progress === 100 ? 'text-green-400' : 'text-cyan-400'}>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                            <div className={`h-full transition-all duration-1000 ease-out ${course.progress === 100 ? 'bg-gradient-to-r from-cyan-500 to-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'bg-cyan-500'}`}
                              style={{ width: `${course.progress}%` }}></div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                           {course.progress === 100 ? (
                             <button onClick={() => navigate('/certificados')} className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-sm font-semibold py-2 rounded-lg transition-colors border border-yellow-400/30">
                               <Award size={16} className="text-yellow-400"/> <span className="text-yellow-400">Certificado</span>
                             </button>
                           ) : (
                             <button onClick={() => navigate(`/curso/${course.courseId}`)} className="flex-1 flex items-center justify-center gap-2 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 text-sm font-semibold py-2 rounded-lg transition-colors border border-cyan-500/20">
                               <PlayCircle size={16}/> Continuar
                             </button>
                           )}
                           
                           <button onClick={() => setCourseToDelete(course.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                             <Trash2 size={18}/>
                           </button>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
              <div className="min-w-[1px]"></div>
            </div>

            {canScroll.right && (
              <button onClick={() => slide('right')} className="absolute -right-4 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 w-10 flex items-center justify-center backdrop-blur-sm border-l border-white/10 rounded-l-xl transition-all">
                <ChevronRight size={24} className="text-cyan-400" />
              </button>
            )}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
              <div className="w-24 h-24 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
                <BookOpen size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {filterStatus !== 'all' ? 'No se encontraron cursos' : 'Aún no te has inscrito en ningún curso'}
              </h3>
              <p className="text-gray-400 max-w-md mb-8">
                {filterStatus !== 'all' ? `No hay resultados para el filtro seleccionado.` : "Completa cursos para desbloquear tus diplomas y verlos reflejados en tu muro de éxito."}
              </p>
              <button onClick={handleGoToCourses} className="px-8 py-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black font-bold rounded-xl border border-cyan-500/20 hover:border-cyan-500 transition-all">
                Explorar Catálogo de Cursos
              </button>
            </div>
        )}

      </main>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* === MODAL === */}
      {courseToDelete && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
    {/* Backdrop: Más suave y con transición */}
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      onClick={() => setCourseToDelete(null)}
    />
    
    {/* Modal Card */}
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#151515] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">
      
      {/* Efecto de luz superior (opcional, le da toque premium) */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50" />

      <div className="p-6 relative z-10">
        {/* Icono con Glow */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <AlertTriangle size={26} className="text-red-500" />
        </div>

        {/* Textos: Mejor tipografía y espaciado */}
        <div className="text-center mb-6 space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">
            ¿Abandonar curso?
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed text-balance">
            Perderás tu progreso actual permanentemente. <br/>
            <span className="text-red-400/80 text-xs">Esta acción no se puede deshacer.</span>
          </p>
        </div>

        {/* Botones: Con feedback táctil (active:scale) */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setCourseToDelete(null)} 
            className="flex items-center justify-center py-2.5 rounded-xl bg-white/5 border border-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all active:scale-95"
          >
            Cancelar
          </button>
          
          <button 
            onClick={() => handleDeleteCourse()} 
            className="flex items-center justify-center py-2.5 rounded-xl bg-red-600 border border-red-500 text-white text-sm font-medium shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all active:scale-95 hover:shadow-red-500/30"
          >
            Sí, abandonar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MyCourses;