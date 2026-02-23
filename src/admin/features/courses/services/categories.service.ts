import api, { API_BASE_URL, API_ENDPOINTS } from "@/admin/core/config/apiConfig";
import { type Category, CategorySchema } from "../schemas/category.schema";
import { z } from "zod";

export const categoriesService = {
   getCategories: async (): Promise<Category[]> => {
      const { data } = await api.get(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`);
      return z.array(CategorySchema).parse(data);
   }
}