import api, {
   API_BASE_URL,
   API_ENDPOINTS,
} from '@/admin/core/config/apiConfig';
import {
   type CourseRegistration,
   CourseRegistrationSchema,
} from '../../../schemas/registrations.schema';
import { z } from 'zod';

export const userCourseRegistrationsService = {
   getUserCourseRegistrations: async (
      userId: number
   ): Promise<CourseRegistration[]> => {
      const endpoint = API_ENDPOINTS.USERS_REGISTRATIONS.replace(
         '{student_id}',
         userId.toString()
      );
      const { data } = await api.get(`${API_BASE_URL}${endpoint}`);
      return z.array(CourseRegistrationSchema).parse(data);
   },
};
