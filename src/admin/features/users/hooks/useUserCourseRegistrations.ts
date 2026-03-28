import { useQuery } from '@tanstack/react-query';
import { userCourseRegistrationsService } from '../services/userCourseRegistrations.service';
import { type CourseRegistration } from '../../../schemas/registrations.schema';

export const useUserCourseRegistrations = (userId: number) => {
   return useQuery<CourseRegistration[]>({
      queryKey: ['UserCourseRegistrations', userId],
      queryFn: () =>
         userCourseRegistrationsService.getUserCourseRegistrations(userId),
      enabled: !!userId,
   });
};
