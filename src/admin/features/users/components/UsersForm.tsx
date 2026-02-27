import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
   Box, Button, Stack, TextField, Typography, FormControlLabel,
   FormControl, Switch, InputLabel, Select, MenuItem, Avatar,
   CircularProgress, Grid, Paper, IconButton, Tooltip, Divider
} from '@mui/material';
import { inputSx, switchSx } from '@/admin/theme/Input.styles'
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { FaEdit, FaSave } from "react-icons/fa";
import { MdDeleteForever, MdArrowBack } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

import { useGetUserById, useCreateUser, useUpdateUser, useDeleteUser, useUploadUserAvatar } from '../hooks/useUsers'; 
import { UserPayloadSchema, type UserPayload } from '../schemas/userPayload.schema';
import { cleanPatchPayload } from '@/admin/utils/cleanPayloadUtils';
import { useToast } from '@/admin/core/context/toastContext';
import { TOAST_MESSAGES } from '@/admin/core/constants/appConstants';

function UsersForm() {
   const { id } = useParams();
   const navigate = useNavigate();
   
   const isEditMode = id && id !== 'nuevo';
   const [isEditable, setIsEditable] = useState(!isEditMode);
   const [mainError, setMainError] = useState('');
   
   // --- ESTADOS INDEPENDIENTES PARA LA IMAGEN ---
   // URL para mostrar la vista previa (ya sea de la API o la recién seleccionada)
   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
   // El archivo real que enviaremos, totalmente separado de react-hook-form
   const [avatarFileToUpload, setAvatarFileToUpload] = useState<File | null>(null);
   const { showToast } = useToast();

   const { data: userData, isLoading: isFetchingUser } = useGetUserById(isEditMode ? id : undefined);
   const createMutation = useCreateUser();
   const updateMutation = useUpdateUser();
   const deleteMutation = useDeleteUser();
   const uploadAvatarMutation = useUploadUserAvatar();
   
   const isSaving = createMutation.isPending || updateMutation.isPending || uploadAvatarMutation.isPending;

   const {
      register, handleSubmit, control, reset, setError, formState: { errors }
   } = useForm<UserPayload>({
      resolver: zodResolver(UserPayloadSchema),
      defaultValues: {
         username: '', email: '', password: '', rol: 'estudiante',
         name: '', surnames: '', status: true
         // OJO: Ya no ponemos 'img' aquí
      }
   });

   useEffect(() => {
      if (isEditMode && userData) {
         // Cuando cargan los datos, llenamos el formulario y la preview
         reset({ ...userData, password: '' });
         setAvatarPreview(userData.img || null);
      }
   }, [userData, isEditMode, reset]);

   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      
      // Mostramos la vista previa local
      setAvatarPreview(URL.createObjectURL(file));
      // Guardamos el archivo para enviarlo después
      setAvatarFileToUpload(file);
   };

   const onFormError = (errores: any) => {
      window.scrollTo({ top: -5, behavior: 'smooth' });
      const errorMsg = errores.general 
         ? errores.general.message 
         : Object.values(errores).map((err: any) => err.message).join(', ');
         
      setMainError('Error: ' + errorMsg);
   };

   const onSubmit = async (data: UserPayload) => {
      setMainError('');

      if (isEditMode) {
         try {
            const payloadToUpdate = cleanPatchPayload(data, userData, ['password']);
            
            if (Object.keys(payloadToUpdate).length > 0) {
               await updateMutation.mutateAsync({ id: id!, data: payloadToUpdate });
            }

            if (avatarFileToUpload) {
               await uploadAvatarMutation.mutateAsync({ user_id: id!, file: avatarFileToUpload });
            }

            showToast(TOAST_MESSAGES.USERS.UPDATE_SUCCESS, 'success');
            navigate(ROUTES_PATHS.ADMIN_USERS);
         } catch (error: any) {
            showToast(error.message || TOAST_MESSAGES.USERS.UPDATE_ERROR, 'error');
            onFormError({ general: { message: error.message } });
         }
      } else {
         if (!data.password) {
            setError('password', { type: 'manual', message: 'La contraseña es requerida para crear un usuario' });
            return;
         }
         if (!data.name) {
            setError('name', {type: 'manual', message: 'El nombre es requerido para crear un usuario'})
            return;
         }
         if (!data.surnames) {
            setError('surnames', {type: 'manual', message: 'Los apellidos son requeridos para crear un usuario'})
            return;
         }

         try {
            const response = await createMutation.mutateAsync(data);
            const newUserId = response.id; 

            if (!newUserId) {
               throw new Error('Usuario creado, pero no se pudo obtener el ID del servidor.');
            }

            const tareasExtra = [];

            tareasExtra.push(
               updateMutation.mutateAsync({ 
                  id: newUserId.toString(), 
                  data: { verification: true, status: data.status } 
               })
            );

            if (avatarFileToUpload) {
               tareasExtra.push(
                  uploadAvatarMutation.mutateAsync({ 
                     user_id: newUserId.toString(), 
                     file: avatarFileToUpload 
                  })
               );
            }

            await Promise.all(tareasExtra);
            showToast(TOAST_MESSAGES.USERS.CREATE_SUCCESS, 'success');
            navigate(ROUTES_PATHS.ADMIN_USERS);

         } catch (error: any) {
            showToast(error.message || TOAST_MESSAGES.USERS.CREATE_ERROR, 'error');
            onFormError({ general: { message: 'Hubo un problema en el proceso: ' + error.message } });
         }
      }
   };

   const handleDelete = () => {
      if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
         deleteMutation.mutate(id!, {
            onSuccess: () => {
               showToast(TOAST_MESSAGES.USERS.DELETE_SUCCESS, 'success');
               navigate(ROUTES_PATHS.ADMIN_USERS);
            },
            onError: (error: Error) => {
               showToast(error.message || TOAST_MESSAGES.USERS.DELETE_ERROR, 'error');
               onFormError({ general: { message: error.message } });
            }
         });
      }
   };

   const handleCancel = () => navigate(ROUTES_PATHS.ADMIN_USERS);

   if (isFetchingUser) {
      return (
         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
            <CircularProgress sx={{ color: '#4F46E5' }} />
            <Typography sx={{ color: '#94A3B8', mt: 2 }}>Cargando información del usuario...</Typography>
         </Box>
      );
   }

   return (
      <Box component="form" onSubmit={handleSubmit(onSubmit, onFormError)} 
      sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
               <IconButton onClick={handleCancel} sx={{ color: '#94A3B8' }}>
                  <MdArrowBack />
               </IconButton>
               <Box>
                  <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                     {isEditMode ? 'Detalles del Usuario' : 'Nuevo Usuario'}
                  </Typography>
               </Box>
            </Stack>

            {mainError && (
               <Paper sx={{ p: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#EF4444', fontSize: '13px', textAlign: 'center' }}>{mainError}</Typography>
               </Paper>
            )}

            <Stack direction="row" spacing={1}>
               {isEditMode && (
                  <>
                     <Tooltip title={isEditable ? 'Cancelar edición' : 'Editar usuario'}>
                        <Button
                           variant="contained"
                           onClick={() => setIsEditable((prev) => !prev)}
                           disabled={isSaving}
                           sx={{ bgcolor: isEditable ? '#64748B' : '#4F46E5', minWidth: '40px', p: 1, color: 'white' }}
                        >
                           {isEditable ? <IoIosCloseCircle size={20} /> : <FaEdit size={18} />}
                        </Button>
                     </Tooltip>
                     <Tooltip title="Eliminar usuario">
                        <Button
                           variant="contained"
                           onClick={handleDelete}
                           disabled={deleteMutation.isPending || isSaving}
                           sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, minWidth: '40px', p: 1,
                           color: 'white' }}
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
               bgcolor: '#1E293B', p: 3, borderRadius: '12px',
               border: '1px solid rgba(255, 255, 255, 0.1)',
               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
         >
            <Grid container spacing={3}>
               <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2.5}>
                     <TextField
                        label='Usuario' fullWidth sx={inputSx}
                        {...register('username')} error={!!errors.username}
                        helperText={errors.username?.message} disabled={!isEditable}
                     />

                     <TextField
                        label='Correo Electrónico' fullWidth sx={inputSx}
                        {...register('email')} error={!!errors.email}
                        helperText={errors.email?.message} disabled={!isEditable}
                     />

                     <TextField
                        type='password' label='Contraseña' fullWidth sx={inputSx}
                        {...register('password')} error={!!errors.password}
                        helperText={isEditMode ? 'Dejar vacío para mantener la contraseña actual' : errors.password?.message}
                        disabled={!isEditable}
                     />
                  </Stack>
               </Grid>

               <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={2.5}>
                     <FormControl fullWidth sx={inputSx} error={!!errors.rol} disabled={!isEditable}>
                        <InputLabel>Rol</InputLabel>
                        <Controller
                           name='rol' control={control}
                           render={({ field }) => (
                              <Select {...field} label='Rol'>
                                 <MenuItem value='estudiante'>Estudiante</MenuItem>
                                 <MenuItem value='admin'>Administrador</MenuItem>
                              </Select>
                           )}
                        />
                     </FormControl>

                     {errors.rol && (
                        <Typography variant='caption' color='error' sx={{ ml: 2, mt: -1.5 }}>
                           {errors.rol?.message}
                        </Typography>
                     )}

                     <TextField
                        label='Nombre' fullWidth sx={inputSx}
                        {...register('name')} error={!!errors.name}
                        helperText={errors.name?.message} disabled={!isEditable}
                     />

                     <TextField
                        label='Apellido' fullWidth sx={inputSx}
                        {...register('surnames')} error={!!errors.surnames}
                        helperText={errors.surnames?.message} disabled={!isEditable}
                     />
                  </Stack>
               </Grid>

               <Grid size={{ xs: 12 }}>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2, mt: 1 }} />
                  <Grid container spacing={2}>
                     <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant='caption' sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>ESTADO</Typography>
                        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: '8px', minHeight: '120px' }}>
                           <Typography sx={{ color: '#F8FAFC', fontSize: '14px' }}>Estado del usuario</Typography>
                           <Controller
                           name='status' control={control}
                           render={({ field: { value, onChange, ...rest } }) => (
                              <FormControlLabel
                                 control={
                                    <Switch
                                       {...rest} checked={!!value}
                                       onChange={(e) => onChange(e.target.checked)}
                                       disabled={!isEditable} sx={switchSx}
                                    />
                                 }
                                 label={value ? 'Activo' : 'Inactivo'}
                                 sx={{ color: value ? '#22C55E' : '#EF4444', ml: 0 }}
                              />
                           )}
                           />
                        </Stack>
                     </Grid>

                     <Grid size={{ xs: 12, md: 7 }}>
                        <Typography variant='caption' sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>IMAGEN DE PERFIL</Typography>
                        <Stack direction='column' alignItems='center' justifyContent='center' spacing={1.5} sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '8px', p: 2, minHeight: '120px' }}>
                           <Avatar
                              src={avatarPreview || '/default-avatar.png'}
                              sx={{ width: 96, height: 96, border: '1px solid rgba(255,255,255,0.15)' }}
                           />
                           <Button
                              component='label' variant='outlined' size='small' disabled={!isEditable}
                              sx={{ color: '#F8FAFC', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none' }}
                           >
                              Subir imagen
                              <input type='file' hidden accept='image/*' onChange={handleAvatarChange} />
                           </Button>
                        </Stack>
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </Box>

         <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 1 }}>
            <Button onClick={handleCancel} sx={{ color: '#94A3B8', textTransform: 'none' }} disabled={isSaving}>
               Cancelar
            </Button>
            <Button
               type='submit' variant='contained' startIcon={<FaSave />} disabled={isSaving || !isEditable}
               sx={{ color: 'white', bgcolor: '#4F46E5', px: 3, borderRadius: '6px', textTransform: 'none', '&:hover': { bgcolor: '#4338CA' } }}
            >
               {isSaving ? 'Guardando...' : isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
         </Stack>
      </Box>
   );
}
export default UsersForm;