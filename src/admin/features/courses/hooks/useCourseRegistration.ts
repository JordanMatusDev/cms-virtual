import { useQuery } from '@tanstack/react-query';
import { courseRegistrationsService } from '../services/courseRegistrations.service';
import { type CourseRegistration } from '../../../schemas/registrations.schema';

export const useCourseRegistrations = (courseId: number) => {
   return useQuery<CourseRegistration[]>({
      queryKey: ['CourseRegistrations', courseId],
      queryFn: () =>
         courseRegistrationsService.getCourseRegistrations(courseId),
      enabled: !!courseId,
   });
};
