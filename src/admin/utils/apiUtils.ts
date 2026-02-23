import { type AxiosResponse } from "axios";
import { APIErrorSchema } from "@/admin/schemas/apiResponseSchema";
import { ERROR_MSGS } from "@/admin/core/constants/appConstants";

export const handleErrorResponse = (response: AxiosResponse) => {
   const errorData = response.data || {}; 
   const parsedError = APIErrorSchema.safeParse(errorData);
   
   const errorDetail = parsedError.success 
      ? parsedError.data.detail.map(err => {
         const field = err.loc.length > 0 ? err.loc[err.loc.length - 1] : "Campo";
         
         const fieldString = String(field);
         const cleanField = fieldString.charAt(0).toUpperCase() + fieldString.slice(1);
         
         return `${cleanField}: ${err.msg}`;
      }).join(' | ') 
      : (typeof errorData.detail === 'string' ? errorData.detail : ERROR_MSGS.UNKNOWN_ERROR);
   
   throw new Error(errorDetail); 
}