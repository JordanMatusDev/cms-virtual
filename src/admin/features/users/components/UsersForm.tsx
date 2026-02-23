import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
   Box, Button, Stack, TextField, Typography, FormControlLabel,
   FormControl, Switch, InputLabel, Select, MenuItem, Avatar, CircularProgress
} from '@mui/material';
import { inputSx, switchSx } from '@/admin/theme/Input.styles'
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

import { useGetUserById, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers'; 
import { UserPayloadSchema, type UserPayload } from '../schemas/userPayload.schema';
import { cleanPatchPayload } from '@/admin/utils/cleanPayloadUtils';

function UsersForm() {
   const { id } = useParams();
   const navigate = useNavigate();
   
   const isEditMode = id && id !== 'nuevo';
   const [isEditable, setIsEditable] = useState(!isEditMode);
   const [formData, setFormData] = useState<Partial<UserPayload>>({
      username: '',
      email: '',
      password: '',
      name: '',
      surnames: '',
      rol: '',
      status: false,
      img: null,
   });
   const [fieldsErrors, setFieldsErrors] = useState<Record<string, string>>({});
   const [mainError, setMainError] = useState('');

   const { data: userData, isLoading: isFetchingUser } = useGetUserById(isEditMode ? id : undefined);

   const createMutation = useCreateUser();
   const updateMutation = useUpdateUser();
   const deleteMutation = useDeleteUser();

   useEffect(() => {
      if (isEditMode && userData) {
         setFormData({
            username: userData.username,
            email: userData.email,
            password: '',
            name: userData.name,
            surnames: userData.surnames,
            rol: userData.rol,
            status: userData.status,
            img: userData.img,
         });
      }
   }, [userData, isEditMode]);

   const handleInputChange = (field: keyof UserPayload, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (fieldsErrors[field]) setFieldsErrors(prev => ({ ...prev, [field]: '' }));
   };

   const handleCancel = () => navigate(ROUTES_PATHS.ADMIN_USERS);

   const handleSave = () => {
      setMainError('');
      setFieldsErrors({});

      const result = UserPayloadSchema.safeParse(formData);
      if (!result.success) {
         const formattedErrors: Record<string, string> = {};
         result.error.issues.forEach((issue) => {
            const fieldName = String(issue.path[0]);
            formattedErrors[fieldName] = issue.message;
         });

         setFieldsErrors(formattedErrors);
         return;
      }

      if (isEditMode) {
         const payloadToUpdate = cleanPatchPayload(result.data, userData, ['password']);

         if (Object.keys(payloadToUpdate).length === 0) {;
            navigate(ROUTES_PATHS.ADMIN_USERS);
            return;
         }

         updateMutation.mutate(
            { id: id!, data: payloadToUpdate },
            {
               onSuccess: () => navigate(ROUTES_PATHS.ADMIN_USERS),
               onError: (error: Error) => setMainError(error.message)
            }
         );
      } 
      else {
         if (result.data.password === '') {
            setFieldsErrors({ password: 'La contraseña es requerida para crear un usuario' });
            return;
         }

         createMutation.mutate(
            result.data,
            {
               onSuccess: () => navigate(ROUTES_PATHS.ADMIN_USERS),
               onError: (error: Error) => setMainError(error.message)
            }
         );
      }
   };

   const handleDelete = () => {
      if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
         deleteMutation.mutate(id!, {
            onSuccess: () => navigate(ROUTES_PATHS.ADMIN_USERS),
            onError: (error: Error) => setMainError(error.message)
         });
      }
   };

   // Variable para saber si alguna mutación está cargando y bloquear botones
   const isSaving = createMutation.isPending || updateMutation.isPending;

   // PANTALLA DE CARGA INICIAL
   if (isFetchingUser) {
      return (
         <Box sx={{ height: '600px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', 
         bgcolor: 'rgba(20, 20, 20, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)', 
         borderRadius: 1, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)', p: 4 }}>
            <Typography variant='h6' sx={{ color: 'white', fontWeight: 600 }}>Cargando...</Typography>
            <CircularProgress color='primary' sx={{ ml: 2 }} />
         </Box>
      );
   }

   return (
      <Box sx={{ height: '600px', width: '100%', maxHeight: '100%', bgcolor: 'rgba(20, 20, 20, 0.6)', 
         backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: 1,
         display: 'flex', flexDirection: 'column', p: 2, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
         justifyContent: 'space-between', alignItems: 'center', position: 'relative'}}>
         
         <Typography variant='h5' sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
         </Typography>
         
         {isEditMode && (
         <Stack sx={{position: 'absolute', top: 0, right: 0, p: 2, gap: 2}}>
            <Button sx={{ color: 'white', bgcolor: 'rgb(72, 177, 121)', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
               aspectRatio: '1 / 1', borderRadius: '5%' }} onClick={() => setIsEditable(prev => !prev)} disabled={isSaving}>
               {isEditable ? <IoIosCloseCircle size={24}/> : <FaEdit size={24}/>}
            </Button>
            <Button sx={{ color: 'white', bgcolor: 'rgba(255, 0, 0, 1)', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
               aspectRatio: '1 / 1', borderRadius: '5%' }} onClick={handleDelete} disabled={deleteMutation.isPending || isSaving}>
               <MdDeleteForever size={24}/>
            </Button>
         </Stack>)}

         {mainError &&
            <Box sx={{ height: 'auto', width: 'auto', maxWidth: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center',
               bgcolor: 'rgba(20, 20, 20, 0.6)', backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: 1, 
               boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.5)', p: 2, position: 'absolute', zIndex: 10 }}>
               <Typography sx={{ color: 'red', fontWeight: 600 }}>{mainError}</Typography>
            </Box>
         }

         <Stack maxWidth={'60%'} width={'100%'} direction={'column'} alignItems={'center'} gap={2} mb={2}>
            <Stack width={'100%'} direction={'row'} gap={2}>
               {/* Campos de usuario y contraseña */}
               <Stack sx={{ width: '100%' }}>
                  <TextField name='username' label='Usuario' fullWidth sx={inputSx} value={formData?.username || ''} 
                  onChange={(e) => handleInputChange('username', e.target.value)} 
                  error={!!fieldsErrors.username} helperText={fieldsErrors.username} disabled={!isEditable}/>

                  <TextField name='password' type='password' label='Contraseña' fullWidth sx={inputSx} 
                  value={formData?.password || ''} 
                  onChange={(e) => handleInputChange('password', e.target.value)} 
                  error={!!fieldsErrors.password} helperText={fieldsErrors.password} disabled={!isEditable}/>
               </Stack>

               {/* Avatar */}
               <Stack sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Avatar src={formData.img || '/default-avatar.png'} 
                  sx={{ width: 100, height: 100, mb: 1, border: '2px solid rgba(255, 255, 255, 0.5)' }} />
                  <Button color="secondary" variant="contained" size="small" disabled={!isEditable}>Cambiar foto</Button>
               </Stack>
            </Stack>

            <Stack width={'100%'} direction={'row'} gap={2}>
               <Stack sx={{ width: '100%' }}>
                  <TextField name='email' label='Correo Electrónico' fullWidth sx={inputSx} value={formData?.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  error={!!fieldsErrors.email} helperText={fieldsErrors.email} disabled={!isEditable}/>

                  <FormControl sx={inputSx} error={!!fieldsErrors.rol}>
                     <InputLabel sx={{ fontWeight: 600 }}>Rol</InputLabel>
                     <Select name='rol' value={formData?.rol || ''} label="Rol" disabled={!isEditable}
                        onChange={(e) => handleInputChange('rol', e.target.value)}>
                        <MenuItem value={'estudiante'}>Estudiante</MenuItem>
                        <MenuItem value={'admin'}>Administrador</MenuItem>
                     </Select>
                     {fieldsErrors.rol && <Typography variant="caption" color="error" sx={{ml: 2, mt: 0.5}}>{fieldsErrors.rol}</Typography>}
                  </FormControl>
               </Stack>
               
               <Stack sx={{ width: '100%' }}>
                  <TextField name='name' label='Nombre' fullWidth sx={inputSx} value={formData?.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!fieldsErrors.name} helperText={fieldsErrors.name} disabled={!isEditable}/>

                  <TextField name='surnames' label='Apellido' fullWidth sx={inputSx} value={formData?.surnames || ''} 
                  onChange={(e) => handleInputChange('surnames', e.target.value)} 
                  error={!!fieldsErrors.surnames} helperText={fieldsErrors.surnames} disabled={!isEditable}/>
               </Stack>
            </Stack>
            
            <FormControlLabel 
            control={<Switch color='primary' sx={switchSx} checked={formData?.status || false} 
            onChange={(e) => handleInputChange('status', e.target.checked)} />} 
            label={<Typography sx={{ fontWeight: 600, width: '100%', mx: 1 }}>¿Activo?</Typography>}
            disabled={!isEditable} />
         </Stack>

         <Stack direction={'row'} gap={2} justifyContent={'center'} alignItems={'center'}>
            <Button onClick={handleSave} variant='contained' color='primary' disabled={isSaving || !isEditable}>
               {isSaving ? 'Guardando...' : 'Guardar Usuario'}
            </Button>
            <Button variant='contained' color='warning' onClick={handleCancel} disabled={isSaving}>
               Cancelar
            </Button>
         </Stack>
      </Box>
   );
}
export default UsersForm;