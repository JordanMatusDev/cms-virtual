import { z } from "zod";

export const UserSchema = z.object({
   "username": z.string(),
   "email": z.email(),
   "name": z.string().nullable(),
   "surnames": z.string().nullable(),
   "rol": z.string(),
   "status": z.boolean(),
   "img": z.string().nullable(),
   "id": z.number(),
   "verification": z.boolean(),
   "created_at": z.coerce.date(),
   "updated_at": z.coerce.date(),
   "last_used_at": z.coerce.date(),
});
export type User = z.infer<typeof UserSchema>;