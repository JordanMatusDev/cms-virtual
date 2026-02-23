import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { usersService } from "../services/users.service";
import { type UserPayload } from "../schemas/userPayload.schema";

export const useGetUsers = () => {
   return useQuery({
      queryKey: ['Users'],
      queryFn: usersService.getUsers
   })
}

export const useGetUserById = (id?: string) => {
   return useQuery({
      queryKey: ['User', id],
      queryFn: () => usersService.getUserById(id!),
      enabled: !!id
   })
}

export const useCreateUser = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (userPayload: UserPayload) => usersService.postUser(userPayload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['Users'] });
      }
   })
}

export const useUpdateUser = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ id, data} : { id: string, data: Partial<UserPayload> }) => usersService.patchUser(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['Users'] });
         queryClient.invalidateQueries({ queryKey: ['User', variables.id] });
      }
   })
}

export const useDeleteUser = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (id: string) => usersService.deleteUser(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['Users'] });
      }
   })
}