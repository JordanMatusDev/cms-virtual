import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '../services/categories.service';
import { type CategoryPayload } from '../schemas/category.schema';

export const useGetCategories = () => {
   return useQuery({
      queryKey: ['Categories'],
      queryFn: categoriesService.getCategories,
   });
};

export const useCreateCategory = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (categoryPayload: CategoryPayload) =>
         categoriesService.postCategory(categoryPayload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['Categories'] });
      },
   });
};
