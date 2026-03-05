import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
   Box,
   Button,
   Card,
   CardActionArea,
   CardContent,
   Grid,
   Stack,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Tooltip,
} from '@mui/material';
import { FaUserPlus, FaBookMedical, FaUsers, FaBookOpen } from 'react-icons/fa';
import { IoReloadCircle } from 'react-icons/io5';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { useGetStats } from '../hooks/useStats';
import AdminPageLoader from '@/admin/core/components/AdminPageLoader';

function HomePage() {
   const navigate = useNavigate();
   const {
      data: stats,
      isLoading: isLoadingStats,
      refetch: refetchStats,
   } = useGetStats();

   const isRefreshing = isLoadingStats;

   const handleRefresh = async () => {
      await Promise.all([refetchStats()]);
   };

   const totals = useMemo(() => {
      const totalUsers = stats?.overview.total_users || 0;
      const totalStudents = stats?.overview.total_students || 0;
      const totalAdmins = stats?.overview.total_admins || 0;
      const totalCourses = stats?.overview.total_courses || 0;
      const totalRegistrations = stats?.overview.total_registrations || 0;
      const totalCertificates = stats?.overview.total_certificates || 0;

      return {
         totalUsers,
         totalStudents,
         totalAdmins,
         totalCourses,
         totalRegistrations,
         totalCertificates,
      };
   }, [stats]);

   if (isLoadingStats) {
      return <AdminPageLoader message="Cargando información del panel..." />;
   }

   return (
      <Box
         sx={{ px: 1, pb: 1, display: 'flex', flexDirection: 'column', gap: 3 }}
      >
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               gap: 2,
            }}
         >
            <Box>
               <Typography
                  variant="h5"
                  sx={{ color: '#F8FAFC', fontWeight: 'bold', mb: 0.5 }}
               >
                  Panel principal
               </Typography>
               <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Accesos rápidos y resumen general de usuarios y cursos
               </Typography>
            </Box>

            <Tooltip title="Recargar datos del panel" placement="left" arrow>
               <span>
                  <Button
                     color="inherit"
                     disabled={isRefreshing}
                     onClick={handleRefresh}
                     sx={{ color: '#94A3B8', minWidth: 'auto', p: 1 }}
                  >
                     <IoReloadCircle size={28} />
                  </Button>
               </span>
            </Tooltip>
         </Box>

         <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
               <Card
                  sx={{
                     bgcolor: '#1E293B',
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '12px',
                  }}
               >
                  <CardActionArea
                     onClick={() =>
                        navigate(
                           ROUTES_PATHS.ADMIN_USERS_FORM.replace(':id', 'nuevo')
                        )
                     }
                     sx={{ borderRadius: '12px' }}
                  >
                     <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                           <Box sx={{ color: '#A5B4FC' }}>
                              <FaUserPlus size={22} />
                           </Box>
                           <Box>
                              <Typography
                                 sx={{ color: '#F8FAFC', fontWeight: 700 }}
                              >
                                 Crear usuario
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: '#94A3B8' }}
                              >
                                 Ir al formulario de nuevo usuario
                              </Typography>
                           </Box>
                        </Stack>
                     </CardContent>
                  </CardActionArea>
               </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
               <Card
                  sx={{
                     bgcolor: '#1E293B',
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '12px',
                  }}
               >
                  <CardActionArea
                     onClick={() =>
                        navigate(
                           ROUTES_PATHS.ADMIN_COURSES_FORM.replace(
                              ':id',
                              'nuevo'
                           )
                        )
                     }
                     sx={{ borderRadius: '12px' }}
                  >
                     <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                           <Box sx={{ color: '#67E8F9' }}>
                              <FaBookMedical size={22} />
                           </Box>
                           <Box>
                              <Typography
                                 sx={{ color: '#F8FAFC', fontWeight: 700 }}
                              >
                                 Crear curso
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{ color: '#94A3B8' }}
                              >
                                 Ir al formulario de nuevo curso
                              </Typography>
                           </Box>
                        </Stack>
                     </CardContent>
                  </CardActionArea>
               </Card>
            </Grid>
         </Grid>

         <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
               <Card
                  sx={{
                     bgcolor: '#1E293B',
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '12px',
                  }}
               >
                  <CardContent>
                     <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mb: 1 }}
                     >
                        <FaUsers color="#10B981" />
                        <Typography sx={{ color: '#94A3B8' }}>
                           Total de usuarios
                        </Typography>
                     </Stack>
                     <Typography
                        variant="h4"
                        sx={{ color: '#F8FAFC', fontWeight: 'bold' }}
                     >
                        {isLoadingStats ? '--' : totals.totalUsers}
                     </Typography>
                  </CardContent>
               </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
               <Card
                  sx={{
                     bgcolor: '#1E293B',
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '12px',
                  }}
               >
                  <CardContent>
                     <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mb: 1 }}
                     >
                        <FaBookOpen color="#10B981" />
                        <Typography sx={{ color: '#94A3B8' }}>
                           Total de cursos
                        </Typography>
                     </Stack>
                     <Typography
                        variant="h4"
                        sx={{ color: '#F8FAFC', fontWeight: 'bold' }}
                     >
                        {isLoadingStats ? '--' : totals.totalCourses}
                     </Typography>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>

         <TableContainer
            component={Paper}
            sx={{
               bgcolor: '#1E293B',
               border: '1px solid rgba(255,255,255,0.1)',
               borderRadius: '12px',
               overflow: 'hidden',
            }}
         >
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                        Métrica
                     </TableCell>
                     <TableCell
                        sx={{ color: '#F8FAFC', fontWeight: 700 }}
                        align="right"
                     >
                        Total
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  <TableRow>
                     <TableCell sx={{ color: '#CBD5E1' }}>Admins</TableCell>
                     <TableCell sx={{ color: '#CBD5E1' }} align="right">
                        {isLoadingStats ? '--' : totals.totalAdmins}
                     </TableCell>
                  </TableRow>

                  <TableRow>
                     <TableCell sx={{ color: '#CBD5E1' }}>
                        Estudiantes
                     </TableCell>
                     <TableCell sx={{ color: '#CBD5E1' }} align="right">
                        {isLoadingStats ? '--' : totals.totalStudents}
                     </TableCell>
                  </TableRow>

                  <TableRow>
                     <TableCell sx={{ color: '#CBD5E1' }}>Registros</TableCell>
                     <TableCell sx={{ color: '#CBD5E1' }} align="right">
                        {isLoadingStats ? '--' : totals.totalRegistrations}
                     </TableCell>
                  </TableRow>

                  <TableRow>
                     <TableCell sx={{ color: '#CBD5E1' }}>Certificados</TableCell>
                     <TableCell sx={{ color: '#CBD5E1' }} align="right">
                        {isLoadingStats ? '--' : totals.totalCertificates}
                     </TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </TableContainer>
      </Box>
   );
}

export default HomePage;
