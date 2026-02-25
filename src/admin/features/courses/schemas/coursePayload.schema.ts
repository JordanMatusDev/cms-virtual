import { z } from "zod";

export const CoursePayloadSchema = z.object({
   "title": z.string().min(1, "El título es requerido"),
   "description": z.string().min(1, "La descripción es requerida"),
   "category_id": z.number().min(1, "La categoría es requerida"),
   "video_url": z.string().min(1, "La URL de la playlist es requerida"),
   "duration_minutes": z.number().min(1, "La duración es requerida"),
   "status": z.boolean(),
   "img": z.string().nullable(),
   "modules": z.number().nullable(),
   "playlist_id": z.string().nullable(),
   "author": z.string().min(1, "El autor es requerido"),
});
export type CoursePayload = z.infer<typeof CoursePayloadSchema>;
