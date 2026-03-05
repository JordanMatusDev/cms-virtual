import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from 'react-router';
import { useGetStats } from '@/admin/features/home';
import AdminPageLoader from '@/admin/core/components/AdminPageLoader';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';

const formatAxisLabel = (title: string) => {
   const words = title.split(' ');
   const lines: string[] = [];
   let currentLine = '';

   for (const word of words) {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;

      if (nextLine.length <= 16) {
         currentLine = nextLine;
      } else {
         if (currentLine) {
            lines.push(currentLine);
         }
         currentLine = word;
      }
   }

   if (currentLine) {
      lines.push(currentLine);
   }

   return lines.slice(0, 3).join('\n');
};

function stats() {
   const navigate = useNavigate();
   const { data, isLoading } = useGetStats();
   const topCourses = data?.top_courses?.slice(0, 5) ?? [];

   const handleBarClick = (dataIndex: number | null) => {
      if (dataIndex === null || dataIndex < 0) {
         return;
      }

      const course = topCourses[dataIndex];
      if (!course) {
         return;
      }

      navigate(
         ROUTES_PATHS.ADMIN_COURSES_FORM.replace(
            ':id',
            String(course.course_id)
         )
      );
   };

   if (isLoading) {
      return <AdminPageLoader message="Cargando estadísticas..." />;
   }

   return (
      <Box
         sx={{ px: 1, pb: 1, display: 'flex', flexDirection: 'column', gap: 3 }}
      >
         <Box>
            <Typography
               variant="h5"
               sx={{ color: '#F8FAFC', fontWeight: 'bold', mb: 0.5 }}
            >
               Estadísticas
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
               Resumen visual del estado de usuarios, registros y cursos con más
               actividad
            </Typography>
         </Box>

         <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
               <Card
                  sx={{
                     bgcolor: '#1E293B',
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '12px',
                  }}
               >
                  <CardContent>
                     <Stack
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           justifyContent: 'center',
                           gap: 1,
                        }}
                     >
                        <Typography
                           variant="h6"
                           sx={{ color: '#F8FAFC', fontWeight: 700 }}
                        >
                           Estadísticas de usuarios
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                           Activos vs Inactivos vs Verificados
                        </Typography>
                        <PieChart
                           series={[
                              {
                                 data: [
                                    {
                                       id: 0,
                                       value: data?.users.active || 0,
                                       label: 'Activos',
                                       color: '#10B981',
                                    },
                                    {
                                       id: 1,
                                       value:
                                          (data?.overview.total_users || 0) -
                                          (data?.users.active || 0),
                                       label: 'Inactivos',
                                       color: '#EF4444',
                                    },
                                    {
                                       id: 2,
                                       value: data?.users.verified || 0,
                                       label: 'Verificados',
                                       color: '#F59E0B',
                                    },
                                 ],
                                 innerRadius: 40,
                                 outerRadius: 95,
                                 paddingAngle: 2,
                              },
                           ]}
                           width={280}
                           height={260}
                        />
                     </Stack>
                  </CardContent>
               </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
               <Card
                  sx={{
                     bgcolor: '#1E293B',
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '12px',
                  }}
               >
                  <CardContent>
                     <Stack
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           justifyContent: 'center',
                           gap: 1,
                        }}
                     >
                        <Typography
                           variant="h6"
                           sx={{ color: '#F8FAFC', fontWeight: 700 }}
                        >
                           Estadísticas de registros
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                           Total vs Finalizados
                        </Typography>
                        <PieChart
                           series={[
                              {
                                 data: [
                                    {
                                       id: 0,
                                       value: data?.registrations.total || 0,
                                       label: 'Totales',
                                       color: '#38BDF8',
                                    },
                                    {
                                       id: 1,
                                       value: data?.registrations.finished || 0,
                                       label: 'Finalizados',
                                       color: '#22C55E',
                                    },
                                    {
                                       id: 2,
                                       value:
                                          data?.registrations.in_progress || 0,
                                       label: 'En progreso',
                                    },
                                    {
                                       id: 3,
                                       value:
                                          data?.registrations
                                             .with_certificate || 0,
                                       label: 'Con certificado',
                                       color: '#FBBF24',
                                    },
                                 ],
                                 innerRadius: 40,
                                 outerRadius: 95,
                                 paddingAngle: 2,
                              },
                           ]}
                           width={280}
                           height={260}
                        />
                     </Stack>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>

         <Card
            sx={{
               bgcolor: '#1E293B',
               border: '1px solid rgba(255,255,255,0.1)',
               borderRadius: '12px',
            }}
         >
            <CardContent>
               <Stack spacing={1}>
                  <Typography
                     variant="h6"
                     sx={{ color: '#F8FAFC', fontWeight: 700 }}
                  >
                     Cursos con más registros
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                     Top 5 cursos por cantidad de registros
                  </Typography>

                  {topCourses.length > 0 ? (
                     <Box sx={{ mt: 1 }}>
                        <BarChart
                           onItemClick={(_, itemIdentifier) =>
                              handleBarClick(itemIdentifier.dataIndex)
                           }
                           xAxis={[
                              {
                                 scaleType: 'band',
                                 data: topCourses.map((course) => course.title),
                                 valueFormatter: (value) =>
                                    formatAxisLabel(String(value)),
                                 tickLabelStyle: {
                                    fill: '#CBD5E1',
                                    fontSize: 11,
                                 },
                              },
                           ]}
                           yAxis={[{ min: 0 }]}
                           series={[
                              {
                                 data: topCourses.map(
                                    (course) => course.registrations_count
                                 ),
                                 label: 'Registros',
                                 color: '#38BDF8',
                              },
                           ]}
                           height={320}
                           margin={{
                              top: 20,
                              right: 20,
                              left: 40,
                              bottom: 110,
                           }}
                        />
                     </Box>
                  ) : (
                     <Typography sx={{ color: '#94A3B8', py: 2 }}>
                        No hay cursos para mostrar
                     </Typography>
                  )}
               </Stack>
            </CardContent>
         </Card>
      </Box>
   );
}

export default stats;
