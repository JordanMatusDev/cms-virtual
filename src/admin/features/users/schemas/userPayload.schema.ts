import { boolean, z } from "zod";

export const UserPayloadSchema = z.object({
   "username": z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres."),
   "email": z.email("El correo electrónico no es válido."),
   "password": z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").
   regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Debe tener al menos 8 caracteres, una letra mayúscula y un número.").or(z.literal('')).optional(),
   "name": z.string().nullable(),
   "surnames": z.string().nullable(),
   "rol": z.string().min(1, "El rol es obligatorio."),
   "status": z.boolean(),
   "img": z.string().optional().nullable(),
   "verification": boolean().optional(),
});
export type UserPayload = z.infer<typeof UserPayloadSchema>;