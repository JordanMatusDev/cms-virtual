import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { appTheme } from './admin/theme/appTheme.ts';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastProvider } from './admin/core/context/toastContext.tsx';

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         retry: 1,
         staleTime: 1000 * 60 * 5, // 5 minutos
      }
   }
})

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <ThemeProvider theme={appTheme}>
         <CssBaseline />
         <QueryClientProvider client={queryClient}>
            <ToastProvider>
               <App />
            </ToastProvider>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </ThemeProvider>
   </StrictMode>,
)
