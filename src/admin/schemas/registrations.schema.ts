import { z } from 'zod';

export const CategoriaSchema = z.object({
   id: z.number(),
   nombre: z.string(),
   activa: z.boolean(),
   fecha_creacion: z.coerce.date(),
});
export type Categoria = z.infer<typeof CategoriaSchema>;

export const EstudianteSchema = z.object({
   id: z.number(),
   username: z.string(),
   email: z.string(),
   nombre: z.string(),
   apellido: z.string(),
   rol: z.string(),
   activo: z.boolean(),
   avatar: z.union([z.null(), z.string()]),
   verificacion: z.boolean(),
   fecha_creacion: z.coerce.date(),
   fecha_actualizacion: z.coerce.date(),
   ultimo_acceso: z.coerce.date(),
});
export type Estudiante = z.infer<typeof EstudianteSchema>;

export const CursoSchema = z.object({
   id: z.number(),
   titulo: z.string(),
   descripcion: z.string(),
   categoria_id: z.number(),
   video_url: z.string(),
   duracion_minutos: z.number(),
   activo: z.boolean(),
   img: z.string(),
   modulos: z.number(),
   playlist_id: z.string(),
   autor: z.string(),
   fecha_creacion: z.coerce.date(),
   categoria: CategoriaSchema,
});
export type Curso = z.infer<typeof CursoSchema>;

export const CourseRegistrationSchema = z.object({
   id: z.number(),
   estudiante_id: z.number(),
   curso_id: z.number(),
   progreso: z.string(),
   completado: z.number(),
   last_position_seconds: z.string(),
   fecha_inscripcion: z.coerce.date(),
   fecha_completado: z.union([z.coerce.date(), z.null()]),
   estudiante: EstudianteSchema,
   curso: CursoSchema,
});
export type CourseRegistration = z.infer<typeof CourseRegistrationSchema>;
