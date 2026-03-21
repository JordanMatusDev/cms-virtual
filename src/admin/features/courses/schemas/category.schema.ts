import { z } from 'zod';

export const CategorySchema = z.object({
   nombre: z.string(),
   activa: z.boolean(),
   id: z.number(),
   fecha_creacion: z.coerce.date(),
   fecha_actualizacion: z.coerce.date().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

export const CategoryPayloadSchema = z.object({
   name: z.string().min(1, 'El nombre de la categoría es requerido'),
   status: z.boolean().default(true),
});
export type CategoryPayload = z.infer<typeof CategoryPayloadSchema>;
