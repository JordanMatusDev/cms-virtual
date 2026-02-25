import { useMemo, useState } from 'react';
import { type Course } from '../schemas/course.schema';

type CourseStatusFilter = 'all' | 'active' | 'inactive';

export const useCoursesFilter = (courses: Course[] = []) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<CourseStatusFilter>('all');
   const [categoryFilter, setCategoryFilter] = useState('all');

   const categories = useMemo(() => {
      const uniqueCategories = new Set(
         courses
            .map((course) => course.categoria?.nombre)
            .filter((category): category is string => Boolean(category))
      );

      return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
   }, [courses]);

   const filteredCourses = useMemo(() => {
      const normalizedSearch = searchTerm.trim().toLowerCase();

      return courses.filter((course) => {
         const matchesSearch =
            normalizedSearch.length === 0 ||
            course.titulo.toLowerCase().includes(normalizedSearch) ||
            course.descripcion.toLowerCase().includes(normalizedSearch) ||
            course.categoria.nombre.toLowerCase().includes(normalizedSearch);

         const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && course.activo) ||
            (statusFilter === 'inactive' && !course.activo);

         const matchesCategory =
            categoryFilter === 'all' || course.categoria.nombre === categoryFilter;

         return matchesSearch && matchesStatus && matchesCategory;
      });
   }, [courses, searchTerm, statusFilter, categoryFilter]);

   return {
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      categoryFilter,
      setCategoryFilter,
      categories,
      filteredCourses,
   };
};
