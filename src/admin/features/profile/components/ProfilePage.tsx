import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
   Box,
   Button,
   Stack,
   TextField,
   Typography,
   Avatar,
   Grid,
   Paper,
   IconButton,
   Divider,
} from '@mui/material';
import { FaSave } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { inputSx } from '@/admin/theme/Input.styles';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { AuthContext } from '@/admin/core/context/authContext';
import { useGetUserByUsername, useUpdateUser, useUploadUserAvatar } from '@/admin/features/users/hooks/useUsers';
import { cleanPatchPayload } from '@/admin/utils/cleanPayloadUtils';
import { z } from 'zod';
import AdminPageLoader from '@/admin/core/components/AdminPageLoader';

const ProfilePayloadSchema = z.object({
   username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres.'),
   email: z.email('El correo electrónico no es válido.'),
   password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/, 'Debe tener al menos 8 caracteres, una letra mayúscula y un número.')
      .or(z.literal(''))
      .optional(),
   name: z.string().nullable(),
   surnames: z.string().nullable(),
});

type ProfilePayload = z.infer<typeof ProfilePayloadSchema>;

function ProfilePage() {
   const navigate = useNavigate();
   const { usuario, access_token, setLogin } = useContext(AuthContext);
   const [mainError, setMainError] = useState('');
   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
   const [avatarFileToUpload, setAvatarFileToUpload] = useState<File | null>(null);

   const username = usuario?.username;

   const {
      data: userData,
      isLoading: isFetchingUser,
   } = useGetUserByUsername(username);

   const updateMutation = useUpdateUser();
   const uploadAvatarMutation = useUploadUserAvatar();

   const isSaving = updateMutation.isPending || uploadAvatarMutation.isPending;

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<ProfilePayload>({
      resolver: zodResolver(ProfilePayloadSchema),
      defaultValues: {
         username: '',
         email: '',
         password: '',
         name: '',
         surnames: '',
      },
   });

   useEffect(() => {
      if (userData) {
         reset({
            username: userData.username,
            email: userData.email,
            password: '',
            name: userData.name,
            surnames: userData.surnames,
         });
         setAvatarPreview(userData.img || null);
      }
   }, [userData, reset]);

   const originalValues = useMemo(() => {
      if (!userData) return undefined;
      return {
         username: userData.username,
         email: userData.email,
         password: '',
         name: userData.name,
         surnames: userData.surnames,
      };
   }, [userData]);

   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFileToUpload(file);
   };

   const onFormError = (errores: any) => {
      window.scrollTo({ top: -5, behavior: 'smooth' });
      const errorMsg = errores.general
         ? errores.general.message
         : Object.values(errores)
              .map((err: any) => err.message)
              .join(', ');
      setMainError('Error: ' + errorMsg);
   };

   const onSubmit = async (data: ProfilePayload) => {
      if (!userData) return;
      setMainError('');

      try {
         const payloadToUpdate = cleanPatchPayload(data, originalValues, ['password']);

         delete (payloadToUpdate as Record<string, unknown>).status;
         delete (payloadToUpdate as Record<string, unknown>).verification;

         if (Object.keys(payloadToUpdate).length > 0) {
            await updateMutation.mutateAsync({
               id: String(userData.id),
               data: payloadToUpdate,
            });
         }

         if (avatarFileToUpload) {
            await uploadAvatarMutation.mutateAsync({
               user_id: String(userData.id),
               file: avatarFileToUpload,
            });
         }

         if (access_token) {
            setLogin(
               {
                  username: data.username,
                  email: data.email,
                  name: data.name,
                  surnames: data.surnames,
                  img: avatarPreview,
               },
               access_token,
            );
         }

         navigate(ROUTES_PATHS.ADMIN_HOME);
      } catch (error: any) {
         onFormError({ general: { message: error.message } });
      }
   };

   const handleCancel = () => navigate(ROUTES_PATHS.ADMIN_HOME);

   if (!username) {
      return (
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <Typography sx={{ color: '#EF4444', fontWeight: 600 }}>
               No se encontró sesión activa para cargar el perfil.
            </Typography>
         </Box>
      );
   }

   if (isFetchingUser) {
      return <AdminPageLoader message="Cargando información del perfil..." />;
   }

   return (
      <Box component="form" onSubmit={handleSubmit(onSubmit, onFormError)} sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
               <IconButton onClick={handleCancel} sx={{ color: '#94A3B8' }}>
                  <MdArrowBack />
               </IconButton>
               <Box>
                  <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                     Mi Perfil
                  </Typography>
               </Box>
            </Stack>

            {mainError && (
               <Paper sx={{ p: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#EF4444', fontSize: '13px', textAlign: 'center' }}>{mainError}</Typography>
               </Paper>
            )}
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
                        label="Usuario" fullWidth sx={inputSx}
                        {...register('username')} error={!!errors.username}
                        helperText={errors.username?.message}
                     />

                     <TextField
                        label="Correo Electrónico" fullWidth sx={inputSx}
                        {...register('email')} error={!!errors.email}
                        helperText={errors.email?.message}
                     />

                     <TextField
                        type="password" label="Contraseña" fullWidth sx={inputSx}
                        {...register('password')} error={!!errors.password}
                        helperText={errors.password?.message || 'Dejar vacío para mantener la contraseña actual'}
                     />
                  </Stack>
               </Grid>

               <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={2.5}>
                     <TextField
                        label="Nombre" fullWidth sx={inputSx}
                        {...register('name')} error={!!errors.name}
                        helperText={errors.name?.message}
                     />

                     <TextField
                        label="Apellido" fullWidth sx={inputSx}
                        {...register('surnames')} error={!!errors.surnames}
                        helperText={errors.surnames?.message}
                     />
                  </Stack>
               </Grid>

               <Grid size={{ xs: 12 }}>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2, mt: 1 }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>IMAGEN DE PERFIL</Typography>
                  <Stack direction="column" alignItems="center" justifyContent="center" spacing={1.5} sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '8px', p: 2, minHeight: '120px' }}>
                     <Avatar
                        src={avatarPreview || '/default-avatar.png'}
                        sx={{ width: 96, height: 96, border: '1px solid rgba(255,255,255,0.15)' }}
                     />
                     <Button
                        component="label" variant="outlined" size="small"
                        sx={{ color: '#F8FAFC', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none' }}
                     >
                        Subir imagen
                        <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                     </Button>
                  </Stack>
               </Grid>
            </Grid>
         </Box>

         <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
            <Button onClick={handleCancel} sx={{ color: '#94A3B8', textTransform: 'none' }} disabled={isSaving}>
               Cancelar
            </Button>
            <Button
               type="submit" variant="contained" startIcon={<FaSave />} disabled={isSaving}
               sx={{ color: 'white', bgcolor: '#4F46E5', px: 3, borderRadius: '6px', textTransform: 'none', '&:hover': { bgcolor: '#4338CA' } }}
            >
               {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
         </Stack>
      </Box>
   );
}

export default ProfilePage;
