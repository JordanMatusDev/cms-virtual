import * as z from "zod";

export const CategorySchema = z.object({
   "nombre": z.string(),
   "activa": z.boolean(),
   "id": z.number(),
   "fecha_creacion": z.coerce.date(),
});
export type Category = z.infer<typeof CategorySchema>;
