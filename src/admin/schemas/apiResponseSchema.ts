import { z } from "zod";

export const CtxSchema = z.object({
});
export type Ctx = z.infer<typeof CtxSchema>;

export const DetailSchema = z.object({
   "loc": z.array(z.union([z.number(), z.string()])),
   "msg": z.string(),
   "type": z.string(),
   "input": z.string(),
   "ctx": CtxSchema,
});
export type Detail = z.infer<typeof DetailSchema>;

export const APIErrorSchema = z.object({
   "detail": z.array(DetailSchema),
});
export type APIError = z.infer<typeof APIErrorSchema>;

export const APISuccessSchema = z.object({
   "message": z.string(),
});
export type APISuccess = z.infer<typeof APISuccessSchema>;