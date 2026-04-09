import React, { useRef, useEffect } from 'react';
import { Search, Loader2, X, ChevronRight, BookOpen } from 'lucide-react';
import { useCourseSearch } from '../../hooks/header/useCourseSearch';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    isSearching,
    showSuggestions,
    setShowSuggestions,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    handleSearchChange,
    handleKeyDown,
    goToCourse
  } = useCourseSearch();

  // 1. BLOQUEO DE SCROLL DEL FONDO
  useEffect(() => {
    if (showSuggestions) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSuggestions]);

  // 2. CERRAR AL HACER CLIC AFUERA
  useEffect(() => {
    if (!showSuggestions) return; 

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showSuggestions, setShowSuggestions]);

  // 3. INTERCEPTOR DE TECLADO (Limpio)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setSearchQuery('');
      setShowSuggestions(false);
      e.currentTarget.blur();
      return;
    }

    if (e.key === 'Enter' && activeSuggestionIndex === -1) {
      e.preventDefault(); 
      e.currentTarget.blur(); 
      return;
    }

    handleKeyDown(e);
  };

  return (
    <div className={`relative w-full group ${className || ''}`} ref={searchRef}>
      
      {/* CONTENEDOR PRINCIPAL DEL INPUT */}
      <div className="relative flex items-center w-full bg-white/5 border border-white/10 rounded-full focus-within:bg-black/60 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 shadow-inner transition-all duration-300">
        
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
          <Search size={20} className={`transition-colors ${searchQuery ? 'text-cyan-400' : 'text-gray-500'}`} />
        </div>

        {/* INPUT ÚNICO Y LIMPIO */}
        <input
          type="text"
          enterKeyHint="search"
          value={searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
          placeholder="¿Qué quieres aprender hoy?"
          className="block w-full pl-11 pr-10 py-3 bg-transparent border-none leading-5 text-gray-300 placeholder-gray-500 focus:outline-none sm:text-sm font-medium outline-none"
        />
        
        {/* Botón Limpiar o Carga */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center z-20">
          {isSearching ? (
            <Loader2 className="animate-spin text-cyan-500" size={16}/>
          ) : searchQuery && (
            <button onClick={() => {setSearchQuery(''); setShowSuggestions(false);}} className="text-gray-500 hover:text-white">
              <X size={16}/>
            </button>
          )}
        </div>
      </div>

      {/* MENÚ DESPLEGABLE (Intacto) */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          {suggestions.length > 0 ? (
            <ul className="max-h-[40vh] sm:max-h-[340px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/50">
              <li className="sticky top-0 z-10 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-[#0a0a0a] border-b border-white/5 flex justify-between items-center">
                <span>Búsqueda</span>
                <span className="text-[10px] text-gray-500 lowercase">{suggestions.length} resultados</span>
              </li>
              {suggestions.map((course, index) => (
                <li key={course.id}>
                  <button
                    onClick={() => goToCourse(course.id)}
                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-4 transition-colors group border-b border-white/5 last:border-0 ${
                      activeSuggestionIndex === index ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <img src={course.image} alt="" className="w-12 h-8 rounded object-cover bg-gray-800 border border-white/10 shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate transition-colors ${
                        activeSuggestionIndex === index ? 'text-cyan-400' : 'text-gray-200'
                      }`}>
                        {course.title}
                      </h4>
                      <span className="text-xs text-gray-500 block truncate">{course.category}</span>
                    </div>
                    <ChevronRight size={16} className={`transition-all shrink-0 ${
                        activeSuggestionIndex === index ? 'text-cyan-400 opacity-100' : 'text-gray-600 opacity-0'
                      }`}/>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !isSearching && (
              <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                <BookOpen size={24} className="mb-2 opacity-50"/>
                <p className="text-sm">No encontramos cursos con ese nombre.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;