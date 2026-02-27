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
import { useGetUsers } from '@/admin/features/users/hooks/useUsers';
import { useGetCourses } from '@/admin/features/courses/hooks/useCourse';
import AdminPageLoader from '@/admin/core/components/AdminPageLoader';

function HomePage() {
    const navigate = useNavigate();
    const {
        data: users = [],
        isLoading: isLoadingUsers,
        isFetching: isFetchingUsers,
        refetch: refetchUsers,
    } = useGetUsers();
    const {
        data: courses = [],
        isLoading: isLoadingCourses,
        isFetching: isFetchingCourses,
        refetch: refetchCourses,
    } = useGetCourses();

    const isRefreshing = isFetchingUsers || isFetchingCourses;

    const handleRefresh = async () => {
        await Promise.all([refetchUsers(), refetchCourses()]);
    };

    const totals = useMemo(() => {
        const totalUsers = users.length;
        const activeUsers = users.filter((user) => user.status).length;
        const inactiveUsers = totalUsers - activeUsers;

        const totalCourses = courses.length;
        const activeCourses = courses.filter((course) => course.activo).length;
        const inactiveCourses = totalCourses - activeCourses;

        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalCourses,
            activeCourses,
            inactiveCourses,
        };
    }, [users, courses]);

    if (isLoadingUsers || isLoadingCourses) {
        return <AdminPageLoader message="Cargando información del panel..." />;
    }

    return (
        <Box sx={{ px: 1, pb: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 'bold', mb: 0.5 }}>
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
                    <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                        <CardActionArea
                            onClick={() => navigate(ROUTES_PATHS.ADMIN_USERS_FORM.replace(':id', 'nuevo'))}
                            sx={{ borderRadius: '12px' }}
                        >
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ color: '#A5B4FC' }}>
                                        <FaUserPlus size={22} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                                            Crear usuario
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                            Ir al formulario de nuevo usuario
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                        <CardActionArea
                            onClick={() => navigate(ROUTES_PATHS.ADMIN_COURSES_FORM.replace(':id', 'nuevo'))}
                            sx={{ borderRadius: '12px' }}
                        >
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ color: '#67E8F9' }}>
                                        <FaBookMedical size={22} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                                            Crear curso
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
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
                    <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                <FaUsers color="#10B981" />
                                <Typography sx={{ color: '#94A3B8' }}>Usuarios activos</Typography>
                            </Stack>
                            <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                {isLoadingUsers ? '--' : totals.activeUsers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                <FaBookOpen color="#10B981" />
                                <Typography sx={{ color: '#94A3B8' }}>Cursos activos</Typography>
                            </Stack>
                            <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                {isLoadingCourses ? '--' : totals.activeCourses}
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
                            <TableCell sx={{ color: '#F8FAFC', fontWeight: 700 }}>Métrica</TableCell>
                            <TableCell sx={{ color: '#F8FAFC', fontWeight: 700 }} align="right">Total</TableCell>
                            <TableCell sx={{ color: '#F8FAFC', fontWeight: 700 }} align="right">Activos</TableCell>
                            <TableCell sx={{ color: '#F8FAFC', fontWeight: 700 }} align="right">Inactivos</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ color: '#CBD5E1' }}>Usuarios</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }} align="right">
                                {isLoadingUsers ? '--' : totals.totalUsers}
                            </TableCell>
                            <TableCell sx={{ color: '#10B981' }} align="right">
                                {isLoadingUsers ? '--' : totals.activeUsers}
                            </TableCell>
                            <TableCell sx={{ color: '#EF4444' }} align="right">
                                {isLoadingUsers ? '--' : totals.inactiveUsers}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ color: '#CBD5E1' }}>Cursos</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }} align="right">
                                {isLoadingCourses ? '--' : totals.totalCourses}
                            </TableCell>
                            <TableCell sx={{ color: '#10B981' }} align="right">
                                {isLoadingCourses ? '--' : totals.activeCourses}
                            </TableCell>
                            <TableCell sx={{ color: '#EF4444' }} align="right">
                                {isLoadingCourses ? '--' : totals.inactiveCourses}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default HomePage;