import { z } from "zod";

export const AuthUserResponseSchema = z.object({
   "access_token": z.string(),
   "token_type": z.string(),
   "username": z.string(),
   "email": z.email(),
   "name": z.string().nullable(),
   "surnames": z.string().nullable(),
   "rol": z.string(),
   "status": z.boolean(),
   "verification": z.boolean(),
   "img": z.string().nullable(),
});
export type AuthUserResponse = z.infer<typeof AuthUserResponseSchema>;

export const AuthUserDataSchema = z.object({
   username: z.string(),
   email: z.email(),
   name: z.string().nullable(),
   surnames: z.string().nullable(),
   img: z.string().nullable()
});
export type AuthUserData = z.infer<typeof AuthUserDataSchema>;

export type AuthContextValue = {
   access_token:   string | null;
   usuario:        AuthUserData | null;
   loading:        boolean;
   setLogin:       (userData: AuthUserData, userToken: string) => void;
   setLogout:      () => void;
};