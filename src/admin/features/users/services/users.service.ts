import api, {API_BASE_URL, API_ENDPOINTS} from "@/admin/core/config/apiConfig";
import { type User, UserSchema} from "../schemas/user.schema";
import { type UserPayload } from "../schemas/userPayload.schema";
import { z } from "zod";

export const usersService = {
   getUsers: async (): Promise<User[]> => {
      const { data } = await api.get(`${API_BASE_URL}${API_ENDPOINTS.USERS}`);
      return z.array(UserSchema).parse(data);
   },

   getUserById: async (id: string): Promise<User> => {
      const { data } = await api.get(`${API_BASE_URL}${API_ENDPOINTS.USERS}${id}`);
      return UserSchema.parse(data);
   },

   postUser: async (payload: UserPayload): Promise<User> => {
      const { data } = await api.post(`${API_BASE_URL}${API_ENDPOINTS.USERS}`, payload);
      return UserSchema.parse(data);
   },

   patchUser: async (id: string, payload: Partial<UserPayload>): Promise<User> => {
      const { data } = await api.patch(`${API_BASE_URL}${API_ENDPOINTS.USERS}${id}`, payload);
      return UserSchema.parse(data);
   },

   deleteUser: async (id: string): Promise<void> => {
      await api.delete(`${API_BASE_URL}${API_ENDPOINTS.USERS}${id}`);
   },

   postUserAvatar: async (user_id: string, file: File): Promise<User> => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(`${API_BASE_URL}${API_ENDPOINTS.AVATAR.replace('{userId}', user_id)}`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
      return UserSchema.parse(data);
   }
}