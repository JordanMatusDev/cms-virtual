import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, PlayCircle, Filter, ChevronDown, Check, ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { useCourseGrid } from '../hooks/pages/useCourseGrid';
import type { CategoryRowProps } from '../types/course.type';

const CategoryRow = ({ category, courses }: CategoryRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const navigate = useNavigate();

    const checkScroll = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [courses]);

    const slide = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const { clientWidth } = rowRef.current;
            const scrollAmount = clientWidth * 0.7;
            const newScrollPosition = direction === 'left' ? rowRef.current.scrollLeft - scrollAmount : rowRef.current.scrollLeft + scrollAmount;
            rowRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
            setTimeout(checkScroll, 500);
        }
    };

    return (
        <div className="mb-10 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-cyan-500 pl-4 flex items-center gap-3">
                {category}
                <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{courses.length}</span>
            </h2>

            <div className="relative group/slider">
                
                {canScrollLeft && (
                    <button 
                        onClick={() => slide('left')} 
                        className="absolute -left-4 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 text-white w-10 flex items-center justify-center backdrop-blur-sm cursor-pointer border-r border-white/10 rounded-r-xl transition-all duration-300 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100"
                    >
                        <ChevronLeft size={24} className="text-cyan-400" />
                    </button>
                )}

                {/* CONTENEDOR DE CURSOS */}
                <div ref={rowRef} onScroll={checkScroll} className="flex overflow-x-auto gap-5 scrollbar-hide py-4 scroll-smooth" style={{ scrollPaddingLeft: 0 }}>
                    {courses.map((course) => (
                        <div key={course.id} onClick={() => navigate(`/curso/${course.id}`)}
                            className="min-w-[260px] w-[260px] sm:min-w-[300px] h-[340px] bg-[#121212] rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)] hover:-translate-y-1 cursor-pointer group/card">

                            <div className="relative overflow-hidden h-[146px] sm:h-40 w-full shrink-0 rounded-t-2xl [transform:translateZ(0)] bg-[#121212]">
                                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-all z-20 pointer-events-none"></div>
                                <img 
                                    src={course.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"} 
                                    alt={course.title} 
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover/card:scale-110 transition duration-500 z-10" 
                                    loading="lazy" 
                                />
                                <div className="absolute top-2 left-2 z-30">
                                    <span className="bg-[#0b1220] backdrop-blur-md border border-[#1e2a3a] px-2 py-1 text-xs font-bold text-slate-300 rounded">{course.category}</span>
                                </div>
                            </div>

                            <div className="p-4 flex-grow flex flex-col">
                                <div>
                                    <h3 className="text-base font-bold text-white mb-2 group-hover/card:text-cyan-400 transition-colors line-clamp-2 min-h-[3rem]">{course.title}</h3>
                                    <p className="text-xs text-gray-400 line-clamp-2">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-center justify-between text-sm text-gray-400 border-t border-white/5 pt-3">
                                        <div className="flex items-center gap-1.5">
                                            <User size={12} className="text-cyan-500 shrink-0" />
                                            <span className="max-w-[120px] whitespace-normal break-words line-clamp-2 text-xs">{course.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <PlayCircle size={12} className="text-cyan-500" />
                                            <span className="text-xs">{course.videoCount} Lecciones</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="min-w-[10px]"></div>
                </div>

                {canScrollRight && (
                    <button 
                        onClick={() => slide('right')} 
                        className="absolute -right-4 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 text-white w-10 flex items-center justify-center backdrop-blur-sm cursor-pointer border-l border-white/10 rounded-l-xl transition-all duration-300 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100"
                    >
                        <ChevronRight size={24} className="text-cyan-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

const CourseGrid = () => {
    const { courses, loading, filter, setFilter, isFilterOpen, setIsFilterOpen, availableCategories } = useCourseGrid();

    if (loading) {
        return (
            <section className="bg-[#04070f] py-10 font-sans min-h-screen relative overflow-hidden flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            </section>
        );
    }

    return (
        <section id="course-grid" className="bg-[#04070f] py-10 font-sans min-h-screen relative overflow-hidden scroll-mt-24">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full">

                {/* Header */}
                <div className="relative z-40 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">                    <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Explorar Cursos</h2>
                    <p className="text-gray-400 text-sm mt-1">Domina nuevas habilidades hoy.</p>
                </div>

                    <div className="relative z-20">
                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[180px] bg-white/5 border border-white/10 ${isFilterOpen ? 'border-cyan-500/50' : 'hover:border-white/20'}`}>
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-cyan-400" />
                                <span className="text-gray-300">
                                    <span className="font-bold text-white mr-1">Filtrar:</span>
                                    {filter === 'Todas' ? (
                                        <span className="text-cyan-400 font-bold">Todas</span>
                                    ) : (
                                        <span className="text-cyan-400 font-bold">{filter}</span>
                                    )}
                                </span>
                            </div>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            // AQUI ESTÁ LA MAGIA: left-0 sm:left-auto sm:right-0
                            <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-56 bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-20 animate-in fade-in zoom-in-95">
                                <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
                                    <button onClick={() => { setFilter('Todas'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-cyan-400 hover:text-cyan-300 flex justify-between font-bold">
                                        Todas {filter === 'Todas' && <Check size={16} className="text-cyan-400" />}
                                    </button>
                                    <div className="h-px bg-white/10 my-1 mx-4"></div>
                                    {availableCategories.map((cat) => (
                                        <button key={cat} onClick={() => { setFilter(cat); setIsFilterOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-gray-300 hover:text-cyan-400 flex justify-between">
                                            <span className={filter === cat ? 'text-cyan-400 font-bold' : ''}>{cat}</span> {filter === cat && <Check size={16} className="text-cyan-400" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className="relative z-0 space-y-2 pb-20">
                    {courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <BookOpen size={48} className="mb-4 opacity-50" />
                            <p>No se encontraron cursos activos.</p>
                        </div>
                    ) : (
                        (filter === 'Todas' ?
                            availableCategories.map((category) => {
                                const categoryCourses = courses.filter(course => course.category === category);
                                if (categoryCourses.length === 0) return null;
                                return <CategoryRow key={category} category={category} courses={categoryCourses} />;
                            })
                            :
                            (() => {
                                const categoryCourses = courses.filter(course => course.category === filter);
                                if (categoryCourses.length === 0) return (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                        <BookOpen size={48} className="mb-4 opacity-50" />
                                        <p>No se encontraron cursos para esta categoría.</p>
                                    </div>
                                );
                                return <CategoryRow key={filter} category={filter} courses={categoryCourses} />;
                            })()
                        )
                    )}
                </div>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
            `}</style>
        </section>
    );
};

export default CourseGrid;