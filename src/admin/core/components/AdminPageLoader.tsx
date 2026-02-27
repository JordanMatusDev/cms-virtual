import { Box, CircularProgress, Typography } from '@mui/material';

type AdminPageLoaderProps = {
   message: string;
};

function AdminPageLoader({ message }: AdminPageLoaderProps) {
   return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
         <CircularProgress sx={{ color: '#4F46E5' }} />
         <Typography sx={{ color: '#94A3B8', mt: 2 }}>{message}</Typography>
      </Box>
   );
}

export default AdminPageLoader;