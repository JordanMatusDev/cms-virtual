import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import {
   Box,
   Stack,
   Button,
   Typography,
   Avatar,
   Tooltip,
   TextField,
   FormControl,
   InputLabel,
   Select,
   type SelectChangeEvent,
   MenuItem,
   InputAdornment,
} from '@mui/material';
import {
   DataGrid,
   type GridColDef,
   type GridPaginationModel,
   type GridRowParams,
} from '@mui/x-data-grid';
import { type User } from '../schemas/user.schema';
import { useGetUsers } from '../hooks/useUsers';
import { useUsersFilter } from '../hooks/useUsersFilter';
import { ROUTES_PATHS } from '@/admin/routes/AdminRoutes.constants';
import { USERS_PAGE_HEADERS } from '@/admin/core/constants/appConstants';
import { IoReloadCircle } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import AdminPageLoader from '@/admin/core/components/AdminPageLoader';

const USERS_PAGINATION_STORAGE_KEY = 'admin.users.paginationModel';
const USERS_GO_LAST_PAGE_KEY = 'admin.users.goLastPage';
const DEFAULT_PAGINATION_MODEL: GridPaginationModel = { page: 0, pageSize: 5 };
const PAGE_SIZE_OPTIONS = [5, 10, 15];

function UsersList() {
   const {
      data: users,
      isError,
      isLoading,
      error,
      refetch,
      isFetching,
   } = useGetUsers();
   const navigate = useNavigate();
   const {
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      roleFilter,
      setRoleFilter,
      roles,
      filteredUsers,
   } = useUsersFilter(users ?? []);

   const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
      () => {
         if (typeof window === 'undefined') {
            return DEFAULT_PAGINATION_MODEL;
         }

         const savedModel = window.sessionStorage.getItem(
            USERS_PAGINATION_STORAGE_KEY
         );

         if (!savedModel) {
            return DEFAULT_PAGINATION_MODEL;
         }

         try {
            const parsed = JSON.parse(
               savedModel
            ) as Partial<GridPaginationModel>;
            const savedPage = Number(parsed.page);
            const savedPageSize = Number(parsed.pageSize);

            return {
               page:
                  Number.isInteger(savedPage) && savedPage >= 0 ? savedPage : 0,
               pageSize:
                  Number.isInteger(savedPageSize) && savedPageSize > 0
                     ? savedPageSize
                     : DEFAULT_PAGINATION_MODEL.pageSize,
            };
         } catch {
            return DEFAULT_PAGINATION_MODEL;
         }
      }
   );

   const totalPages = Math.max(
      1,
      Math.ceil(filteredUsers.length / paginationModel.pageSize)
   );

   const handleStatusFilterChange = (event: SelectChangeEvent) => {
      setStatusFilter(event.target.value as 'all' | 'active' | 'inactive');
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
   };

   const handleRoleFilterChange = (event: SelectChangeEvent) => {
      setRoleFilter(event.target.value);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
   };

   useEffect(() => {
      if (paginationModel.page > totalPages - 1) {
         setPaginationModel((prev) => ({
            ...prev,
            page: Math.max(0, totalPages - 1),
         }));
      }
   }, [paginationModel.page, totalPages]);

   useEffect(() => {
      if (typeof window === 'undefined') {
         return;
      }

      window.sessionStorage.setItem(
         USERS_PAGINATION_STORAGE_KEY,
         JSON.stringify(paginationModel)
      );
   }, [paginationModel]);

   useEffect(() => {
      if (typeof window === 'undefined' || isLoading || !!error) {
         return;
      }

      const shouldGoLastPage =
         window.sessionStorage.getItem(USERS_GO_LAST_PAGE_KEY) === 'true';

      if (!shouldGoLastPage) {
         return;
      }

      setPaginationModel((prev) => ({
         ...prev,
         page: Math.max(0, totalPages - 1),
      }));
      window.sessionStorage.removeItem(USERS_GO_LAST_PAGE_KEY);
   }, [isLoading, error, totalPages]);

   const columns: GridColDef[] = [
      { field: 'id', headerName: USERS_PAGE_HEADERS.ID, width: 100 },
      {
         field: 'user_display',
         headerName: USERS_PAGE_HEADERS.USERNAME,
         width: 300,
         renderCell: (params) => (
            <Stack
               direction="row"
               spacing={2}
               alignItems="center"
               sx={{ height: '100%' }}
            >
               <Avatar
                  src={
                     params.row.avatar !== 'N/A' ? params.row.avatar : undefined
                  }
                  sx={{
                     bgcolor: '#312E81',
                     color: '#A5B4FC',
                     fontWeight: 'bold',
                     width: 40,
                     height: 40,
                  }}
               >
                  {params.row.name.charAt(0)}
               </Avatar>
               <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
               >
                  <Typography
                     sx={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#F8FAFC',
                     }}
                  >
                     {params.row.name} {params.row.lastName}
                  </Typography>
                  <Typography
                     variant="caption"
                     sx={{ color: '#94A3B8', fontSize: '13px' }}
                  >
                     {params.row.email}
                  </Typography>
               </Box>
            </Stack>
         ),
         valueGetter: (_v, row) => `${row.name} ${row.lastName}`,
      },
      { field: 'email', headerName: USERS_PAGE_HEADERS.EMAIL, width: 200 },
      { field: 'role', headerName: USERS_PAGE_HEADERS.ROLE, width: 150 },
      {
         field: 'active',
         headerName: USERS_PAGE_HEADERS.STATUS,
         width: 120,
         renderCell: (params) => (
            <Box display="flex" alignItems="center" height="100%">
               <Typography
                  sx={{
                     bgcolor: params.value
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                     color: params.value ? '#10B981' : '#94A3B8',
                     px: 1.5,
                     py: 0.5,
                     borderRadius: '16px',
                     fontSize: '12px',
                     fontWeight: 500,
                     textAlign: 'center',
                  }}
               >
                  {params.value ? 'Active' : 'Inactive'}
               </Typography>
            </Box>
         ),
      },
      {
         field: 'verification',
         headerName: USERS_PAGE_HEADERS.VERIFICATION,
         width: 150,
         renderCell: (params) => (
            <Box display="flex" alignItems="center" height="100%">
               <Typography
                  sx={{
                     bgcolor: params.value
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(245, 158, 11, 0.1)',
                     color: params.value ? '#3B82F6' : '#F59E0B',
                     px: 1.5,
                     py: 0.5,
                     borderRadius: '16px',
                     fontSize: '12px',
                     fontWeight: 500,
                     textAlign: 'center',
                  }}
               >
                  {params.value ? 'Verificado' : 'Pendiente'}
               </Typography>
            </Box>
         ),
      },
      {
         field: 'createdAt',
         headerName: USERS_PAGE_HEADERS.CREATED_AT,
         width: 150,
      },
      {
         field: 'lastAccess',
         headerName: USERS_PAGE_HEADERS.LAST_ACCESS,
         width: 150,
      },
   ];

   const rows = filteredUsers.map((user: User) => ({
      username: user.username,
      name: user.name || 'N/A',
      lastName: user.surnames || 'N/A',
      email: user.email,
      role: user.rol,
      active: user.status,
      verification: user.verification,
      avatar: user.img || 'N/A',
      createdAt: new Date(user.created_at).toLocaleDateString('es-ES', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
      }),
      lastAccess: new Date(user.last_used_at).toLocaleDateString('es-ES', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
      }),
      id: user.id,
   }));

   const handleRowClick = (params: GridRowParams) => {
      const userToEdit = users?.find((u) => u.id === params.id);
      const userUrl = ROUTES_PATHS.ADMIN_USERS_FORM.replace(
         ':id',
         String(userToEdit?.id)
      );
      navigate(userUrl);
   };

   const handleUserForm = () => {
      navigate(ROUTES_PATHS.ADMIN_USERS_FORM.replace(':id', 'nuevo'));
   };

   if (isLoading) {
      return <AdminPageLoader message="Cargando información de usuarios..." />;
   }

   return (
      <Box
         sx={{
            px: 1,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
         }}
      >
         {/* ENCABEZADO: Títulos a la izquierda, botones a la derecha */}
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'flex-start',
               mb: 3,
            }}
         >
            <Box>
               <Typography
                  variant="h5"
                  sx={{ color: '#F8FAFC', fontWeight: 'bold', mb: 0.5 }}
               >
                  Gestión de Usuarios
               </Typography>
               <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Administra los usuarios del sistema
               </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
               <Tooltip
                  title="Recargar lista de usuarios"
                  placement="left"
                  arrow
               >
                  <Button
                     color="inherit"
                     disabled={isLoading || isFetching}
                     onClick={() => refetch()}
                     sx={{ color: '#94A3B8', minWidth: 'auto', p: 1 }}
                  >
                     <IoReloadCircle size={28} />
                  </Button>
               </Tooltip>

               <Button
                  variant="contained"
                  disabled={isLoading || isFetching}
                  onClick={handleUserForm}
                  sx={{
                     bgcolor: '#4F46E5',
                     color: 'white',
                     borderRadius: '8px',
                     textTransform: 'none',
                     fontWeight: 600,
                     px: 3,
                     py: 1,
                     '&:hover': { bgcolor: '#4338CA' },
                  }}
               >
                  <FaPlus size={16} style={{ marginRight: 8 }} />
                  Nuevo Usuario
               </Button>
            </Stack>
         </Box>

         <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ mb: 3 }}
         >
            <TextField
               value={searchTerm}
               onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
               }}
               placeholder="Buscar por nombre, email, usuario o rol"
               size="small"
               fullWidth
               sx={{
                  '& .MuiOutlinedInput-root': {
                     color: '#F8FAFC',
                     bgcolor: '#1E293B',
                     '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                     '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.30)',
                     },
                     '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  },
                  '& .MuiInputBase-input::placeholder': {
                     color: '#94A3B8',
                     opacity: 1,
                  },
               }}
               slotProps={{
                  input: {
                     startAdornment: (
                        <InputAdornment position="start">
                           <FaSearch size={14} color="#94A3B8" />
                        </InputAdornment>
                     ),
                  },
               }}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
               <InputLabel sx={{ color: '#94A3B8' }}>Estado</InputLabel>
               <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={handleStatusFilterChange}
                  sx={{
                     color: '#F8FAFC',
                     bgcolor: '#1E293B',
                     '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.15)',
                     },
                     '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.30)',
                     },
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4F46E5',
                     },
                     '& .MuiSvgIcon-root': { color: '#94A3B8' },
                  }}
               >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="inactive">Inactivos</MenuItem>
               </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
               <InputLabel sx={{ color: '#94A3B8' }}>Rol</InputLabel>
               <Select
                  value={roleFilter}
                  label="Rol"
                  onChange={handleRoleFilterChange}
                  sx={{
                     color: '#F8FAFC',
                     bgcolor: '#1E293B',
                     '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.15)',
                     },
                     '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.30)',
                     },
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4F46E5',
                     },
                     '& .MuiSvgIcon-root': { color: '#94A3B8' },
                  }}
               >
                  <MenuItem value="all">Todos los roles</MenuItem>
                  {roles.map((role) => (
                     <MenuItem key={role} value={role}>
                        {role}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
         </Stack>

         {/* MENSAJE DE ERROR */}
         {error && (
            <Typography sx={{ color: '#EF4444', fontWeight: 600, mb: 2 }}>
               {`Error al cargar usuarios: ${error.message || 'Error desconocido'}`}
            </Typography>
         )}

         {/* CONTENEDOR DE LA TABLA */}
         {!isError && (
            <Box
               sx={{
                  bgcolor: '#1E293B',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  flexGrow: 1,
                  boxShadow:
                     '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
               }}
            >
               <DataGrid
                  rows={rows}
                  onRowClick={handleRowClick}
                  columns={columns}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  loading={isLoading}
                  rowHeight={72}
                  pageSizeOptions={PAGE_SIZE_OPTIONS}
                  isCellEditable={() => false}
                  disableRowSelectionOnClick
                  localeText={{
                     noRowsLabel:
                        'No se encontraron usuarios con los filtros aplicados.',
                  }}
               />
            </Box>
         )}
      </Box>
   );
}

export default UsersList;
