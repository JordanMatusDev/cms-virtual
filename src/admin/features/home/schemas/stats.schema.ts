import { z } from 'zod';

export const OverviewSchema = z.object({
   total_users: z.number(),
   total_students: z.number(),
   total_admins: z.number(),
   total_categories: z.number(),
   total_courses: z.number(),
   total_registrations: z.number(),
   total_certificates: z.number(),
});
export type Overview = z.infer<typeof OverviewSchema>;

export const RegistrationsSchema = z.object({
   total: z.number(),
   finished: z.number(),
   in_progress: z.number(),
   with_certificate: z.number(),
});
export type Registrations = z.infer<typeof RegistrationsSchema>;

export const TopCourseSchema = z.object({
   course_id: z.number(),
   title: z.string(),
   registrations_count: z.number(),
});
export type TopCourse = z.infer<typeof TopCourseSchema>;

export const UsersSchema = z.object({
   active: z.number(),
   verified: z.number(),
   new_last_30_days: z.number(),
   online: z.number(),
});
export type Users = z.infer<typeof UsersSchema>;

export const StatsSchema = z.object({
   overview: OverviewSchema,
   users: UsersSchema,
   registrations: RegistrationsSchema,
   top_courses: z.array(TopCourseSchema),
});
export type Stats = z.infer<typeof StatsSchema>;
