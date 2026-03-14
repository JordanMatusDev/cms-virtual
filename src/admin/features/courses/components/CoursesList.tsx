import { useNavigate } from 'react-router';
import {
   Box,
   Stack,
   Button,
   Typography,
   Tooltip,
   Grid,
   Card,
   CardMedia,
   CardContent,
   IconButton,
   Menu,
   MenuItem,
   Chip,
   TextField,
   FormControl,
   InputLabel,
   Select,
   type SelectChangeEvent,
   InputAdornment,
   Pagination,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { type Course } from '../schemas/course.schema';
import { useGetCourses, useUpdateCourse } from '../hooks/useCourse';
import { useCoursesFilter } from '../hooks/useCoursesFilter';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { TOAST_MESSAGES } from '@/admin/core/constants/appConstants';
import { IoReloadCircle } from 'react-icons/io5';
import {
   FaPlus,
   FaEllipsisV,
   FaClock,
   FaBookOpen,
   FaSearch,
} from 'react-icons/fa';
import AdminPageLoader from '@/admin/core/components/AdminPageLoader';
import { useToast } from '@/admin/core/context/toastContext';

const COURSES_PER_PAGE = 9;
const COURSES_PAGE_STORAGE_KEY = 'admin.courses.currentPage';
const COURSES_GO_LAST_PAGE_KEY = 'admin.courses.goLastPage';

function CoursesList() {
   const {
      data: courses,
      isLoading,
      error,
      refetch,
      isFetching,
   } = useGetCourses();
   const updateMutation = useUpdateCourse();
   const navigate = useNavigate();
   const {
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      categoryFilter,
      setCategoryFilter,
      categories,
      filteredCourses,
   } = useCoursesFilter(courses ?? []);

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
      null
   );
   const [actionError, setActionError] = useState('');
   const [page, setPage] = useState(() => {
      if (typeof window === 'undefined') {
         return 1;
      }

      const savedPage = Number(
         window.sessionStorage.getItem(COURSES_PAGE_STORAGE_KEY)
      );

      return Number.isInteger(savedPage) && savedPage > 0 ? savedPage : 1;
   });
   const { showToast } = useToast();

   const totalPages = Math.max(
      1,
      Math.ceil(filteredCourses.length / COURSES_PER_PAGE)
   );
   const paginatedCourses = filteredCourses.slice(
      (page - 1) * COURSES_PER_PAGE,
      page * COURSES_PER_PAGE
   );

   useEffect(() => {
      if (page > totalPages) {
         setPage(totalPages);
      }
   }, [page, totalPages]);

   useEffect(() => {
      if (typeof window === 'undefined') {
         return;
      }

      window.sessionStorage.setItem(COURSES_PAGE_STORAGE_KEY, String(page));
   }, [page]);

   useEffect(() => {
      if (typeof window === 'undefined' || isLoading || !!error) {
         return;
      }

      const shouldGoLastPage =
         window.sessionStorage.getItem(COURSES_GO_LAST_PAGE_KEY) === 'true';

      if (!shouldGoLastPage) {
         return;
      }

      setPage(totalPages);
      window.sessionStorage.removeItem(COURSES_GO_LAST_PAGE_KEY);
   }, [isLoading, error, totalPages]);

   const handleStatusFilterChange = (event: SelectChangeEvent) => {
      setStatusFilter(event.target.value as 'all' | 'active' | 'inactive');
      setPage(1);
   };

   const handleCategoryFilterChange = (event: SelectChangeEvent) => {
      setCategoryFilter(event.target.value);
      setPage(1);
   };

   const handleOpenMenu = (
      event: React.MouseEvent<HTMLButtonElement>,
      id: number
   ) => {
      setAnchorEl(event.currentTarget);
      setSelectedCourseId(id);
   };

   const handleCloseMenu = () => {
      setAnchorEl(null);
      setSelectedCourseId(null);
   };

   const handleCourseForm = () => {
      navigate(ROUTES_PATHS.ADMIN_COURSES_FORM.replace(':id', 'nuevo'));
   };

   const handleEdit = () => {
      if (selectedCourseId) {
         navigate(
            ROUTES_PATHS.ADMIN_COURSES_FORM.replace(
               ':id',
               String(selectedCourseId)
            )
         );
      }
      handleCloseMenu();
   };

   const selectedCourse = courses?.find(
      (course) => course.id === selectedCourseId
   );

   const handleDeactivate = async () => {
      if (!selectedCourseId || !selectedCourse?.activo) {
         handleCloseMenu();
         return;
      }

      setActionError('');

      try {
         await updateMutation.mutateAsync({
            id: String(selectedCourseId),
            data: { status: false },
         });
         showToast(TOAST_MESSAGES.COURSES.DEACTIVATE_SUCCESS, 'success');
      } catch (mutationError: any) {
         const errorMessage =
            mutationError?.message || TOAST_MESSAGES.COURSES.DEACTIVATE_ERROR;
         setActionError(errorMessage);
         showToast(errorMessage, 'error');
      } finally {
         handleCloseMenu();
      }
   };

   if (isLoading) {
      return <AdminPageLoader message="Cargando información de cursos..." />;
   }

   return (
      <Box
         sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
         }}
      >
         {/* ENCABEZADO BASADO EN TU LOGICA */}
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               mb: 4,
            }}
         >
            <Box>
               <Typography
                  variant="h5"
                  sx={{ color: '#F8FAFC', fontWeight: 'bold' }}
               >
                  Gestión de Cursos
               </Typography>
               <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Administra los cursos y contenidos del sistema
               </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
               <Tooltip title="Recargar lista de cursos" placement="left" arrow>
                  <Button
                     color="inherit"
                     disabled={isLoading || isFetching}
                     onClick={() => refetch()}
                     sx={{ color: '#94A3B8', minWidth: 'auto', p: 1 }}
                  >
                     <IoReloadCircle size={28} />
                  </Button>
               </Tooltip>

               <Button
                  variant="contained"
                  disabled={isLoading || isFetching}
                  onClick={handleCourseForm}
                  sx={{
                     bgcolor: '#4F46E5',
                     color: 'white',
                     borderRadius: '8px',
                     textTransform: 'none',
                     fontWeight: 600,
                     px: 3,
                     py: 1,
                     '&:hover': { bgcolor: '#4338CA' },
                  }}
               >
                  <FaPlus size={16} style={{ marginRight: 8 }} />
                  Nuevo Curso
               </Button>
            </Stack>
         </Box>

         <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ mb: 3 }}
         >
            <TextField
               value={searchTerm}
               onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
               }}
               placeholder="Buscar por título, descripción o categoría"
               size="small"
               fullWidth
               sx={{
                  '& .MuiOutlinedInput-root': {
                     color: '#F8FAFC',
                     bgcolor: '#1E293B',
                     '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                     '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.30)',
                     },
                     '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  },
                  '& .MuiInputBase-input::placeholder': {
                     color: '#94A3B8',
                     opacity: 1,
                  },
               }}
               slotProps={{
                  input: {
                     startAdornment: (
                        <InputAdornment position="start">
                           <FaSearch size={14} color="#94A3B8" />
                        </InputAdornment>
                     ),
                  },
               }}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
               <InputLabel sx={{ color: '#94A3B8' }}>Estado</InputLabel>
               <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={handleStatusFilterChange}
                  sx={{
                     color: '#F8FAFC',
                     bgcolor: '#1E293B',
                     '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.15)',
                     },
                     '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.30)',
                     },
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4F46E5',
                     },
                     '& .MuiSvgIcon-root': { color: '#94A3B8' },
                  }}
               >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="inactive">Inactivos</MenuItem>
               </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 220 }}>
               <InputLabel sx={{ color: '#94A3B8' }}>Categoría</InputLabel>
               <Select
                  value={categoryFilter}
                  label="Categoría"
                  onChange={handleCategoryFilterChange}
                  sx={{
                     color: '#F8FAFC',
                     bgcolor: '#1E293B',
                     '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.15)',
                     },
                     '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.30)',
                     },
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4F46E5',
                     },
                     '& .MuiSvgIcon-root': { color: '#94A3B8' },
                  }}
               >
                  <MenuItem value="all">Todas</MenuItem>
                  {categories.map((category) => (
                     <MenuItem key={category} value={category}>
                        {category}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
         </Stack>

         <Grid container spacing={3} sx={{ overflowY: 'auto' }}>
            {paginatedCourses.map((course: Course) => (
               <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <Card
                     sx={{
                        bgcolor: '#1E293B',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                     }}
                  >
                     <IconButton
                        onClick={(e) => handleOpenMenu(e, course.id)}
                        sx={{
                           position: 'absolute',
                           top: 8,
                           right: 8,
                           bgcolor: 'rgba(15, 23, 42, 0.6)',
                           color: 'white',
                           zIndex: 2,
                           '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.9)' },
                        }}
                     >
                        <FaEllipsisV size={14} />
                     </IconButton>

                     <CardMedia
                        component="img"
                        height="160"
                        image={course.img || '/default-course.png'}
                        alt={course.titulo}
                        sx={{
                           objectFit: 'cover',
                           borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                     />

                     <CardContent
                        sx={{
                           p: 2,
                           flexGrow: 1,
                           display: 'flex',
                           flexDirection: 'column',
                        }}
                     >
                        <Box sx={{ mb: 1 }}>
                           <Chip
                              label={course.categoria.nombre}
                              size="small"
                              sx={{
                                 bgcolor: 'rgba(0, 188, 212, 0.15)',
                                 color: '#00BCD4',
                                 fontSize: '10px',
                                 fontWeight: 700,
                                 textTransform: 'uppercase',
                                 mb: 1,
                              }}
                           />
                           <Typography
                              variant="h6"
                              sx={{
                                 color: '#F8FAFC',
                                 fontWeight: 'bold',
                                 fontSize: '1rem',
                                 mb: 1,
                              }}
                           >
                              {course.titulo}
                           </Typography>
                           <Typography
                              variant="body2"
                              sx={{
                                 color: '#94A3B8',
                                 fontSize: '0.85rem',
                                 mb: 1,
                                 fontStyle: 'italic',
                              }}
                           >
                              {course.autor}
                           </Typography>
                           <Typography
                              variant="body2"
                              sx={{
                                 color: '#94A3B8',
                                 overflow: 'hidden',
                                 display: '-webkit-box',
                                 WebkitLineClamp: 2,
                                 WebkitBoxOrient: 'vertical',
                                 fontSize: '0.85rem',
                                 height: '40px',
                              }}
                           >
                              {course.descripcion}
                           </Typography>
                        </Box>

                        <Stack
                           direction="row"
                           spacing={2}
                           sx={{
                              mt: 'auto',
                              pt: 2,
                              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                           }}
                        >
                           <Box
                              sx={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 color: '#94A3B8',
                                 gap: 0.5,
                              }}
                           >
                              <FaClock size={12} />
                              <Typography variant="caption">
                                 {course.duracion_minutos} min
                              </Typography>
                           </Box>
                           <Box
                              sx={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 color: '#94A3B8',
                                 gap: 0.5,
                              }}
                           >
                              <FaBookOpen size={12} />
                              <Typography variant="caption">
                                 {course.modulos} módulos
                              </Typography>
                           </Box>
                           <Box sx={{ ml: 'auto' }}>
                              <Typography
                                 variant="caption"
                                 sx={{
                                    color: course.activo
                                       ? '#10B981'
                                       : '#EF4444',
                                    fontWeight: 600,
                                 }}
                              >
                                 {course.activo ? '● Activo' : '● Inactivo'}
                              </Typography>
                           </Box>
                        </Stack>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>

         {!isLoading && !error && filteredCourses.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
               <Pagination
                  page={page}
                  count={totalPages}
                  onChange={(_, newPage) => setPage(newPage)}
                  shape="rounded"
                  sx={{
                     '& .MuiPaginationItem-root': {
                        color: '#F8FAFC',
                        borderColor: 'rgba(255,255,255,0.2)',
                     },
                     '& .MuiPaginationItem-root.Mui-selected': {
                        bgcolor: '#4F46E5',
                        color: 'white',
                     },
                     '& .MuiPaginationItem-root.Mui-selected:hover': {
                        bgcolor: '#4338CA',
                     },
                  }}
               />
            </Box>
         )}

         {!isLoading && !error && filteredCourses.length === 0 && (
            <Typography sx={{ color: '#94A3B8', mt: 3, textAlign: 'center' }}>
               No se encontraron cursos con los filtros aplicados.
            </Typography>
         )}

         {/* MENÚ DE ACCIONES */}
         <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            slotProps={{
               paper: {
                  sx: {
                     bgcolor: '#1E293B',
                     color: 'white',
                     border: '1px solid rgba(255,255,255,0.1)',
                     boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                  },
               },
            }}
         >
            <MenuItem onClick={handleEdit} sx={{ fontSize: '14px' }}>
               Editar Detalles
            </MenuItem>
            <MenuItem
               onClick={handleDeactivate}
               disabled={updateMutation.isPending || !selectedCourse?.activo}
               sx={{ fontSize: '14px', color: '#EF4444' }}
            >
               {updateMutation.isPending ? 'Desactivando...' : 'Desactivar'}
            </MenuItem>
         </Menu>

         {error && (
            <Typography
               sx={{
                  color: '#EF4444',
                  mt: 3,
                  fontWeight: 600,
                  textAlign: 'center',
               }}
            >
               {`Error: ${error.message || 'Error desconocido'}`}
            </Typography>
         )}

         {actionError && (
            <Typography
               sx={{
                  color: '#EF4444',
                  mt: 2,
                  fontWeight: 600,
                  textAlign: 'center',
               }}
            >
               {actionError}
            </Typography>
         )}
      </Box>
   );
}

export default CoursesList;
