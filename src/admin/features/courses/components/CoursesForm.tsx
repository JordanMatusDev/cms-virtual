import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
   Box,
   Button,
   Stack,
   TextField,
   Typography,
   FormControlLabel,
   FormControl,
   Switch,
   InputLabel,
   Select,
   MenuItem,
   CircularProgress,
   Grid, // En MUI v6 este ya apunta al nuevo sistema
   Paper,
   IconButton,
   Tooltip,
   Divider
} from '@mui/material';
import { inputSx, switchSx } from '@/admin/theme/Input.styles';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { FaEdit, FaSave, FaYoutube } from 'react-icons/fa';
import { MdDeleteForever, MdArrowBack } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';
import { useGetCourseById, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../hooks/useCourse';
import { useGetCategories } from '../hooks/useCategories';
import { extractPlaylistId } from '@/admin/utils/youtubeUtils';
import { useYoutubeData } from '@/admin/features/youtubeData';
import { CoursePayloadSchema, type CoursePayload } from '../schemas/coursePayload.schema';

function CoursesForm() {
   const { id } = useParams();
   const navigate = useNavigate();

   const isEditMode = id && id !== 'nuevo';
   const [isEditable, setIsEditable] = useState(!isEditMode);
   const [formData, setFormData] = useState<Partial<CoursePayload>>({
      titulo: '',
      descripcion: '',
      categoria_id: 0,
      video_url: '',
      duracion_minutos: 0,
      activo: false,
      img: '',
      modulos: 0,
      playlist_id: '',
      autor: ''
   });
   
   const [fieldsErrors, setFieldsErrors] = useState<Record<string, string>>({});
   const [mainError, setMainError] = useState('');
   const [playlistId, setPlaylistId] = useState<string>('');

   const { data: courseData, isLoading: isFetchingCourse } = useGetCourseById(isEditMode ? id : undefined);
   const { data: categories } = useGetCategories();
   const { playlist, playlistItems } = useYoutubeData(playlistId);

   const createMutation = useCreateCourse();
   const updateMutation = useUpdateCourse();
   const deleteMutation = useDeleteCourse();

   useEffect(() => {
      if (isEditMode && courseData) {
         setFormData(courseData);
      }
   }, [courseData, isEditMode]);

   useEffect(() => {
      if (playlist?.data && playlistItems?.data) {
         const playlistInfo = playlist.data;
         setFormData(prev => ({
            ...prev,
            titulo: prev.titulo || playlistInfo.items[0]?.snippet.title,
            descripcion: prev.descripcion || playlistInfo.items[0]?.snippet.description,
            img: playlistInfo.items[0]?.snippet.thumbnails.high?.url || '',
            autor: playlistInfo.items[0]?.snippet.channelTitle || '',
            modulos: playlistItems.data.length || 0,
         }));
      }
   }, [playlist?.data, playlistItems?.data]);

   const handleInputChange = (field: keyof CoursePayload, value: string | number | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (fieldsErrors[field]) setFieldsErrors(prev => ({ ...prev, [field]: '' }));
   };

   const handlePlaylistImport = () => {
      const id = extractPlaylistId(formData.video_url || '');
      if (!id) {
         setFieldsErrors(prev => ({ ...prev, video_url: 'URL de playlist no válida' }));
         return;
      }
      setPlaylistId(id);
   };

   const handleSave = () => {
      const result = CoursePayloadSchema.safeParse(formData);
      if (!result.success) {
         const formattedErrors: Record<string, string> = {};
         result.error.issues.forEach((issue) => {
            formattedErrors[String(issue.path[0])] = issue.message;
         });
         console.log('Errores de validación:', formattedErrors);
         setFieldsErrors(formattedErrors);
         return;
      }

      const mutation = isEditMode ? updateMutation : createMutation;
      const payload = isEditMode ? { id: id!, data: result.data } : result.data;

      mutation.mutate(payload as any, {
         onSuccess: () => navigate(ROUTES_PATHS.ADMIN_COURSES),
         onError: (error: any) => setMainError(error.message || 'Error al guardar')
      });
   };

   const handleDelete = () => {
      if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
         deleteMutation.mutate(id!, {
            onSuccess: () => navigate(ROUTES_PATHS.ADMIN_COURSES),
            onError: (error: any) => setMainError(error.message || 'Error al eliminar')
         });
      }
   };

   if (isFetchingCourse) {
      return (
         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
            <CircularProgress sx={{ color: '#4F46E5' }} />
            <Typography sx={{ color: '#94A3B8', mt: 2 }}>Cargando información del curso...</Typography>
         </Box>
      );
   }

   return (
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
         
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
               <IconButton onClick={() => navigate(ROUTES_PATHS.ADMIN_COURSES)} sx={{ color: '#94A3B8' }}>
                  <MdArrowBack />
               </IconButton>
               <Box>
                  <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                     {isEditMode ? 'Detalles del Curso' : 'Nuevo Curso'}
                  </Typography>
               </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
               {isEditMode && (
                  <>
                     <Tooltip title={isEditable ? "Cancelar edición" : "Editar curso"}>
                        <Button
                           variant="contained"
                           onClick={() => setIsEditable(!isEditable)}
                           sx={{ bgcolor: isEditable ? '#64748B' : '#4F46E5', minWidth: '40px', p: 1 }}
                        >
                           {isEditable ? <IoIosCloseCircle size={20} /> : <FaEdit size={18} />}
                        </Button>
                     </Tooltip>
                     <Tooltip title="Eliminar curso">
                        <Button
                           variant="contained"
                           onClick={handleDelete}
                           sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, minWidth: '40px', p: 1 }}
                        >
                           <MdDeleteForever size={20} />
                        </Button>
                     </Tooltip>
                  </>
               )}
            </Stack>
         </Box>

         {mainError && (
            <Paper sx={{ p: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '8px' }}>
               <Typography sx={{ color: '#EF4444', fontSize: '13px', textAlign: 'center' }}>{mainError}</Typography>
            </Paper>
         )}

         <Box sx={{ 
            bgcolor: '#1E293B', 
            p: 3, 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
         }}>
            {/* Sistema de Grid v6: container + size */}
            <Grid container spacing={3}>
               
               {/* Columna Izquierda */}
               <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2.5}>
                     <TextField 
                        label="Título del Curso" 
                        fullWidth 
                        sx={inputSx} 
                        value={formData.titulo}
                        disabled={!isEditable}
                        onChange={(e) => handleInputChange('titulo', e.target.value)}
                        error={!!fieldsErrors.titulo}
                        helperText={fieldsErrors.titulo}
                     />
                     <TextField 
                        label="Descripción" 
                        fullWidth 
                        multiline 
                        rows={4} 
                        sx={inputSx} 
                        value={formData.descripcion}
                        disabled={!isEditable}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        error={!!fieldsErrors.descripcion}
                        helperText={fieldsErrors.descripcion}
                     />
                     <TextField 
                        label="Autor / Canal" 
                        fullWidth 
                        sx={inputSx} 
                        value={formData.autor}
                        disabled={!isEditable}
                        onChange={(e) => handleInputChange('autor', e.target.value)}
                     />
                  </Stack>
               </Grid>

               {/* Columna Derecha */}
               <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={2.5}>
                     <FormControl fullWidth sx={inputSx} error={!!fieldsErrors.categoria_id}>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                           label="Categoría"
                           value={formData.categoria_id || 0}
                           disabled={!isEditable}
                           onChange={(e) => handleInputChange('categoria_id', Number(e.target.value))}
                        >
                           {categories?.map((cat) => (
                              <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                           ))}
                        </Select>
                     </FormControl>

                     <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8', mb: 2, display: 'block', fontWeight: 600 }}>INTEGRACIÓN YOUTUBE</Typography>
                        <TextField 
                           label="URL de la Playlist" 
                           fullWidth 
                           sx={{ ...inputSx, mb: 1.5 }} 
                           value={formData.video_url}
                           disabled={!isEditable}
                           placeholder="https://www.youtube.com/..."
                           onChange={(e) => handleInputChange('video_url', e.target.value)}
                        />
                        <Button 
                           fullWidth 
                           variant="outlined" 
                           size="small"
                           startIcon={<FaYoutube />}
                           onClick={handlePlaylistImport}
                           disabled={!isEditable}
                           sx={{ color: '#F8FAFC', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none' }}
                        >
                           Sincronizar Datos
                        </Button>
                     </Box>

                     <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: '8px' }}>
                        <Typography sx={{ color: '#F8FAFC', fontSize: '14px' }}>Estado del curso</Typography>
                        <FormControlLabel
                           control={<Switch checked={formData.activo} onChange={(e) => handleInputChange('activo', e.target.checked)} sx={switchSx} />}
                           label={formData.activo ? "Activo" : "Inactivo"}
                           disabled={!isEditable}
                           sx={{ color: formData.activo ? '#10B981' : '#94A3B8', m: 0 }}
                        />
                     </Stack>
                  </Stack>
               </Grid>

               {/* Sección Inferior Unificada */}
               <Grid size={{ xs: 12 }}>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2, mt: 1 }} />
                  <Grid container spacing={2}>
                     <Grid>
                        <Typography variant="caption" sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>VISTA PREVIA</Typography>
                        <Box 
                           component="img" 
                           src={formData.img || '-'}
                           alt="Imagen del curso"
                           sx={{ width: '245px', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} 
                        />
                     </Grid>

                     <Grid size={{ xs: 12, sm: 8 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>MÓDULOS DETECTADOS ({playlistItems.data?.length || formData.modulos || 0})</Typography>
                        <Box sx={{ 
                           height: '140px', overflowY: 'auto', bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '8px', p: 1.5,
                           '&::-webkit-scrollbar': { width: '4px' },
                           '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }
                        }}>
                           {playlistItems.data?.map((id, index) => (
                              <Typography key={index} sx={{ color: '#94A3B8', fontSize: '12px', mb: 0.5, display: 'flex', gap: 1 }}>
                                 <span style={{ color: '#6366F1' }}>{index + 1}.</span> youtube.com/watch?v={id}
                              </Typography>
                           ))}
                           {!playlistItems.data?.length && (
                              <Typography sx={{ color: '#64748B', fontSize: '12px', fontStyle: 'italic', textAlign: 'center', mt: 4 }}>
                                 {formData.modulos ? `Hay ${formData.modulos} módulos detectados. Sincroniza para verlos aquí.` : 'No hay módulos detectados.'}
                              </Typography>
                           )}
                        </Box>
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </Box>

         <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
            <Button 
               onClick={() => navigate(ROUTES_PATHS.ADMIN_COURSES)} 
               sx={{ color: '#94A3B8', textTransform: 'none' }}
            >
               Cancelar
            </Button>
            <Button 
               variant="contained" 
               startIcon={<FaSave />}
               disabled={!isEditable || createMutation.isPending || updateMutation.isPending}
               onClick={handleSave}
               sx={{ color: 'white',
                  bgcolor: '#4F46E5', px: 3, borderRadius: '6px', textTransform: 'none',
                  '&:hover': { bgcolor: '#4338CA' }
               }}
            >
               {isEditMode ? 'Guardar Cambios' : 'Crear Curso'}
            </Button>
         </Stack>
      </Box>
   );
}

export default CoursesForm;