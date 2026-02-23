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
   Chip
} from '@mui/material';
import { useState } from 'react';
import { type Course } from '../schemas/course.schema';
import { useGetCourses } from '../hooks/useCourse';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { IoReloadCircle } from "react-icons/io5";
import { FaPlus, FaEllipsisV, FaClock, FaBookOpen } from "react-icons/fa";

function CoursesList() {
   const { data: courses, isLoading, error, refetch, isFetching } = useGetCourses();
   const navigate = useNavigate();

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

   const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
      setAnchorEl(event.currentTarget);
      setSelectedCourseId(id);
   };

   const handleCloseMenu = () => {
      setAnchorEl(null);
      setSelectedCourseId(null);
   };

   const handleCourseForm = () => {
      navigate(ROUTES_PATHS.ADMIN_COURSES_FORM.replace(':id', 'nuevo'), { replace: true });
   };

   const handleEdit = () => {
      if (selectedCourseId) {
         navigate(ROUTES_PATHS.ADMIN_COURSES_FORM.replace(':id', String(selectedCourseId)));
      }
      handleCloseMenu();
   };

   const handleDeactivate = () => {
      if (selectedCourseId) {
      const courseToDeactivate = courses?.find(c => c.id === selectedCourseId);
      console.log("Curso a desactivar:", courseToDeactivate);
      }
      handleCloseMenu();
   };

   return (
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
         
         {/* ENCABEZADO BASADO EN TU LOGICA */}
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
               <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
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
                  variant='contained' 
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
                     '&:hover': { bgcolor: '#4338CA' }
                  }}
               >
                  <FaPlus size={16} style={{ marginRight: 8 }} />
                  Nuevo Curso
               </Button>
            </Stack>
         </Box>

         {/* GRID DE CARDS CON DATOS REALES */}
         <Grid container spacing={3} sx={{ overflowY: 'auto'}}>
            {courses?.map((course: Course) => (
               <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <Card sx={{ 
                     bgcolor: '#1E293B', 
                     borderRadius: '12px', 
                     border: '1px solid rgba(255, 255, 255, 0.1)',
                     position: 'relative',
                     display: 'flex',
                     flexDirection: 'column',
                     height: '100%'
                  }}>
                     <IconButton 
                        onClick={(e) => handleOpenMenu(e, course.id)}
                        sx={{ 
                           position: 'absolute', top: 8, right: 8, 
                           bgcolor: 'rgba(15, 23, 42, 0.6)', color: 'white',
                           zIndex: 2,
                           '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.9)' }
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
                           borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                     />

                     <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
                                 mb: 1
                              }} 
                           />
                           <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 'bold', fontSize: '1rem', mb: 1 }}>
                              {course.titulo}
                           </Typography>
                           <Typography variant="body2" sx={{ 
                              color: '#94A3B8', 
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              fontSize: '0.85rem',
                              height: '40px' 
                           }}>
                              {course.descripcion}
                           </Typography>
                        </Box>

                        <Stack direction="row" spacing={2} sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                           <Box sx={{ display: 'flex', alignItems: 'center', color: '#94A3B8', gap: 0.5 }}>
                              <FaClock size={12} />
                              <Typography variant="caption">{course.duracion_minutos} min</Typography>
                           </Box>
                           <Box sx={{ display: 'flex', alignItems: 'center', color: '#94A3B8', gap: 0.5 }}>
                              <FaBookOpen size={12} />
                              <Typography variant="caption">{course.modulos} módulos</Typography>
                           </Box>
                           <Box sx={{ ml: 'auto' }}>
                              <Typography variant="caption" sx={{ color: course.activo ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                                 {course.activo ? '● Activo' : '● Inactivo'}
                              </Typography>
                           </Box>
                        </Stack>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>

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
                     boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                  }
               }
            }}
         >
            <MenuItem onClick={handleEdit} sx={{ fontSize: '14px' }}>Editar Detalles</MenuItem>
            <MenuItem onClick={handleDeactivate} sx={{ fontSize: '14px', color: '#EF4444' }}>Desactivar</MenuItem>
         </Menu>

         {error && (
            <Typography sx={{ color: '#EF4444', mt: 3, fontWeight: 600, textAlign: 'center' }}>
               {`Error: ${error.message || 'Error desconocido'}`}
            </Typography>
         )}
      </Box>
   );
}

export default CoursesList;