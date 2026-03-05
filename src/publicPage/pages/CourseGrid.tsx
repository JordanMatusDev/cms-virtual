import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Filter, ChevronDown, Check, ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react';
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
            setCanScrollLeft(Math.floor(scrollLeft) > 0);
            setCanScrollRight(
                scrollWidth > clientWidth &&
                Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2
            );
        }
    }

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
        <div className="mb-10 relative animate-in fade-in slide-in-from-bottom-4 duration-500 group/row">
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-cyan-500 pl-4 flex items-center gap-3">
                {category}
                <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{courses.length}</span>
            </h2>

            <div className="relative">
                {canScrollLeft && (
                    <button onClick={() => slide('left')} className="absolute -left-4 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 text-white w-10 hidden sm:flex items-center justify-center backdrop-blur-sm cursor-pointer border-r border-white/10 rounded-r-xl opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                        <ChevronLeft size={24} className="text-cyan-400" />
                    </button>
                )}

                <div ref={rowRef} onScroll={checkScroll} className="flex overflow-x-auto gap-4 sm:gap-5 scrollbar-hide py-4 scroll-smooth snap-x snap-mandatory" style={{ scrollPaddingLeft: 0 }}>
                    {courses.map((course) => (
                        <div key={course.id} onClick={() => navigate(`/curso/${course.id}`)} className="snap-start sm:snap-none w-full min-w-full sm:min-w-[300px] sm:w-[300px] bg-[#121212] rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)] hover:-translate-y-1 cursor-pointer group/card isolate">
                            <div className="relative overflow-hidden rounded-t-2xl aspect-[16/9] sm:aspect-auto sm:h-40 w-full [transform:translateZ(0)]">
                                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-all z-10"></div>
                                <img src={course.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"} alt={course.title} className="w-full h-full object-cover transform group-hover/card:scale-110 transition duration-500 z-0" loading="lazy" />
                                <div className="absolute top-2 left-2 z-20">
                                    <span className="bg-[#0b1220] backdrop-blur-md border border-[#1e2a3a] px-2 py-1 text-xs font-bold text-slate-300 rounded">{course.category}</span>
                                </div>
                            </div>
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <h3 className="text-base font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors line-clamp-2">{course.title}</h3>
                                <button className="w-full py-2 rounded-lg font-semibold text-xs text-white border border-white/10 bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:border-transparent transition-all duration-300 cursor-pointer shadow-lg relative overflow-hidden">Ver Curso</button>
                            </div>
                        </div>
                    ))}
                    <div className="min-w-[10px]"></div>
                </div>

                {canScrollRight && (
                    <button onClick={() => slide('right')} className="absolute -right-4 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 text-white w-10 hidden sm:flex items-center justify-center backdrop-blur-sm cursor-pointer border-l border-white/10 rounded-l-xl opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
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
                <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                    <div>
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
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-20 animate-in fade-in zoom-in-95">
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
                <div className="space-y-2 pb-20">
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