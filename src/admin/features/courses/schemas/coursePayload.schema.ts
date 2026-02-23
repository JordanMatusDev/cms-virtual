import * as z from "zod";

export const CoursePayloadSchema = z.object({
   "titulo": z.string().min(1, "El título es requerido"),
   "descripcion": z.string().min(1, "La descripción es requerida"),
   "categoria_id": z.number().min(1, "La categoría es requerida"),
   "video_url": z.string().min(1, "La URL de la playlist es requerida"),
   "duracion_minutos": z.number().min(1, "La duración es requerida"),
   "activo": z.boolean().default(false),
   "img": z.string().nullable(),
   "modulos": z.number().nullable(),
   "playlist_id": z.string().nullable(),
   "autor": z.string().min(1, "El autor es requerido"),
});
export type CoursePayload = z.infer<typeof CoursePayloadSchema>;
