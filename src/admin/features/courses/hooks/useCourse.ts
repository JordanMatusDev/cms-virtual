import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { coursesService } from "../services/courses.service";
import { type CoursePayload } from "../schemas/coursePayload.schema";

export const useGetCourses = () => {
   return useQuery({
      queryKey: ['Courses'],
      queryFn: coursesService.getCourses
   })
}

export const useGetCourseById = (id?: string) => {
   return useQuery({
      queryKey: ['Course', id],
      queryFn: () => coursesService.getCourseById(id!),
      enabled: !!id
   })
}

export const useCreateCourse = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (coursePayload: CoursePayload) => coursesService.postCourse(coursePayload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['Courses'] });
      }
   })
}

export const useUpdateCourse = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ id, data} : { id: string, data: Partial<CoursePayload> }) => coursesService.patchCourse(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['Courses'] });
         queryClient.invalidateQueries({ queryKey: ['Course', variables.id] });
      }
   })
}

export const useDeleteCourse = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (id: string) => coursesService.deleteCourse(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['Courses'] });
      }
   })
}