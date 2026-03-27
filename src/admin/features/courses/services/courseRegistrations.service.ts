import api, {
   API_BASE_URL,
   API_ENDPOINTS,
} from '@/admin/core/config/apiConfig';
import {
   type CourseRegistration,
   CourseRegistrationSchema,
} from '../schemas/coursesRegistrations.schema';
import { z } from 'zod';

export const courseRegistrationsService = {
   getCourseRegistrations: async (
      courseId: number
   ): Promise<CourseRegistration[]> => {
      const endpoint = API_ENDPOINTS.COURSES_REGISTRATIONS.replace(
         '{course_id}',
         courseId.toString()
      );
      const { data } = await api.get(`${API_BASE_URL}${endpoint}`);
      return z.array(CourseRegistrationSchema).parse(data);
   },
};
