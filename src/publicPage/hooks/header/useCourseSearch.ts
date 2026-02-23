// src/hooks/header/useCourseSearch.ts
// Hook para lógica de búsqueda, filtrado y teclado de cursos
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCourses } from '../../services/pages/courseGridService';
import type { Course } from '../../types/course.type';

export function useCourseSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses().then((data) => {
      // Filtrar activos y mapear igual que useCourseGrid
      const activeCourses = data.filter((c: any) =>
        (typeof c.activo === 'undefined') ? true : (c.activo == 1 || c.activo === true || c.activo === 'true')
      );
      const formattedCourses: Course[] = activeCourses.map((c: any) => ({
        id: c.id,
        title: c.titulo || c.nombre || "Curso sin título",
        category: c.categoria?.nombre || "General",
        image: c.img || c.imagen_url || "",
        description: c.descripcion
      }));
      setAllCourses(formattedCourses);
    });
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      setIsSearching(true);
      setShowSuggestions(true);
      setTimeout(() => {
        const filtered = allCourses.filter(course =>
          (course.title || '').toLowerCase().includes(value.toLowerCase())
        );
        const nextSuggestions = filtered.slice(0, 5);
        setSuggestions(nextSuggestions);
        setActiveSuggestionIndex(nextSuggestions.length > 0 ? 0 : -1);
        setIsSearching(false);
      }, 200);
    } else {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
      setShowSuggestions(false);
    }
  };

  const goToCourse = (courseId: number) => {
    setSearchQuery("");
    setShowSuggestions(false);
    navigate(`/curso/${courseId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setShowSuggestions(true);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        goToCourse(suggestions[activeSuggestionIndex].id);
      }
      return;
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return {
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
  };
}
