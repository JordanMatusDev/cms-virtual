import { useState, useRef, useEffect } from 'react';
import {
    Award, Search, Download, Calendar, ExternalLink, Filter, Loader2,
    Trophy, ChevronLeft, ChevronRight, ChevronDown, Check, Star
} from 'lucide-react';
import { Link } from 'react-router';
import { useCertificates } from '../hooks/pages/useCertificates';

const MyCertificates = () => {
    // 1. Extraemos lógica de negocio
    const {
        loading,
        filteredCerts,
        availableCategories,
        searchTerm, setSearchTerm,
        categoryFilter, setCategoryFilter,
        downloadingIds, downloadCertificate
    } = useCertificates();

    // 2. Lógica puramente visual (UI State)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    
    // Banner Mouse Effect
    const bannerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // Carousel Logic
    const rowRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // --- HANDLERS VISUALES ---
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!bannerRef.current) return;
        const rect = bannerRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const checkScroll = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const slide = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const { clientWidth } = rowRef.current;
            const scrollAmount = clientWidth * 0.7;
            const newScrollPosition = direction === 'left'
                ? rowRef.current.scrollLeft - scrollAmount
                : rowRef.current.scrollLeft + scrollAmount;
            rowRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
            setTimeout(checkScroll, 500);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [filteredCerts.length]);


    return (
        <div className="min-h-screen bg-[#04070f] text-white font-sans selection:bg-cyan-500/30">
            <div className="h-24"></div> {/* Espaciador */}

            <main className="w-full max-w-[1200px] mx-auto px-4 pb-20">

                {/* === BANNER INTERACTIVO === */}
                <div
                    ref={bannerRef}
                    onMouseMove={handleMouseMove}
                    className="group relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 mb-12 shadow-2xl transition-all duration-500 hover:shadow-yellow-500/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-[#0f0f0f]"></div>
                    <div
                        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(250, 204, 21, 0.15), transparent 40%)` }}
                    />
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-yellow-600/20 rounded-full blur-[80px] animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-900/20 rounded-full blur-[80px] animate-pulse delay-700"></div>

                    {/* Elementos flotantes decorativos */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-3/4 left-1/4 animate-[bounce_3s_infinite] opacity-30"><Star size={12} className="text-yellow-400" /></div>
                        <div className="absolute top-1/2 left-3/4 animate-[bounce_4s_infinite] delay-1000 opacity-20"><div className="w-2 h-2 rounded-full bg-cyan-400"></div></div>
                        <div className="absolute top-1/4 right-1/4 animate-[pulse_3s_infinite] delay-500 opacity-40"><Star size={8} className="text-white" /></div>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
                        <div className="relative group/icon">
                            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse group-hover/icon:bg-yellow-400/40 transition-all duration-500"></div>
                            <div className="relative p-5 bg-gradient-to-b from-white/10 to-transparent rounded-2xl border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md transition-transform duration-500 group-hover/icon:-translate-y-2">
                                <Trophy size={56} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-[pulse_4s_ease-in-out_infinite] transition-transform duration-500 group-hover/icon:scale-110" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white">Tu Muro de Éxito</h1>
                            <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                                Bienvenido a tu salón de la fama. Aquí transformamos horas de estudio en <span className="text-yellow-400 font-semibold">metas cumplidas</span>.
                            </p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                                    <Award size={16} className="text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-200">{filteredCerts.length} Certificados</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === TOOLBAR (Sticky) === */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 sticky top-[80px] z-30 bg-[#04070f]/95 backdrop-blur py-4 -mx-2 px-2">
                    
                    {/* Buscador */}
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 w-full md:w-96">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar certificado o instructor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent rounded-lg pl-10 pr-4 py-2 text-sm font-medium text-white placeholder-gray-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Filtro Categoría (estilo unificado y con 'Filtrar') */}
                    <div className="relative z-20">
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[180px] bg-white/5 border border-white/10 ${isCategoryOpen ? 'border-cyan-500/50' : 'hover:border-white/20'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-cyan-400" />
                                <span className="text-gray-300">
                                    <span className="font-bold text-white mr-1">Filtrar:</span>
                                    {categoryFilter === 'all' ? (
                                        <span className="text-cyan-400 font-bold">Todas</span>
                                    ) : (
                                        <span className="text-cyan-400 font-bold">
                                            {availableCategories.find(cat => cat.key === categoryFilter)?.display || categoryFilter}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCategoryOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)}></div>
                                <div className="absolute right-0 top-full mt-2 w-56 bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-20 animate-in fade-in zoom-in-95">
                                    <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
                                        <button onClick={() => { setCategoryFilter('all'); setIsCategoryOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-gray-300 hover:text-cyan-400 flex justify-between">
                                            <span className={categoryFilter === 'all' ? 'text-cyan-400 font-bold' : ''}>Todas</span> {categoryFilter === 'all' && <Check size={16} className="text-cyan-400" />}
                                        </button>
                                        <div className="h-px bg-white/10 my-1 mx-4"></div>
                                        {availableCategories.map((cat) => (
                                            <button key={cat.key} onClick={() => { setCategoryFilter(cat.key); setIsCategoryOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-gray-300 hover:text-cyan-400 flex justify-between">
                                                <span className={categoryFilter === cat.key ? 'text-cyan-400 font-bold' : ''}>{cat.display}</span> {categoryFilter === cat.key && <Check size={16} className="text-cyan-400" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* === CONTENIDO PRINCIPAL === */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-500 animate-pulse">Recuperando tus logros...</p>
                    </div>
                ) : filteredCerts.length > 0 ? (
                    
                    // --- CAROUSEL ---
                    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 group/row">
                        {canScrollLeft && (
                            <button onClick={() => slide('left')} className="absolute -left-4 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 text-white w-10 flex items-center justify-center backdrop-blur-sm cursor-pointer border-r border-white/10 rounded-r-xl opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                                <ChevronLeft size={24} className="text-cyan-400" />
                            </button>
                        )}

                        <div ref={rowRef} onScroll={checkScroll} className="flex overflow-x-auto gap-8 scrollbar-hide py-4 scroll-smooth" style={{ scrollPaddingLeft: 0 }}>
                            {filteredCerts.map((cert) => (
                                <div key={cert.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] lg:min-w-[360px] lg:w-[360px] group relative bg-[#0a0a0a] border border-yellow-400/60 hover:border-yellow-400 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(250,204,21,0.25)] flex flex-col">
                                    
                                    {/* DIPLOMA PREVIEW */}
                                    <div className="relative h-56 bg-gradient-to-br from-gray-800 to-[#111] overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 transition-transform duration-500 group-hover:scale-110">
                                            <Award size={56} className="text-yellow-500/80 mb-3 drop-shadow-lg" />
                                            <h3 className="text-white font-serif text-lg leading-tight line-clamp-2">{cert.curso}</h3>
                                            <div className="mt-2 w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                                        </div>

                                        {/* ACCIONES (HOVER) */}
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-20 transform translate-y-4 group-hover:translate-y-0">
                                            <button
                                                onClick={() => downloadCertificate(cert.enrollmentId, cert.curso)}
                                                disabled={downloadingIds.has(cert.enrollmentId)}
                                                className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {downloadingIds.has(cert.enrollmentId) ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                                Descargar PDF
                                            </button>
                                        </div>
                                    </div>

                                    {/* INFO */}
                                    <div className="p-5 flex-1 flex flex-col bg-[#0f0f0f]">
                                        <div className="mb-4">
                                            <p className="text-xs text-yellow-400 uppercase tracking-wider font-bold mb-1">Curso completado</p>
                                            <p className="text-gray-300 text-sm font-medium">{cert.instructor}</p>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span>{cert.fecha}</span>
                                            </div>
                                            <span className="bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5">
                                                COD: {cert.verificationCode || 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="min-w-[10px]"></div>
                        </div>

                        {canScrollRight && (
                            <button onClick={() => slide('right')} className="absolute -right-4 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 text-white w-10 flex items-center justify-center backdrop-blur-sm cursor-pointer border-l border-white/10 rounded-l-xl opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                                <ChevronRight size={24} className="text-cyan-400" />
                            </button>
                        )}
                    </div>

                ) : (
                    // --- EMPTY STATE ---
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                        <div className="w-24 h-24 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
                            <Trophy size={40} className="text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {searchTerm ? 'No se encontraron certificados' : 'Aún no tienes certificados'}
                        </h3>
                        <p className="text-gray-400 max-w-md mb-8">
                            {searchTerm ? `No hay resultados para "${searchTerm}" en la categoría seleccionada.` : "Completa cursos al 100% para desbloquear tus diplomas y verlos reflejados en tu muro de éxito."}
                        </p>
                        <Link to="/catalogo" className="px-8 py-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black font-bold rounded-xl border border-cyan-500/20 hover:border-cyan-500 transition-all flex items-center gap-2">
                            <ExternalLink size={20} />
                            Explorar Catálogo de Cursos
                        </Link>
                    </div>
                )}
            </main>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

export default MyCertificates;