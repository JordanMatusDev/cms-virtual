import { z } from 'zod';

export const CategorySchema = z.object({
   "nombre": z.string(),
   "activa": z.boolean(),
   "id": z.number(),
   "fecha_creacion": z.coerce.date(),
});
export type Category = z.infer<typeof CategorySchema>;

export const CourseSchema = z.object({
   "titulo": z.string(),
   "descripcion": z.string(),
   "categoria_id": z.number(),
   "video_url": z.string(),
   "duracion_minutos": z.number(),
   "activo": z.boolean(),
   "img": z.union([z.null(), z.string()]),
   "modulos": z.number(),
   "playlist_id": z.union([z.null(), z.string()]),
   "autor": z.string(),
   "id": z.number(),
   "fecha_creacion": z.coerce.date(),
   "categoria": CategorySchema,
});
export type Course = z.infer<typeof CourseSchema>;