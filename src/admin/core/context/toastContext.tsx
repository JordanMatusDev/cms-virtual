import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';

type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

type ToastState = {
   open: boolean;
   message: string;
   severity: ToastSeverity;
};

type ToastContextValue = {
   showToast: (message: string, severity?: ToastSeverity) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
   const [toast, setToast] = useState<ToastState>({
      open: false,
      message: '',
      severity: 'info',
   });

   const showToast = useCallback((message: string, severity: ToastSeverity = 'info') => {
      setToast({ open: true, message, severity });
   }, []);

   const handleClose = useCallback(() => {
      setToast((prev) => ({ ...prev, open: false }));
   }, []);

   const value = useMemo(() => ({ showToast }), [showToast]);

   return (
      <ToastContext.Provider value={value}>
         {children}
         <Snackbar
            open={toast.open}
            autoHideDuration={3500}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
         >
            <Alert onClose={handleClose} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
               {toast.message}
            </Alert>
         </Snackbar>
      </ToastContext.Provider>
   );
};

export const useToast = () => {
   const context = useContext(ToastContext);

   if (!context) {
      throw new Error('useToast debe usarse dentro de ToastProvider');
   }

   return context;
};
