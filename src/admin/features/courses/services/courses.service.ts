import api, { API_BASE_URL, API_ENDPOINTS } from "@/admin/core/config/apiConfig";
import { type Course, CourseSchema } from "../schemas/course.schema";
import { type CoursePayload } from "../schemas/coursePayload.schema";
import { z } from "zod";

export const coursesService = {
   getCourses: async (): Promise<Course[]> => {
      const { data } = await api.get(`${API_BASE_URL}${API_ENDPOINTS.COURSES}`);
      return z.array(CourseSchema).parse(data);
   },

   getCourseById: async (id: string): Promise<Course> => {
      const { data } = await api.get(`${API_BASE_URL}${API_ENDPOINTS.COURSES}${id}`);
      return CourseSchema.parse(data);
   },

   postCourse: async (payload: CoursePayload): Promise<Course> => {
      const { data } = await api.post(`${API_BASE_URL}${API_ENDPOINTS.COURSES}`, payload);
      return CourseSchema.parse(data);
   },

   patchCourse: async (id: string, payload: Partial<CoursePayload>): Promise<Course> => {
      const { data } = await api.patch(`${API_BASE_URL}${API_ENDPOINTS.COURSES}${id}`, payload);
      return CourseSchema.parse(data);
   },

   deleteCourse: async (id: string): Promise<void> => {
      await api.delete(`${API_BASE_URL}${API_ENDPOINTS.COURSES}${id}`);
   }
}