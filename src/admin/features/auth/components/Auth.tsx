import {
   Box,
   Container,
   Typography,
   TextField,
   InputAdornment,
   IconButton,
   Button,
   Slide,
   CircularProgress,
} from '@mui/material';

import {
   RESOURCE_URLS,
   LOGIN_UI_TEXTS,
} from '@/admin/core/constants/appConstants';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { type Credentials, CredentialsSchema } from '../schemas/auth.schema';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import usePageTitle from '@/admin/hooks/usePageTitle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const floatKeyframes = `
  @keyframes float {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
`;

const ORBS = [
   {
      size: '550px',
      top: '-5%',
      left: '5%',
      color: 'rgba(79, 70, 229, 0.2)',
      duration: '18s',
      delay: '0s',
   },
   {
      size: '600px',
      top: '25%',
      left: '45%',
      color: 'rgba(0, 188, 212, 0.2)',
      duration: '24s',
      delay: '2s',
   },
   {
      size: '500px',
      top: '60%',
      left: '-5%',
      color: 'rgba(79, 70, 229, 0.2)',
      duration: '20s',
      delay: '5s',
   },
   {
      size: '550px',
      top: '65%',
      left: '60%',
      color: 'rgba(0, 188, 212, 0.2)',
      duration: '26s',
      delay: '1s',
   },
];

function Auth() {
   usePageTitle(LOGIN_UI_TEXTS.PAGE_TITLE);

   const [showPassword, setShowPassword] = useState(false);
   const loginMutation = useAuth();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<Credentials>({
      resolver: zodResolver(CredentialsSchema),
      defaultValues: {
         username: '',
         password: '',
      },
   });

   const onSubmit = (data: Credentials) => {
      loginMutation.mutate(data);
   };

   const handleTogglePassword = () => {
      setShowPassword(!showPassword);
   };

   return (
      <Container
         disableGutters
         sx={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '100dvh',
            minWidth: '100dvw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #020617 0%, #1E1B4B 100%)',
            padding: 2,
         }}
      >
         <style>{floatKeyframes}</style>

         {/* CAPA DE ESFERAS FLOTANTES (Fondo Animado) */}
         <Box
            sx={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               zIndex: 0,
            }}
         >
            {ORBS.map((orb, index) => (
               <Box
                  key={index}
                  sx={{
                     position: 'absolute',
                     top: orb.top,
                     left: orb.left,
                     width: orb.size,
                     height: orb.size,
                     backgroundColor: orb.color,
                     borderRadius: '50%',
                     filter: 'blur(80px)',
                     animation: `float ${orb.duration} ease-in-out infinite`,
                     animationDelay: orb.delay,
                  }}
               />
            ))}
         </Box>

         {/* FORMULARIO */}
         <Slide
            direction="down"
            in={true}
            timeout={300}
            mountOnEnter
            unmountOnExit
         >
            <Box
               component="form"
               onSubmit={handleSubmit(onSubmit)}
               sx={{
                  position: 'relative',
                  zIndex: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  padding: { xs: '2rem', md: '3rem' },
                  borderRadius: '24px',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '450px',
               }}
            >
               <Box
                  sx={{
                     backgroundImage: `url(${RESOURCE_URLS.LOGO})`,
                     backgroundSize: 'contain',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                     height: '3em',
                     mb: 2,
                  }}
               />

               <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', mb: 1, color: '#FFFFFF' }}
               >
                  {LOGIN_UI_TEXTS.LOGIN_TITLE}
               </Typography>
               <Typography variant="body1" sx={{ mb: 4, color: '#94A3B8' }}>
                  Acceso exclusivo para administradores
               </Typography>

               <TextField
                  {...register('username')}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={loginMutation.status === 'pending'}
                  fullWidth
                  label={LOGIN_UI_TEXTS.USERNAME_LABEL}
                  placeholder={LOGIN_UI_TEXTS.USERNAME_PLACEHOLDER}
                  variant="outlined"
                  margin="normal"
                  slotProps={{
                     input: {
                        startAdornment: (
                           <InputAdornment position="start">
                              <FaUser />
                           </InputAdornment>
                        ),
                     },
                  }}
               />

               <TextField
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loginMutation.status === 'pending'}
                  fullWidth
                  label={LOGIN_UI_TEXTS.PASSWORD_LABEL}
                  placeholder={LOGIN_UI_TEXTS.PASSWORD_PLACEHOLDER}
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  slotProps={{
                     input: {
                        startAdornment: (
                           <InputAdornment position="start">
                              <FaLock />
                           </InputAdornment>
                        ),
                        endAdornment: (
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label={LOGIN_UI_TEXTS.TOGGLE_PASSWORD}
                                 edge="end"
                                 onMouseDown={(e) => e.preventDefault()}
                                 onClick={handleTogglePassword}
                                 sx={{ color: '#94A3B8' }}
                              >
                                 {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </IconButton>
                           </InputAdornment>
                        ),
                     },
                  }}
               />

               <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loginMutation.status === 'pending'}
                  sx={{
                     mt: 4,
                     height: '48px',
                     borderRadius: '12px',
                     fontWeight: 'bold',
                     textTransform: 'none',
                     fontSize: '16px',
                     background:
                        'linear-gradient(90deg, #4F46E5 0%, #00BCD4 100%)',
                     color: 'white',
                     boxShadow: '0 4px 15px rgba(0, 188, 212, 0.3)',
                     '&:hover': {
                        background:
                           'linear-gradient(90deg, #4338CA 0%, #0891B2 100%)',
                        boxShadow: '0 6px 20px rgba(0, 188, 212, 0.4)',
                     },
                     '&.Mui-disabled': {
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.3)',
                     },
                  }}
               >
                  {loginMutation.status === 'pending' ? (
                     <CircularProgress sx={{ color: '#00BCD4' }} size={28} />
                  ) : (
                     LOGIN_UI_TEXTS.LOGIN_BUTTON
                  )}
               </Button>
            </Box>
         </Slide>
      </Container>
   );
}

export default Auth;
