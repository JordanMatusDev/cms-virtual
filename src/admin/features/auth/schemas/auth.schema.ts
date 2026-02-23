import { z } from "zod";

// Esquema para las credenciales de inicio de sesión, con validación de formato
export const CredentialsSchema = z.object({
   "username": z.string().min(1, "El nombre de usuario no puede estar vacío"),
   "password": z.string().min(1, "La contraseña no puede estar vacía"),
});
export type Credentials = z.infer<typeof CredentialsSchema>;