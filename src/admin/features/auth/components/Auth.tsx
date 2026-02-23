import { 
   Box, 
   Container,
   Typography,
   TextField,
   InputAdornment,
   IconButton,
   Button,
   Collapse,
   Slide,
   CircularProgress
} from '@mui/material';

import { RESOURCE_URLS, LOGIN_UI_TEXTS } from '@/admin/core/constants/appConstants';
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { CredentialsSchema } from '../schemas/auth.schema';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import usePageTitle from '@/admin/hooks/usePageTitle';

// --- CONFIGURACIÓN DEL FONDO ANIMADO ---
const floatKeyframes = `
  @keyframes float {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
`;

const ORBS = [
   { size: '550px', top: '-5%', left: '5%', color: 'rgba(79, 70, 229, 0.2)', duration: '18s', delay: '0s' },
   { size: '600px', top: '25%', left: '45%', color: 'rgba(0, 188, 212, 0.2)', duration: '24s', delay: '2s' },
   { size: '500px', top: '60%', left: '-5%', color: 'rgba(79, 70, 229, 0.2)', duration: '20s', delay: '5s' },
   { size: '550px', top: '65%', left: '60%', color: 'rgba(0, 188, 212, 0.2)', duration: '26s', delay: '1s' },
];

function Auth() {
   usePageTitle(LOGIN_UI_TEXTS.PAGE_TITLE);
   const [loginData, setLoginData] = useState({ username: '', password: '' });
   const [showPassword, setShowPassword] = useState(false);
   const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

   const loginMutation = useAuth();

   const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      const result = CredentialsSchema.safeParse(loginData);

      if (!result.success) {
         const errors = result.error.flatten().fieldErrors;
         setFieldErrors({
            username: errors.username ? errors.username[0] : '',
            password: errors.password ? errors.password[0] : '',
         });
         return;
      }

      loginMutation.mutate(result.data);
   };
   
   const handleTogglePassword = () => {
      setShowPassword(!showPassword);
   };

   return (
      <Container
         disableGutters // Importante para que el Container no agregue padding extra y ocupe todo
         sx={{
            position: 'relative', // Necesario para posicionar las luces relativas al contenedor
            overflow: 'hidden',   // Evita que las luces animadas generen scroll en la ventana
            minHeight: '100dvh',
            minWidth: '100dvw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // FONDO PROFUNDO: Degradado nocturno base
            background: 'linear-gradient(135deg, #020617 0%, #1E1B4B 100%)', 
            padding: 2, // Un poco de espacio para móviles
         }}
      >
         {/* INYECTAMOS LOS KEYFRAMES DE ANIMACIÓN */}
         <style>{floatKeyframes}</style>

         {/* CAPA DE ESFERAS FLOTANTES (Fondo Animado) */}
         <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
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
                     filter: 'blur(80px)', // El desenfoque masivo convierte los círculos en auras
                     animation: `float ${orb.duration} ease-in-out infinite`,
                     animationDelay: orb.delay,
                  }}
               />
            ))}
         </Box>

         {/* FORMULARIO */}
         <Slide direction="down" in={true} timeout={300} mountOnEnter unmountOnExit>
            <Box
               component="form"
               onSubmit={handleSubmit}
               sx={{
                  position: 'relative', // Requerido para que zIndex funcione
                  zIndex: 1, // Mantiene la tarjeta por encima de las luces de fondo

                  // EL EFECTO GLASSMORPHISM (Vidrio Esmerilado)
                  backgroundColor: 'rgba(0, 0, 0, 0.2)', // Súper transparente
                  backdropFilter: 'blur(20px)', // El desenfoque del fondo
                  WebkitBackdropFilter: 'blur(20px)', // Soporte para Safari
                  border: '1px solid rgba(255, 255, 255, 0.2)', // Borde de cristal
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', // Sombra profunda
                  
                  padding: { xs: '2rem', md: '3rem' }, // Más espacio en escritorio
                  borderRadius: '24px', // Esquinas redondeadas del diseño
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '450px',
               }}
            >
               {/* 1. EL LOGO O ESCUDO */}
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

               {/* 2. TÍTULOS LIMPIOS (Adaptados a modo oscuro) */}
               <Typography
                  variant="h4" 
                  sx={{ fontWeight: 'bold', mb: 1, color: '#FFFFFF' }} // Texto blanco
               >
                  {LOGIN_UI_TEXTS.LOGIN_TITLE}
               </Typography>
               <Typography
                  variant="body1"
                  sx={{ mb: 4, color: '#94A3B8' }} // Subtítulo gris azulado
               >
                  Acceso exclusivo para administradores
               </Typography>

               {/* 3. INPUTS (El Theme global se encarga de los estilos) */}
               <TextField
                  name="username"
                  value={loginData.username}
                  error={!!fieldErrors.username}
                  helperText={fieldErrors.username}
                  onChange={(e) => {
                     setLoginData({ ...loginData, username: e.target.value });
                     setFieldErrors({ ...fieldErrors, username: '' });
                  }}
                  fullWidth
                  label={LOGIN_UI_TEXTS.USERNAME_LABEL}
                  placeholder={LOGIN_UI_TEXTS.USERNAME_PLACEHOLDER}
                  variant="outlined"
                  margin="normal"
                  slotProps={{
                     input: {
                        startAdornment: (
                           <InputAdornment position="start">
                              {/* Quitamos el color quemado para que herede del Theme (#94A3B8) */}
                              <FaUser /> 
                           </InputAdornment>
                        ),
                     },
                  }}
               />

               <TextField
                  name="password"
                  value={loginData.password}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  onChange={(e) => {
                     setLoginData({ ...loginData, password: e.target.value });
                     setFieldErrors({ ...fieldErrors, password: '' });
                  }}
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
                                 sx={{ color: '#94A3B8' }} // Aseguramos el color del icono
                              >
                                 {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </IconButton>
                           </InputAdornment>
                        ),
                     },
                  }}
               />

               {/* 4. BOTÓN (Con degradado Cyan/Morado que brilla) */}
               <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loginMutation.isPending}
                  sx={{
                     mt: 4,
                     height: '48px', 
                     borderRadius: '12px',
                     fontWeight: 'bold',
                     textTransform: 'none', 
                     fontSize: '16px',
                     background: 'linear-gradient(90deg, #4F46E5 0%, #00BCD4 100%)',
                     color: 'white',
                     boxShadow: '0 4px 15px rgba(0, 188, 212, 0.3)', // Sombra cyan brillante
                     '&:hover': {
                        background: 'linear-gradient(90deg, #4338CA 0%, #0891B2 100%)',
                        boxShadow: '0 6px 20px rgba(0, 188, 212, 0.4)',
                     },
                     // Ajuste para cuando está deshabilitado en modo oscuro
                     '&.Mui-disabled': {
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.3)'
                     }
                  }}
               >
                  {/* 6. SPINNER DE CARGA */}
                  {
                     loginMutation.isPending ? (
                        <CircularProgress sx={{ color: '#00BCD4' }} size={28} />
                     ):
                        LOGIN_UI_TEXTS.LOGIN_BUTTON
                  }
               </Button>

               {/* 5. SECCIÓN DE ALERTAS DE ERROR (Modo Oscuro) */}
               <Collapse in={!!loginMutation.error && !loginMutation.isPending} timeout={200}>
                  <div> 
                     <Box
                        sx={{
                           mt: 3,
                           minHeight: '3em',
                           bgcolor: 'rgba(239, 68, 68, 0.1)', // Fondo rojo translúcido
                           borderRadius: '8px',
                           border: '1px solid rgba(239, 68, 68, 0.3)', // Borde rojo tenue
                           p: 1.5,
                           display: 'flex',
                           justifyContent: 'center',
                           alignItems: 'center',
                        }}
                     >
                        <Typography sx={{ color: '#FCA5A5', fontWeight: 500, fontSize: '14px' }}>
                           {loginMutation.error?.detail || loginMutation.error?.message}
                        </Typography>
                     </Box>
                  </div>
               </Collapse>
            </Box>
         </Slide>
      </Container>
   );
}

export default Auth;