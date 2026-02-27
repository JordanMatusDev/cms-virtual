// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation'; 

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00BCD4',
    },
    secondary: {
      main: '#4F46E5',
    },
    background: {
      default: '#0B1120',
      paper: '#1E293B', // Fondo sólido para paneles y menús para legibilidad
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8',
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#94A3B8',
          fontSize: '14px',
          '&.Mui-focused': { color: '#00BCD4' },
          '&.Mui-error': { color: '#EF4444' },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          color: '#FFFFFF',
          transition: 'all 0.3s ease',
          marginBottom: '16px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.25)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00BCD4',
          },
        },
        input: {
          padding: '14px 16px',
        },
      },
    },

    // --- MEJORA ESPECÍFICA PARA LA TABLA (DataGrid) ---
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.4)', // Fondo semi-transparente estilo glass
          color: '#E2E8F0',
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-withBorderColor': {
            borderColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
        // Cabeceras con contraste real
        columnHeader: {
          backgroundColor: '#0F172A', // Fondo más oscuro para separar del contenido
          color: '#FFFFFF',
          '&:focus, &:focus-within': { outline: 'none' },
        },
        columnHeaderTitle: {
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          color: '#F8FAFC',
        },
        // Color de los iconos de la cabecera (Filtro, Ordenar, etc.)
        iconButtonContainer: {
          '& .MuiIconButton-root': {
            color: '#00BCD4', // Iconos en Cyan para que resalten
          },
        },
        sortIcon: {
          color: '#00BCD4',
        },
        cell: {
          '&:focus, &:focus-within': { outline: 'none' },
        },
        // Panel de filtros (El de tu imagen)
        panel: {
          '& .MuiPaper-root': {
            backgroundColor: '#1E293B',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          // Arreglo de inputs dentro del filtro
          '& .MuiOutlinedInput-root': {
            marginBottom: '0 !important', 
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        },
        // Texto de "No results found"
        overlay: {
          color: '#94A3B8',
          fontSize: '1rem',
        },
        // Paginación
        footerContainer: {
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#94A3B8',
        }
      },
    },

    // Global Paper para diálogos y menús
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1E293B',
          borderRadius: '12px',
        }
      }
    },
    
    // Switches e iconos
    MuiSwitch: {
      styleOverrides: {
        thumb: { backgroundColor: '#FFFFFF' },
        track: { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
      },
    },
  },
});