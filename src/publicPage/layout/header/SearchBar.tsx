// src/components/header/SearchBar.tsx
import React, { useRef } from 'react';
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

  return (
    <div className={`relative w-full group ${className || ''}`} ref={searchRef}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={20} className={`transition-colors ${searchQuery ? 'text-cyan-400' : 'text-gray-500'}`} />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={e => handleSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
        placeholder="¿Qué quieres aprender hoy?"
        className="block w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-full leading-5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black/60 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 sm:text-sm transition-all duration-300 shadow-inner font-medium"
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
        {isSearching ? (
          <Loader2 className="animate-spin text-cyan-500" size={16}/>
        ) : searchQuery && (
          <button onClick={() => {setSearchQuery(''); setShowSuggestions(false);}} className="text-gray-500 hover:text-white">
            <X size={16}/>
          </button>
        )}
      </div>
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          {suggestions.length > 0 ? (
            <ul>
              <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white/5">
                Busqueda
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
                    <img
                      src={course.image}
                      alt=""
                      className="w-12 h-8 rounded object-cover bg-gray-800 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-200 group-hover:text-cyan-400 truncate transition-colors">
                        {course.title}
                      </h4>
                      <span className="text-xs text-gray-500">{course.category}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all"/>
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
