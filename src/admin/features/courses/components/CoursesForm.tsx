import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
   Grid,
   IconButton,
   Tooltip,
   Divider,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
} from '@mui/material';
import { inputSx, switchSx } from '@/admin/theme/Input.styles';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { FaEdit, FaSave, FaYoutube } from 'react-icons/fa';
import { MdDeleteForever, MdArrowBack } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';

import {
   useGetCourseById,
   useCreateCourse,
   useUpdateCourse,
   useDeleteCourse,
} from '../hooks/useCourse';
import { useGetCategories } from '../hooks/useCategories';
import { extractPlaylistId } from '@/admin/utils/youtubeUtils';
import { useYoutubeData } from '@/admin/features/youtubeData';
import {
   CoursePayloadSchema,
   type CoursePayload,
} from '../schemas/coursePayload.schema';
import { cleanPatchPayload } from '@/admin/utils/cleanPayloadUtils';
import AdminPageLoader from '@/admin/core/components/AdminPageLoader';
import { useToast } from '@/admin/core/context/toastContext';
import { TOAST_MESSAGES } from '@/admin/core/constants/appConstants';

const COURSES_GO_LAST_PAGE_KEY = 'admin.courses.goLastPage';

function CoursesForm() {
   const { id } = useParams();
   const navigate = useNavigate();
   const handleGoBack = () => navigate(-1);

   const isEditMode = id && id !== 'nuevo';
   const [isEditable, setIsEditable] = useState(!isEditMode);
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [playlistId, setPlaylistId] = useState<string>('');
   const [formattedCourseData, setFormattedCourseData] =
      useState<CoursePayload>({
         title: '',
         description: '',
         category_id: 0,
         video_url: '',
         duration_minutes: 0,
         status: false,
         img: '',
         modules: 0,
         playlist_id: '',
         author: '',
      });
   const { showToast } = useToast();

   const { data: courseData, isLoading: isFetchingCourse } = useGetCourseById(
      isEditMode ? id : undefined
   );
   const { data: categories } = useGetCategories();

   const { playlist, playlistItems, videoDetails } = useYoutubeData(playlistId);

   const createMutation = useCreateCourse();
   const updateMutation = useUpdateCourse();
   const deleteMutation = useDeleteCourse();
   const isSaving = createMutation.isPending || updateMutation.isPending;

   const {
      register,
      handleSubmit,
      control,
      reset,
      setValue,
      getValues,
      watch,
      setError,
      formState: { errors },
   } = useForm<CoursePayload>({
      resolver: zodResolver(CoursePayloadSchema),
      defaultValues: {
         title: '',
         description: '',
         category_id: 0,
         video_url: '',
         duration_minutes: 0,
         status: false,
         img: '',
         modules: 0,
         playlist_id: '',
         author: '',
      },
   });

   // Observadores
   const titleWatch = watch('title');
   const descriptionWatch = watch('description');
   const authorWatch = watch('author');
   const videoUrlWatch = watch('video_url');
   const imgWatch = watch('img');
   const modulesWatch = watch('modules');
   const playlistIdWatch = watch('playlist_id');
   const durationWatch = watch('duration_minutes');

   const modulesList =
      typeof playlistIdWatch === 'string' && playlistIdWatch
         ? playlistIdWatch.split(',').filter((id) => id.trim() !== '')
         : [];

   useEffect(() => {
      if (isEditMode && courseData) {
         const fCourseData = {
            title: courseData.titulo,
            description: courseData.descripcion,
            category_id: courseData.categoria_id,
            video_url: courseData.video_url,
            duration_minutes: courseData.duracion_minutos,
            status: courseData.activo,
            img: courseData.img,
            modules: courseData.modulos,
            playlist_id: courseData.playlist_id,
            author: courseData.autor,
         };
         setFormattedCourseData(fCourseData);
         reset(fCourseData);
      }
   }, [courseData, isEditMode, reset]);

   useEffect(() => {
      if (playlist?.data && playlistItems?.data && videoDetails?.data) {
         const playlistInfo = playlist.data;
         const currentValues = getValues();

         setValue(
            'title',
            currentValues.title || playlistInfo.items[0]?.snippet.title || '',
            { shouldValidate: true, shouldDirty: true }
         );
         setValue(
            'description',
            currentValues.description ||
               playlistInfo.items[0]?.snippet.description ||
               '',
            { shouldValidate: true, shouldDirty: true }
         );

         setValue(
            'img',
            playlistInfo.items[0]?.snippet.thumbnails.high?.url || '',
            { shouldValidate: true, shouldDirty: true }
         );
         setValue('author', playlistInfo.items[0]?.snippet.channelTitle || '', {
            shouldValidate: true,
            shouldDirty: true,
         });
         setValue('modules', playlistItems.data.length || 0, {
            shouldValidate: true,
            shouldDirty: true,
         });

         const playlistString = playlistItems.data.join(',');
         setValue('playlist_id', playlistString, {
            shouldValidate: true,
            shouldDirty: true,
         });

         const totalMinutes = videoDetails.data.reduce(
            (acc, video) => acc + video.durationMinutes,
            0
         );
         setValue('duration_minutes', totalMinutes, {
            shouldValidate: true,
            shouldDirty: true,
         });
      }
   }, [
      playlist?.data,
      playlistItems?.data,
      videoDetails?.data,
      setValue,
      getValues,
   ]);

   const handlePlaylistImport = () => {
      const extractedId = extractPlaylistId(videoUrlWatch || '');
      if (!extractedId) {
         setError('video_url', {
            type: 'manual',
            message: 'URL de playlist no válida',
         });
         return;
      }
      setPlaylistId(extractedId);
   };

   const onFormError = (errores: any) => {
      window.scrollTo({ top: -5, behavior: 'smooth' });
      const generalMessage = (errores as { general?: { message?: string } })
         .general?.message;
      const fieldMessages = Object.values(errores)
         .map((err: any) => err?.message)
         .filter(
            (message: unknown): message is string =>
               typeof message === 'string' && message.trim().length > 0
         );
      const errorMsg = generalMessage
         ? generalMessage
         : fieldMessages.length >= 2
           ? 'Hay campos con datos faltantes o inválidos.'
           : fieldMessages[0] || 'Hay campos con datos faltantes o inválidos.';

      showToast('Error: ' + errorMsg, 'error');
   };

   const onSubmit = async (data: CoursePayload) => {
      const cleanPayload = cleanPatchPayload<CoursePayload>(
         data,
         isEditMode ? formattedCourseData : undefined,
         ['img', 'playlist_id']
      );

      try {
         if (isEditMode) {
            console.log('Datos a actualizar:', cleanPayload);
            await updateMutation.mutateAsync({ id: id!, data: cleanPayload });
            showToast(TOAST_MESSAGES.COURSES.UPDATE_SUCCESS, 'success');
            navigate(-1);
         } else {
            console.log('Datos a crear:', data);
            await createMutation.mutateAsync(data);
            showToast(TOAST_MESSAGES.COURSES.CREATE_SUCCESS, 'success');
            window.sessionStorage.setItem(COURSES_GO_LAST_PAGE_KEY, 'true');
            navigate(ROUTES_PATHS.ADMIN_COURSES);
         }
      } catch (error: any) {
         showToast(
            error.message || TOAST_MESSAGES.COURSES.CREATE_ERROR,
            'error'
         );
      }
   };

   const handleOpenDeleteDialog = () => {
      setIsDeleteDialogOpen(true);
   };

   const handleCloseDeleteDialog = () => {
      if (deleteMutation.isPending) {
         return;
      }

      setIsDeleteDialogOpen(false);
   };

   const handleConfirmDelete = () => {
      if (!id) {
         return;
      }

      deleteMutation.mutate(id, {
         onSuccess: () => {
            setIsDeleteDialogOpen(false);
            showToast(TOAST_MESSAGES.COURSES.DELETE_SUCCESS, 'success');
            navigate(-1);
         },
         onError: (error: any) => {
            setIsDeleteDialogOpen(false);
            showToast(
               error.message || TOAST_MESSAGES.COURSES.DELETE_ERROR,
               'error'
            );
         },
      });
   };

   if (isFetchingCourse) {
      return <AdminPageLoader message="Cargando información del curso..." />;
   }

   return (
      <Box
         component="form"
         onSubmit={handleSubmit(onSubmit, onFormError)}
         sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
            }}
         >
            <Stack direction="row" alignItems="center" spacing={1}>
               <IconButton onClick={handleGoBack} sx={{ color: '#94A3B8' }}>
                  <MdArrowBack />
               </IconButton>
               <Box>
                  <Typography
                     variant="h5"
                     sx={{ color: '#F8FAFC', fontWeight: 'bold' }}
                  >
                     {isEditMode ? 'Detalles del Curso' : 'Nuevo Curso'}
                  </Typography>
               </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
               {isEditMode && (
                  <>
                     <Tooltip
                        title={isEditable ? 'Cancelar edición' : 'Editar curso'}
                     >
                        <Button
                           variant="contained"
                           onClick={() => setIsEditable(!isEditable)}
                           disabled={isSaving}
                           sx={{
                              bgcolor: isEditable ? '#64748B' : '#4F46E5',
                              minWidth: '40px',
                              p: 1,
                              color: 'white',
                           }}
                        >
                           {isEditable ? (
                              <IoIosCloseCircle size={20} />
                           ) : (
                              <FaEdit size={18} />
                           )}
                        </Button>
                     </Tooltip>
                     <Tooltip title="Eliminar curso">
                        <Button
                           variant="contained"
                           onClick={handleOpenDeleteDialog}
                           disabled={deleteMutation.isPending || isSaving}
                           sx={{
                              bgcolor: '#EF4444',
                              '&:hover': { bgcolor: '#DC2626' },
                              minWidth: '40px',
                              p: 1,
                              color: 'white',
                           }}
                        >
                           <MdDeleteForever size={20} />
                        </Button>
                     </Tooltip>
                  </>
               )}
            </Stack>
         </Box>

         <Box
            sx={{
               bgcolor: '#1E293B',
               p: 3,
               borderRadius: '12px',
               border: '1px solid rgba(255, 255, 255, 0.1)',
               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
         >
            <Grid container spacing={3}>
               {/* Columna Izquierda */}
               <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2.5}>
                     <TextField
                        label="Título del Curso"
                        fullWidth
                        sx={inputSx}
                        {...register('title')}
                        disabled={!isEditable}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        slotProps={{ inputLabel: { shrink: !!titleWatch } }}
                     />
                     <TextField
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={4}
                        sx={inputSx}
                        {...register('description')}
                        disabled={!isEditable}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        slotProps={{
                           inputLabel: { shrink: !!descriptionWatch },
                        }}
                     />
                     <TextField
                        label="Autor / Canal"
                        fullWidth
                        sx={inputSx}
                        {...register('author')}
                        disabled={!isEditable}
                        error={!!errors.author}
                        helperText={errors.author?.message}
                        slotProps={{ inputLabel: { shrink: !!authorWatch } }}
                     />
                  </Stack>
               </Grid>

               {/* Columna Derecha */}
               <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={2.5}>
                     <FormControl
                        fullWidth
                        sx={inputSx}
                        error={!!errors.category_id}
                        disabled={!isEditable}
                     >
                        <InputLabel>Categoría</InputLabel>
                        <Controller
                           name="category_id"
                           control={control}
                           render={({ field }) => (
                              <Select {...field} label="Categoría">
                                 {categories?.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                       {cat.nombre}
                                    </MenuItem>
                                 ))}
                              </Select>
                           )}
                        />
                        {errors.category_id && (
                           <Typography
                              variant="caption"
                              color="error"
                              sx={{ ml: 2, mt: 0.5 }}
                           >
                              {errors.category_id.message}
                           </Typography>
                        )}
                     </FormControl>

                     <Box
                        sx={{
                           p: 2,
                           bgcolor: 'rgba(255,255,255,0.02)',
                           borderRadius: '10px',
                           border: '1px dashed rgba(255,255,255,0.1)',
                        }}
                     >
                        <Typography
                           variant="caption"
                           sx={{
                              color: '#94A3B8',
                              mb: 2,
                              display: 'block',
                              fontWeight: 600,
                           }}
                        >
                           INTEGRACIÓN YOUTUBE
                        </Typography>
                        <TextField
                           label="URL de la Playlist"
                           fullWidth
                           sx={{ ...inputSx, mb: 1.5 }}
                           {...register('video_url')}
                           disabled={!isEditable}
                           error={!!errors.video_url}
                           helperText={errors.video_url?.message}
                           placeholder="https://www.youtube.com/..."
                        />
                        <Button
                           fullWidth
                           variant="outlined"
                           size="small"
                           startIcon={<FaYoutube />}
                           onClick={handlePlaylistImport}
                           disabled={!isEditable || !videoUrlWatch}
                           sx={{
                              color: '#F8FAFC',
                              borderColor: 'rgba(255,255,255,0.2)',
                              textTransform: 'none',
                           }}
                        >
                           Sincronizar Datos
                        </Button>
                     </Box>

                     <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                           bgcolor: 'rgba(255,255,255,0.02)',
                           p: 1.5,
                           borderRadius: '8px',
                        }}
                     >
                        <Typography sx={{ color: '#F8FAFC', fontSize: '14px' }}>
                           Estado del curso
                        </Typography>
                        <Controller
                           name="status"
                           control={control}
                           render={({
                              field: { value, onChange, ...rest },
                           }) => (
                              <FormControlLabel
                                 control={
                                    <Switch
                                       {...rest}
                                       checked={!!value}
                                       onChange={(e) =>
                                          onChange(e.target.checked)
                                       }
                                       disabled={!isEditable}
                                       sx={switchSx}
                                    />
                                 }
                                 label={value ? 'Activo' : 'Inactivo'}
                                 sx={{
                                    color: value ? '#10B981' : '#94A3B8',
                                    m: 0,
                                 }}
                              />
                           )}
                        />
                     </Stack>
                  </Stack>
               </Grid>

               {/* Sección Inferior Unificada */}
               <Grid size={{ xs: 12 }}>
                  <Divider
                     sx={{
                        borderColor: 'rgba(255,255,255,0.05)',
                        mb: 2,
                        mt: 1,
                     }}
                  />
                  <Grid container spacing={2}>
                     <Grid>
                        <Typography
                           variant="caption"
                           sx={{ color: '#94A3B8', mb: 1, display: 'block' }}
                        >
                           VISTA PREVIA
                        </Typography>
                        <Box
                           component="img"
                           src={imgWatch || '-'}
                           alt="Imagen del curso"
                           sx={{
                              width: '245px',
                              height: '140px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.1)',
                           }}
                        />
                     </Grid>

                     <Grid size={{ xs: 12, sm: 8 }}>
                        <Box
                           sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                           }}
                        >
                           <Typography
                              variant="caption"
                              sx={{ color: '#94A3B8' }}
                           >
                              MÓDULOS DETECTADOS (
                              {videoDetails?.data?.length ||
                                 modulesList.length ||
                                 modulesWatch ||
                                 0}
                              )
                           </Typography>
                           {durationWatch > 0 && (
                              <Typography
                                 variant="caption"
                                 sx={{ color: '#10B981', fontWeight: 'bold' }}
                              >
                                 ⏱ {durationWatch} min. totales
                              </Typography>
                           )}
                        </Box>

                        <Box
                           sx={{
                              height: '140px',
                              overflowY: 'auto',
                              bgcolor: 'rgba(0,0,0,0.2)',
                              borderRadius: '8px',
                              p: 1.5,
                              '&::-webkit-scrollbar': { width: '4px' },
                              '&::-webkit-scrollbar-thumb': {
                                 bgcolor: 'rgba(255,255,255,0.1)',
                                 borderRadius: '10px',
                              },
                           }}
                        >
                           {videoDetails?.data ? (
                              videoDetails.data.map((video, index) => (
                                 <Box
                                    key={video.id}
                                    sx={{
                                       display: 'flex',
                                       alignItems: 'center',
                                       gap: 1.5,
                                       mb: 1,
                                       p: 1,
                                       bgcolor: 'rgba(255,255,255,0.05)',
                                       borderRadius: '6px',
                                    }}
                                 >
                                    <Box
                                       component="img"
                                       src={video.thumbnail}
                                       alt={video.title}
                                       sx={{
                                          width: '50px',
                                          height: '30px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                       }}
                                    />
                                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                       <Typography
                                          noWrap
                                          sx={{
                                             color: '#F8FAFC',
                                             fontSize: '13px',
                                             fontWeight: 500,
                                          }}
                                       >
                                          {index + 1}. {video.title}
                                       </Typography>
                                    </Box>
                                    <Typography
                                       sx={{
                                          color: '#94A3B8',
                                          fontSize: '11px',
                                          whiteSpace: 'nowrap',
                                       }}
                                    >
                                       {video.durationMinutes > 0
                                          ? `${video.durationMinutes} min`
                                          : '< 1 min'}
                                    </Typography>
                                 </Box>
                              ))
                           ) : modulesList.length > 0 ? (
                              modulesList.map((id, index) => (
                                 <Box
                                    key={index}
                                    sx={{
                                       display: 'flex',
                                       alignItems: 'center',
                                       gap: 1,
                                       mb: 1,
                                       p: 1,
                                       bgcolor: 'rgba(255,255,255,0.05)',
                                       borderRadius: '6px',
                                    }}
                                 >
                                    <FaYoutube size={16} color="#F43F5E" />
                                    <Typography
                                       sx={{
                                          color: '#F8FAFC',
                                          fontSize: '13px',
                                       }}
                                    >
                                       {id}
                                    </Typography>
                                 </Box>
                              ))
                           ) : (
                              <Typography
                                 sx={{
                                    color: '#64748B',
                                    fontSize: '12px',
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    mt: 4,
                                 }}
                              >
                                 {modulesWatch
                                    ? `Hay ${modulesWatch} módulos en este curso. Haz clic en Sincronizar Datos para ver los detalles.`
                                    : 'No hay módulos detectados.'}
                              </Typography>
                           )}
                        </Box>
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </Box>

         <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 1 }}
         >
            <Button
               onClick={handleGoBack}
               sx={{ color: '#94A3B8', textTransform: 'none' }}
               disabled={isSaving}
            >
               Cancelar
            </Button>
            <Button
               type="submit"
               variant="contained"
               startIcon={<FaSave />}
               disabled={!isEditable || isSaving}
               sx={{
                  color: 'white',
                  bgcolor: '#4F46E5',
                  px: 3,
                  borderRadius: '6px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#4338CA' },
               }}
            >
               {isSaving
                  ? 'Guardando...'
                  : isEditMode
                    ? 'Guardar Cambios'
                    : 'Crear Curso'}
            </Button>
         </Stack>

         <Dialog
            open={isDeleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            fullWidth
            maxWidth="xs"
         >
            <DialogTitle>Eliminar curso</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  Esta acción eliminará el curso de forma permanente. ¿Deseas
                  continuar?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseDeleteDialog}
                  disabled={deleteMutation.isPending}
               >
                  Cancelar
               </Button>
               <Button
                  onClick={handleConfirmDelete}
                  color="error"
                  variant="contained"
                  disabled={deleteMutation.isPending}
               >
                  {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
}

export default CoursesForm;
