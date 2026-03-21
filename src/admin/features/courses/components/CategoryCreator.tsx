import { useState } from 'react';
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   TextField,
} from '@mui/material';
import { FaPlus } from 'react-icons/fa';
import { useCreateCategory } from '../hooks/useCategories';
import {
   CategoryPayloadSchema,
   type CategoryPayload,
} from '../schemas/category.schema';
import { useToast } from '@/admin/core/context/toastContext';

type CategoryCreatorProps = {
   disabled?: boolean;
};

function CategoryCreator({ disabled = false }: CategoryCreatorProps) {
   const createCategoryMutation = useCreateCategory();
   const { showToast } = useToast();

   const [isOpen, setIsOpen] = useState(false);
   const [newCategoryName, setNewCategoryName] = useState('');
   const [newCategoryError, setNewCategoryError] = useState('');

   const handleOpen = () => {
      setIsOpen(true);
      setNewCategoryError('');
   };

   const handleClose = () => {
      if (createCategoryMutation.isPending) {
         return;
      }

      setIsOpen(false);
      setNewCategoryName('');
      setNewCategoryError('');
   };

   const handleCreateCategory = async () => {
      const trimmedCategoryName = newCategoryName.trim();

      if (!trimmedCategoryName) {
         setNewCategoryError('El nombre de la categoría es requerido');
         return;
      }

      setNewCategoryError('');

      try {
         const categoryPayload: CategoryPayload = CategoryPayloadSchema.parse({
            name: trimmedCategoryName,
            status: true,
         });

         await createCategoryMutation.mutateAsync(categoryPayload);
         showToast('Categoría creada correctamente', 'success');
         handleClose();
      } catch (mutationError: any) {
         const errorMessage =
            mutationError?.message || 'No se pudo crear la categoría';
         setNewCategoryError(errorMessage);
         showToast(errorMessage, 'error');
      }
   };

   return (
      <>
         <Button
            variant="contained"
            disabled={disabled || createCategoryMutation.isPending}
            onClick={handleOpen}
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
            Nueva Categoría
         </Button>

         <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Crear categoría</DialogTitle>
            <DialogContent>
               <DialogContentText sx={{ mb: 2 }}>
                  Ingresa el nombre de la nueva categoría.
               </DialogContentText>
               <TextField
                  autoFocus
                  fullWidth
                  label="Nombre de categoría"
                  value={newCategoryName}
                  onChange={(event) => {
                     setNewCategoryName(event.target.value);
                     if (newCategoryError) {
                        setNewCategoryError('');
                     }
                  }}
                  error={!!newCategoryError}
                  helperText={newCategoryError}
                  disabled={createCategoryMutation.isPending}
               />
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleClose}
                  disabled={createCategoryMutation.isPending}
               >
                  Cancelar
               </Button>
               <Button
                  onClick={handleCreateCategory}
                  variant="contained"
                  disabled={createCategoryMutation.isPending}
                  sx={{ color: 'white' }}
               >
                  {createCategoryMutation.isPending
                     ? 'Guardando...'
                     : 'Guardar'}
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
}

export default CategoryCreator;
