import api from "@/admin/core/config/apiConfig"
import { API_BASE_URL, API_ENDPOINTS } from "@/admin/core/config/apiConfig";
import { type Credentials } from "../schemas/auth.schema";
import { AuthUserResponseSchema } from "@/admin/types/adminLogin";

export const authService = {
   login: async (credentials: Credentials) => {
      const { data } = await api.post(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, credentials);

      return AuthUserResponseSchema.parse(data);
   }
};
